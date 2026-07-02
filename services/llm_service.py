import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("MISTRAL_API_KEY"),
    base_url="https://api.mistral.ai/v1"
)


def generate_sql(question: str, schema: str, table_name: str):

    prompt = f"""
You are an expert SQLite SQL generator.

Rules:
- Generate ONLY valid SQLite SQL.
- Return ONLY the SQL query.
- Do not include explanations.
- Only generate SELECT queries.

Table:
{table_name}

Schema:
{schema}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="mistral-small-latest",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    sql = response.choices[0].message.content.strip()

    sql = sql.replace("```sql", "").replace("```", "").strip()

    if not sql.upper().startswith("SELECT"):
        raise ValueError("Only SELECT queries are allowed.")

    return sql