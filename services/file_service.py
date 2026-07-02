import os
import pandas as pd
from database.database import engine

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_file(file):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path


def upload_to_database(file_path):
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    # Table name = filename without extension
    table_name = os.path.splitext(os.path.basename(file_path))[0]

    df.to_sql(
        table_name,
        engine,
        if_exists="replace",
        index=False
    )

    return table_name, len(df), list(df.columns)