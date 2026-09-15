import math
from embedding_service import generate_embedding


def cosine_similarity(vector_a, vector_b):
    dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
    magnitude_a = math.sqrt(sum(a * a for a in vector_a))
    magnitude_b = math.sqrt(sum(b * b for b in vector_b))
    return dot_product / (magnitude_a * magnitude_b)


text_a = """
Full-stack developer experienced in
React, Node.js and MongoDB.
"""

text_b = """
A recipe for making chocolate cake
with flour, eggs and sugar.
"""

text_c = """
Software engineer skilled in JavaScript,
Node.js, Express and database design.
"""

embedding_a = generate_embedding(text_a)
embedding_b = generate_embedding(text_b)
embedding_c = generate_embedding(text_c)

sim_ab = cosine_similarity(embedding_a, embedding_b)
sim_ac = cosine_similarity(embedding_a, embedding_c)

print("Embedding A dimensions:", len(embedding_a))
print("Embedding B dimensions:", len(embedding_b))
print("Cosine similarity (Dev vs Cake):", sim_ab)
print("Cosine similarity (Dev vs Dev):", sim_ac)