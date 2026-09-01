from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch


# --------------------------------------------------
# 1. Load Model
# --------------------------------------------------

model_name = "dslim/bert-base-NER"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)


# --------------------------------------------------
# 2. Resume Text
# --------------------------------------------------

text = """
Anuja R S
Software Engineer

Experience
Software Developer Intern at ABC Technologies
June 2025 - August 2025

Education
B.Tech in Computer Science
XYZ University

Skills
JavaScript, React, Node.js, MongoDB, Python
"""


# --------------------------------------------------
# 3. Tokenization
# --------------------------------------------------

inputs = tokenizer(
    text,
    return_tensors="pt"
)


# --------------------------------------------------
# 4. Run BERT
# --------------------------------------------------

with torch.no_grad():
    outputs = model(**inputs)


# --------------------------------------------------
# 5. Get Predicted Label IDs
# --------------------------------------------------

predictions = outputs.logits.argmax(dim=-1)


# --------------------------------------------------
# 6. Convert IDs → Actual Labels
# --------------------------------------------------

predicted_labels = [
    model.config.id2label[prediction.item()]
    for prediction in predictions[0]
]


# --------------------------------------------------
# 7. Convert IDs → Tokens
# --------------------------------------------------

tokens = tokenizer.convert_ids_to_tokens(
    inputs["input_ids"][0]
)


# --------------------------------------------------
# 8. Print Raw Token-Level Predictions
# --------------------------------------------------

print("\n========== RAW TOKEN PREDICTIONS ==========\n")

for token, label in zip(tokens, predicted_labels):

    print(f"{token} → {label}")


# --------------------------------------------------
# 9. Remove Special Tokens
# --------------------------------------------------

clean_tokens = []
clean_labels = []

special_tokens = {
    "[CLS]",
    "[SEP]",
    "[PAD]"
}

for token, label in zip(tokens, predicted_labels):

    if token in special_tokens:
        continue

    clean_tokens.append(token)
    clean_labels.append(label)


# --------------------------------------------------
# 10. Reconstruct Subword Tokens
# --------------------------------------------------

def reconstruct_tokens_and_labels(tokens, labels):

    new_tokens = []
    new_labels = []

    for token, label in zip(tokens, labels):

        # Example:
        # Java → B-MISC
        # ##Script → I-MISC
        #
        # becomes:
        # JavaScript → B-MISC

        if token.startswith("##"):

            if new_tokens:
                new_tokens[-1] += token[2:]

        else:

            new_tokens.append(token)
            new_labels.append(label)

    return new_tokens, new_labels


reconstructed_tokens, reconstructed_labels = (
    reconstruct_tokens_and_labels(
        clean_tokens,
        clean_labels
    )
)


# --------------------------------------------------
# 11. Group Entities
# --------------------------------------------------

def group_entities(tokens, labels):

    entities = []

    current_entity = None

    for token, label in zip(tokens, labels):

        # ------------------------------------------
        # New entity starts
        # ------------------------------------------

        if label.startswith("B-"):

            # Save previous entity
            if current_entity:
                entities.append(current_entity)

            entity_type = label[2:]

            current_entity = {
                "word": token,
                "entity": entity_type
            }


        # ------------------------------------------
        # Continue existing entity
        # ------------------------------------------

        elif label.startswith("I-"):

            if current_entity:

                current_entity["word"] += " " + token


        # ------------------------------------------
        # Outside entity
        # ------------------------------------------

        elif label == "O":

            if current_entity:

                entities.append(current_entity)

                current_entity = None


    # ------------------------------------------
    # Save final entity
    # ------------------------------------------

    if current_entity:
        entities.append(current_entity)


    return entities


entities = group_entities(
    reconstructed_tokens,
    reconstructed_labels
)


# --------------------------------------------------
# 12. Print Clean Token Predictions
# --------------------------------------------------

print("\n========== CLEAN TOKEN PREDICTIONS ==========\n")

for token, label in zip(
    reconstructed_tokens,
    reconstructed_labels
):

    print(f"{token} → {label}")


# --------------------------------------------------
# 13. Print Final Entities
# --------------------------------------------------

print("\n========== FINAL ENTITIES ==========\n")

for entity in entities:

    print(
        f"{entity['word']} → {entity['entity']}"
    )