from embeddding_service import generate_embedding


text = """
Full-stack developer experienced in
React, Node.js, Express and MongoDB.
"""


embedding = generate_embedding(text)


print("Dimensions:", len(embedding))
print("First 10 values:", embedding[:10])