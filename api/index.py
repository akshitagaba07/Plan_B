import sys
import os

# Add backend directory to Python path so relative imports inside app work correctly
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "..", "backend"))

from app.main import app
