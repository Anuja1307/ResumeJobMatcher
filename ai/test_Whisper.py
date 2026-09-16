import json
from whisper_service import transcribe_audio_file

if __name__ == "__main__":
    result = transcribe_audio_file("test_audio.wav")

    print("========================================")
    print("     TRANSCRIPTION & METRICS TEST")
    print("========================================")
    print("Transcript:      ", result.get("transcript"))
    print("Language:        ", result.get("language"))
    print("Word Count:      ", result.get("wordCount"))
    print("Duration (s):    ", result.get("duration"))
    print("Speaking Rate:   ", result.get("speakingRate"))
    print("Filler Word Count:", result.get("fillerWordCount"))
    print("Filler Words:    ", json.dumps(result.get("fillerWords"), indent=2))