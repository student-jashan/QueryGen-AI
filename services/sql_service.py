from sqlalchemy import inspect, text
from database.database import engine


def get_schema(table_name: str):
    """
    Get table schema from SQLite.
    """

    inspector = inspect(engine)

    columns = inspector.get_columns(table_name)

    schema = ""

    for column in columns:
        schema += f"{column['name']} ({column['type']})\n"

    return schema


def execute_sql(query: str):
    """
    Execute SQL query and return results.
    """

    with engine.connect() as conn:
        result = conn.execute(text(query))

        columns = result.keys()

        rows = result.fetchall()

    data = [
        dict(zip(columns, row))
        for row in rows
    ]

    return data