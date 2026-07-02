from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Base project directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Create database folder if it doesn't exist
DATABASE_DIR = BASE_DIR / "database"
DATABASE_DIR.mkdir(exist_ok=True)

# Database file
DATABASE_PATH = DATABASE_DIR / "app.db"

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

print(f"Database location: {DATABASE_PATH}")