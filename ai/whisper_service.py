import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

FILLER_WORDS = {
    "um", "uh", "like", "you know", "actually", "basically",
    "so", "okay", "right", "i mean", "well"
}

def analyze_audio_metrics(transcript, duration=0.0):
    words = re.findall(r'\b[a-zA-Z0-9\']+\b', transcript)
    word_count = len(words)
    speaking_rate = round((word_count / duration * 60), 2) if duration > 0 else 0.0

    found_fillers = {}
    total_fillers = 0
    lower_words = [w.lower() for w in words]

    for word in lower_words:
        if word in FILLER_WORDS:
            found_fillers[word] = found_fillers.get(word, 0) + 1
            total_fillers += 1

    lower_text = transcript.lower()
    for phrase in ["you know", "i mean"]:
        count = lower_text.count(phrase)
        if count > 0 and phrase not in found_fillers:
            found_fillers[phrase] = count
            total_fillers += count

    filler_words_list = [{"word": k, "count": v} for k, v in found_fillers.items()]

    return {
        "wordCount": word_count,
        "duration": round(duration, 2),
        "speakingRate": speaking_rate,
        "fillerWordCount": total_fillers,
        "fillerWords": filler_words_list
    }

def get_openai_client():
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)

def transcribe_audio_file(file_path):
    provider = os.getenv("AI_PROVIDER", "openai").lower()

    if provider == "openai":
        try:
            client = get_openai_client()
            model_name = os.getenv("OPENAI_TRANSCRIPTION_MODEL", "whisper-1")

            with open(file_path, "rb") as audio_file:
                response = client.audio.transcriptions.create(
                    model=model_name,
                    file=audio_file,
                    response_format="verbose_json"
                )

            transcript = getattr(response, "text", "") or ""
            duration = float(getattr(response, "duration", 0.0) or 0.0)
            language = getattr(response, "language", "english") or "english"

            metrics = analyze_audio_metrics(transcript, duration)

            return {
                "transcript": transcript,
                "language": language,
                **metrics
            }
        except Exception as e:
            print(f"OpenAI transcription error: {e}")
            raise RuntimeError(f"Audio transcription failed via OpenAI: {e}")
    else:
        # Local faster-whisper fallback
        from faster_whisper import WhisperModel
        model = WhisperModel("base", device="cpu", compute_type="int8")
        segments, info = model.transcribe(file_path, beam_size=5)

        segment_list = list(segments)
        transcript = " ".join(s.text.strip() for s in segment_list)
        duration = float(info.duration) if hasattr(info, "duration") else 0.0

        metrics = analyze_audio_metrics(transcript, duration)

        return {
            "transcript": transcript,
            "language": info.language,
            **metrics
        }