import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration: using a local SQLite file (or /tmp on Vercel)
DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL")
if DATABASE_URL:
    # SQLAlchemy requires postgresql:// instead of postgres://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    if os.getenv("VERCEL"):
        DATABASE_URL = "sqlite:////tmp/plan_b.db"
    else:
        DATABASE_URL = "sqlite:///./plan_b.db"


# SQLite needs 'check_same_thread: False' for multi-threaded access
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db session in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
