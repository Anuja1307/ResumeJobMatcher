import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_openai_client():
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)


def generate_embedding(text):
    provider = os.getenv("AI_PROVIDER", "openai").lower()

    if provider == "openai":
        try:
            client = get_openai_client()
            model = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
            response = client.embeddings.create(
                input=text,
                model=model
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"OpenAI embedding error: {e}")
            raise RuntimeError(f"Embedding generation failed via OpenAI: {e}")
    else:
        # Fallback to local Ollama
        ollama_url = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434").rstrip("/") + "/api/embed"
        embedding_model = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")

        try:
            response = requests.post(
                ollama_url,
                json={
                    "model": embedding_model,
                    "input": text
                },
                timeout=60
            )
            response.raise_for_status()
            data = response.json()
            return data["embeddings"][0]
        except Exception as e:
            print(f"Ollama embedding error: {e}")
            raise RuntimeError(f"Embedding generation failed via Ollama: {e}")