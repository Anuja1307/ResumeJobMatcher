from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch


# ============================================================
# 1. Load BERT NER model
# ============================================================

model_name = "dslim/bert-base-NER"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)


# ============================================================
# 2. Merge adjacent entities of the same type
# ============================================================

def merge_adjacent_entities(entities, text):

    if not entities:
        return []

    merged = [entities[0].copy()]

    for entity in entities[1:]:

        previous = merged[-1]

        # Text between the two entities
        gap = text[
            previous["end"]:entity["start"]
        ]

        # If same entity type and only whitespace separates them,
        # treat them as one entity.
        if (
            previous["type"] == entity["type"]
            and gap.strip() == ""
        ):

            previous["end"] = entity["end"]

            previous["text"] = text[
                previous["start"]:previous["end"]
            ]

        else:

            merged.append(entity.copy())

    return merged


# ============================================================
# 3. Extract entities
# ============================================================

def extract_entities(text):

    # --------------------------------------------------------
    # Check that fast tokenizer is available
    # --------------------------------------------------------

    if not tokenizer.is_fast:
        raise ValueError(
            "A fast tokenizer is required for offset mapping."
        )


    # --------------------------------------------------------
    # Tokenization
    # --------------------------------------------------------

    inputs = tokenizer(
        text,
        return_tensors="pt",
        return_offsets_mapping=True,
        truncation=True
    )


    # Save offset mapping separately
    offset_mapping = inputs.pop(
        "offset_mapping"
    )[0].tolist()


    # --------------------------------------------------------
    # Run BERT
    # --------------------------------------------------------

    with torch.no_grad():

        outputs = model(**inputs)


    # --------------------------------------------------------
    # Get predicted labels
    # --------------------------------------------------------

    predictions = outputs.logits.argmax(
        dim=-1
    )[0]


    labels = [
        model.config.id2label[
            prediction.item()
        ]
        for prediction in predictions
    ]


    # --------------------------------------------------------
    # Get tokens
    # --------------------------------------------------------

    tokens = tokenizer.convert_ids_to_tokens(
        inputs["input_ids"][0]
    )


    # ========================================================
    # 4. Build raw entities using character offsets
    # ========================================================

    entities = []

    current_entity = None


    for token, label, offset in zip(
        tokens,
        labels,
        offset_mapping
    ):

        start, end = offset


        # ----------------------------------------------------
        # Ignore special tokens
        # Example: [CLS], [SEP]
        # ----------------------------------------------------

        if start == end:
            continue


        # ====================================================
        # B-ENTITY
        # ====================================================

        if label.startswith("B-"):

            # Save previous entity
            if current_entity:

                current_entity["text"] = text[
                    current_entity["start"]:
                    current_entity["end"]
                ]

                entities.append(
                    current_entity
                )


            # Start new entity
            current_entity = {

                "type": label[2:],

                "start": start,

                "end": end
            }


        # ====================================================
        # I-ENTITY
        # ====================================================

        elif label.startswith("I-"):

            entity_type = label[2:]


            # Continue existing entity
            if (
                current_entity
                and current_entity["type"]
                == entity_type
            ):

                current_entity["end"] = end


            # Handle unexpected I- without B-
            else:

                if current_entity:

                    current_entity["text"] = text[
                        current_entity["start"]:
                        current_entity["end"]
                    ]

                    entities.append(
                        current_entity
                    )


                current_entity = {

                    "type": entity_type,

                    "start": start,

                    "end": end
                }


        # ====================================================
        # O = Outside entity
        # ====================================================

        else:

            if current_entity:

                current_entity["text"] = text[
                    current_entity["start"]:
                    current_entity["end"]
                ]

                entities.append(
                    current_entity
                )

                current_entity = None


    # ========================================================
    # 5. Add final entity
    # ========================================================

    if current_entity:

        current_entity["text"] = text[
            current_entity["start"]:
            current_entity["end"]
        ]

        entities.append(
            current_entity
        )


    # ========================================================
    # 6. Merge fragmented entities
    # ========================================================

    entities = merge_adjacent_entities(
        entities,
        text
    )


    # ========================================================
    # 7. Organize entities by type
    # ========================================================

    result = {

        "persons": [],

        "organizations": [],

        "locations": [],

        "miscellaneous": []
    }


    for entity in entities:

        entity_type = entity["type"]


        if entity_type == "PER":

            result["persons"].append(
                entity
            )


        elif entity_type == "ORG":

            result["organizations"].append(
                entity
            )


        elif entity_type == "LOC":

            result["locations"].append(
                entity
            )


        elif entity_type == "MISC":

            result["miscellaneous"].append(
                entity
            )


    # ========================================================
    # 8. Return final result
    # ========================================================

    return result