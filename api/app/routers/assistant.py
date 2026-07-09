from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
from ..database import get_db
from ..models import User, Profile, Mood
from ..schemas import AssistantRequest, AssistantResponse
from ..auth import get_current_user
from ..ai import run_assistant_query

router = APIRouter(prefix="/api/assistant", tags=["AI Wellness Companion"])

@router.post("", response_model=AssistantResponse)
def get_assistant_advice(
    req: AssistantRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not configured")
        
    # Get latest logged mood to pass to AI assistant context
    today = datetime.date.today()
    start_dt = datetime.datetime.combine(today, datetime.time.min)
    latest_mood = db.query(Mood).filter(
        Mood.user_id == current_user.id,
        Mood.created_at >= start_dt
    ).order_by(Mood.created_at.desc()).first()
    
    mood_str = latest_mood.mood if latest_mood else "Neutral"
    
    # Run the query
    result = run_assistant_query(req.message, profile, mood_str, db)
    
    # Map results to schemas
    people = []
    for p in result["suggested_people"]:
        people.append({
            "user_id": p.user_id,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "city": p.city,
            "bio": p.bio,
            "occupation": p.occupation,
            "university": p.university,
            "interests": p.interests,
            "hobbies": p.hobbies,
            "favorite_activities": p.favorite_activities,
            "languages": p.languages,
            "profile_pic": p.profile_pic,
            "latitude": p.latitude,
            "longitude": p.longitude
        })
        
    events = []
    for e in result["suggested_events"]:
        # Simple mapping for event responses
        events.append({
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "date": e.date,
            "time": e.time,
            "location": e.location,
            "category": e.category,
            "max_participants": e.max_participants,
            "host_id": e.host_id,
            "created_at": e.created_at
        })
        
    communities = []
    for c in result["suggested_communities"]:
        communities.append({
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "cover_image": c.cover_image,
            "category": c.category,
            "creator_id": c.creator_id,
            "created_at": c.created_at
        })
        
    return {
        "reply": result["reply"],
        "suggested_people": people,
        "suggested_events": events,
        "suggested_communities": communities,
        "suggested_activities": result["suggested_activities"]
    }
