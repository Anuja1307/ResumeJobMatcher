from transformers import pipeline
ner =pipeline("ner")
test="Anuja works at Google in Banglore"
result=ner(test)
print(result)
