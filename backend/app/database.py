import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration: check if cloud PostgreSQL URL is provided
DATABASE_URL = os.getenv("DATABASE_URL")

# Resolve compatibility for 'postgres://' schema prefix if returned by cloud providers
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Fallback to local SQLite file if no database URL is set in environment
if not DATABASE_URL:
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
