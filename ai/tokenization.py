from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")
text = "Rahul is a full-stack developer skilled in JavaScript."
tokens = tokenizer.tokenize(text)
input=tokenizer(text)
print(input)

print(tokens)
token_ids = tokenizer.convert_tokens_to_ids(tokens)

print(token_ids)