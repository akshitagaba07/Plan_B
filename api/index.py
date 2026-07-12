import os
import sys

# Add the api directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

from app.main import app
from app.database import engine, Base

# On Vercel, /tmp is ephemeral — ensure all tables are created on every cold start
# This is a no-op if tables already exist
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create DB tables in Vercel entry point: {e}")

