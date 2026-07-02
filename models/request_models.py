from pydantic import BaseModel


class AskRequest(BaseModel):
    question: str
    table_name: str = ""