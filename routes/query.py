from fastapi import APIRouter, HTTPException
from sqlalchemy import inspect
import traceback

from models.request_models import AskRequest
from services.sql_service import get_schema
from services.llm_service import generate_sql
from services.database_service import execute_query
from database.database import engine

router = APIRouter()


def get_latest_table():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if not tables:
        raise HTTPException(status_code=400, detail="No tables found. Upload a dataset first.")
    return tables[-1]


@router.post("/ask")
async def ask_question(request: AskRequest):

    try:
        table_name = request.table_name if request.table_name else get_latest_table()

        schema = get_schema(table_name)

        sql = generate_sql(
            question=request.question,
            schema=schema,
            table_name=table_name
        )

        print("Generated SQL:")
        print(sql)

        # Execute SQL
        results = execute_query(sql)

        return {
            "question": request.question,
            "generated_sql": sql,
            "row_count": len(results),
            "results": results
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )