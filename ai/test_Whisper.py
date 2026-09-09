from whisper_service import model

segments, info = model.transcribe(
    "test_audio.wav",
    beam_size=5
)

print("Detected language:", info.language)

print("\nTranscript:")

for segment in segments:
    print(segment.text)