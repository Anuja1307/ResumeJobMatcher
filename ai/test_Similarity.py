import requests
import math


def get_embedding(text):

    response = requests.post(
        "http://localhost:11434/api/embed",
        json={
            "model": "nomic-embed-text",
            "input": text
        }
    )

    return response.json()["embeddings"][0]


def cosine_similarity(vector_a, vector_b):

    dot_product = sum(
        a * b
        for a, b in zip(vector_a, vector_b)
    )

    magnitude_a = math.sqrt(
        sum(a * a for a in vector_a)
    )

    magnitude_b = math.sqrt(
        sum(b * b for b in vector_b)
    )

    return dot_product / (
        magnitude_a * magnitude_b
    )


text_a = """
Full-stack developer experienced in
React, Node.js and MongoDB.
"""

text_b = """
A recipe for making chocolate cake
with flour, eggs and sugar.
"""

embedding_a = get_embedding(text_a)
embedding_b = get_embedding(text_b)

similarity = cosine_similarity(
    embedding_a,
    embedding_b
)

print("Embedding A dimensions:", len(embedding_a))
print("Embedding B dimensions:", len(embedding_b))
print("Cosine similarity:", similarity)