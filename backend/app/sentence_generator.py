from typing import List
from pydantic import BaseModel
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class CombinedSentence(BaseModel):
    sentence: str

class SentenceGenerator:
    @staticmethod
    def generate_sentence(words: str) -> str:
        prompt = f"기존의 단어들을 유지하며 맞춤법을 지키고, 문장이나 구절을 다듬어주세요.: {words}"
 
        try:
            completion = client.chat.completions.create(
                model="gpt-4-turbo", # 또는 사용 가능한 다른 모델
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=100
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating sentence: {e}")
            return "Failed to generate a sentence."

    @staticmethod
    def create_sentence(words: str) -> CombinedSentence:
        sentence = SentenceGenerator.generate_sentence(words)
        return CombinedSentence(sentence=sentence)