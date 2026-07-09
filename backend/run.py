import os
import sys
import uvicorn

# Add the parent directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if __name__ == "__main__":
    print("Starting Plan B FastAPI Backend on http://localhost:8000...")
    uvicorn.run("api.app.main:app", host="0.0.0.0", port=8000, reload=True)
