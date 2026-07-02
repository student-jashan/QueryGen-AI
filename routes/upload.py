from fastapi import APIRouter, UploadFile, File
from services.file_service import save_file, upload_to_database

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    filepath = save_file(file)

    table_name, row_count, columns = upload_to_database(filepath)

    return {
        "filename": file.filename,
        "table_name": table_name,
        "row_count": row_count,
        "column_count": len(columns),
        "message": "File uploaded successfully!",
        "path": filepath
    }