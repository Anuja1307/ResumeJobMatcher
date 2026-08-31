from transformers import AutoTokenizer, AutoModelForTokenClassification

model_name = "dslim/bert-base-NER"

tokenizer = AutoTokenizer.from_pretrained(model_name)

model = AutoModelForTokenClassification.from_pretrained(model_name)

text = "Anuja works at Microsoft in Bangalore."

inputs = tokenizer(text, return_tensors="pt")

outputs = model(**inputs)

predictions = outputs.logits.argmax(dim=-1)

predicted_labels = [
    model.config.id2label[prediction.item()]
    for prediction in predictions[0]
]

tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])

for token, label in zip(tokens, predicted_labels):
    print(token, "→", label)


def group_entities(tokens, labels):

    entities = []
    current_entity = None

    for token, label in zip(tokens, labels):

        if label.startswith("B-"):

            if current_entity:
                entities.append(current_entity)

            current_entity = {
                "word": token,
                "entity": label[2:]
            }

        elif label.startswith("I-"):

            if current_entity:
                current_entity["word"] += " " + token

        elif label == "O":

            if current_entity:
                entities.append(current_entity)
                current_entity = None

    if current_entity:
        entities.append(current_entity)

    return entities

entities = group_entities(tokens, predicted_labels)
print(entities)