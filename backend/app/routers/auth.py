from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Profile
from ..schemas import UserCreate, Token, UserResponse, ProfileResponse
from ..auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    hashed_pw = get_password_hash(user_in.password)
    new_user = User(email=user_in.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically create a blank profile for the new user
    # Generate default profile values from email prefix
    default_name = user_in.email.split("@")[0].capitalize()
    new_profile = Profile(
        user_id=new_user.id,
        name=default_name,
        age=22,
        gender="Other",
        city="Unknown",
        bio="",
        occupation="",
        university="",
        interests_json="[]",
        hobbies_json="[]",
        favorite_activities_json="[]",
        languages_json="[]",
        profile_pic=f"https://api.dicebear.com/7.x/adventurer/svg?seed={default_name}",
        latitude=37.7749, # Default San Francisco Coords
        longitude=-122.4194
    )
    db.add(new_profile)
    db.commit()

    # Generate token
    token_data = {"sub": new_user.email, "user_id": new_user.id}
    access_token = create_access_token(data=token_data)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token_data = {"sub": user.email, "user_id": user.id}
    access_token = create_access_token(data=token_data)
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint supporting direct JSON body login (useful for client axios requests)
@router.post("/login-json", response_model=Token)
def login_json(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token_data = {"sub": user.email, "user_id": user.id}
    access_token = create_access_token(data=token_data)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at,
        "profile": {
            "name": profile.name,
            "age": profile.age,
            "gender": profile.gender,
            "city": profile.city,
            "bio": profile.bio,
            "occupation": profile.occupation,
            "university": profile.university,
            "interests": profile.interests,
            "hobbies": profile.hobbies,
            "favorite_activities": profile.favorite_activities,
            "languages": profile.languages,
            "profile_pic": profile.profile_pic,
            "latitude": profile.latitude,
            "longitude": profile.longitude,
            "active_goal": profile.active_goal
        } if profile else None
    }

@router.post("/google", response_model=Token)
def google_login(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    name = payload.get("name", "Google User")
    picture = payload.get("picture")
    
    if not email:
        raise HTTPException(status_code=400, detail="Google authentication failed")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create user with blank password since it's OAuth
        user = User(email=email, hashed_password=get_password_hash("GOOGLE_MOCK_PASSWORD"))
        db.add(user)
        db.commit()
        db.refresh(user)
        
        new_profile = Profile(
            user_id=user.id,
            name=name,
            age=25,
            gender="Other",
            city="New York",
            bio="Hello! I joined Plan B using Google.",
            occupation="",
            university="",
            interests_json="[]",
            hobbies_json="[]",
            favorite_activities_json="[]",
            languages_json="[]",
            profile_pic=picture or f"https://api.dicebear.com/7.x/adventurer/svg?seed={name}",
            latitude=40.7128,
            longitude=-74.0060
        )
        db.add(new_profile)
        db.commit()
        
    token_data = {"sub": user.email, "user_id": user.id}
    access_token = create_access_token(data=token_data)
    return {"access_token": access_token, "token_type": "bearer"}
