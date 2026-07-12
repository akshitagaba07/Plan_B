import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Profile
from ..schemas import ProfileResponse, ProfileUpdate
from ..auth import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profiles"])

# Upload directory setup
if os.getenv("VERCEL"):
    UPLOAD_DIR = "/tmp/static/profile_pics"
else:
    UPLOAD_DIR = "static/profile_pics"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    update_data = profile_in.model_dump(exclude_unset=True)
    
    # Handle list conversions to JSON strings
    if "interests" in update_data:
        profile.interests = update_data.pop("interests")
    if "hobbies" in update_data:
        profile.hobbies = update_data.pop("hobbies")
    if "favorite_activities" in update_data:
        profile.favorite_activities = update_data.pop("favorite_activities")
    if "languages" in update_data:
        profile.languages = update_data.pop("languages")
        
    for key, val in update_data.items():
        setattr(profile, key, val)
        
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/picture", response_model=ProfileResponse)
def upload_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    # Check folder and write file
    file_extension = file.filename.split(".")[-1]
    filename = f"user_{current_user.id}.{file_extension}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Set public URL path
    profile.profile_pic = f"/static/profile_pics/{filename}"
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/detect-location", response_model=ProfileResponse)
def detect_location(
    coords: dict, # expects {"latitude": float, "longitude": float}
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    lat = coords.get("latitude")
    lon = coords.get("longitude")
    city = coords.get("city")
    
    if lat is not None and lon is not None:
        profile.latitude = lat
        profile.longitude = lon
    if city:
        profile.city = city
        
    db.commit()
    db.refresh(profile)
    return profile
