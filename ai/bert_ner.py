from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch


# -----------------------------
# 1. Load model
# -----------------------------

model_name = "dslim/bert-base-NER"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)


# -----------------------------
# 2. Resume text
# -----------------------------

text = """
Anuja Sharma Software Developer
anuja@gmail.com | +91 98765 43210 | Bangalore, India

ABC Technologies
Software Developer Intern

B.Tech in Computer Science and Engineering
Amrita Vishwa Vidyapeetham, Coimbatore
"""


# -----------------------------
# 3. Tokenization
# -----------------------------

if not tokenizer.is_fast:
    raise ValueError("A fast tokenizer is required for offset mapping.")

inputs = tokenizer(
    text,
    return_tensors="pt",
    return_offsets_mapping=True,
    truncation=True
)


# Save offset mapping separately
offset_mapping = inputs.pop("offset_mapping")[0].tolist()


# -----------------------------
# 4. Run BERT
# -----------------------------

with torch.no_grad():
    outputs = model(**inputs)


# -----------------------------
# 5. Get predicted labels
# -----------------------------

predictions = outputs.logits.argmax(dim=-1)[0]

labels = [
    model.config.id2label[prediction.item()]
    for prediction in predictions
]


# -----------------------------
# 6. Get tokens
# -----------------------------

tokens = tokenizer.convert_ids_to_tokens(
    inputs["input_ids"][0]
)


# -----------------------------
# 7. Build entities using offsets
# -----------------------------

entities = []

current_entity = None


for token, label, offset in zip(
    tokens,
    labels,
    offset_mapping
):

    start, end = offset

    # Ignore special tokens
    if start == end:
        continue

    # -------------------------
    # Beginning of entity
    # -------------------------

    if label.startswith("B-"):

        # Save previous entity
        if current_entity:
            current_entity["text"] = text[
                current_entity["start"]:
                current_entity["end"]
            ]

            entities.append(current_entity)

        current_entity = {
            "type": label[2:],
            "start": start,
            "end": end
        }


    # -------------------------
    # Inside entity
    # -------------------------

    elif label.startswith("I-"):

        entity_type = label[2:]

        if (
            current_entity
            and current_entity["type"] == entity_type
        ):
            current_entity["end"] = end

        else:
            # Handle unexpected I- without B-
            if current_entity:
                current_entity["text"] = text[
                    current_entity["start"]:
                    current_entity["end"]
                ]

                entities.append(current_entity)

            current_entity = {
                "type": entity_type,
                "start": start,
                "end": end
            }


    # -------------------------
    # Outside entity
    # -------------------------

    else:

        if current_entity:

            current_entity["text"] = text[
                current_entity["start"]:
                current_entity["end"]
            ]

            entities.append(current_entity)

            current_entity = None


# -----------------------------
# 8. Add final entity
# -----------------------------

if current_entity:

    current_entity["text"] = text[
        current_entity["start"]:
        current_entity["end"]
    ]

    entities.append(current_entity)


# -----------------------------
# 9. Organize entities
# -----------------------------

result = {
    "persons": [],
    "organizations": [],
    "locations": [],
    "miscellaneous": []
}


for entity in entities:

    entity_type = entity["type"]

    if entity_type == "PER":
        result["persons"].append(entity)

    elif entity_type == "ORG":
        result["organizations"].append(entity)

    elif entity_type == "LOC":
        result["locations"].append(entity)

    elif entity_type == "MISC":
        result["miscellaneous"].append(entity)


# -----------------------------
# 10. Print results
# -----------------------------

print("\n===== RAW ENTITIES =====")

for entity in entities:
    print(entity)


print("\n===== ORGANIZED ENTITIES =====")

print(result)