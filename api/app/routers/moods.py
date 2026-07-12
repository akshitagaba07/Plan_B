from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import datetime
from ..database import get_db
from ..models import User, Mood
from ..schemas import MoodCreate, MoodResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/moods", tags=["Mood Check-Ins"])

@router.post("", response_model=MoodResponse)
def log_mood(
    mood_in: MoodCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Standard moods: 😊 Happy, 😐 Okay, 😔 Lonely, 😰 Stressed, 😴 Tired, 🎉 Excited
    allowed_moods = ["Happy", "Okay", "Lonely", "Stressed", "Tired", "Excited"]
    cleaned_mood = mood_in.mood.strip().capitalize()
    
    # Extract just the word in case user sends it with emoji
    for m in allowed_moods:
        if m in cleaned_mood or m.lower() in mood_in.mood.lower():
            cleaned_mood = m
            break
            
    new_mood = Mood(
        user_id=current_user.id,
        mood=cleaned_mood,
        note=mood_in.note,
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_mood)
    db.commit()
    db.refresh(new_mood)
    return new_mood

@router.get("", response_model=List[MoodResponse])
def get_mood_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Mood).filter(Mood.user_id == current_user.id).order_by(Mood.created_at.desc()).all()

@router.get("/stats")
def get_mood_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Total counts per mood
    results = db.query(Mood.mood, func.count(Mood.id)).filter(Mood.user_id == current_user.id).group_by(Mood.mood).all()
    distribution = {mood: count for mood, count in results}
    
    # Ensure all allowed moods are represented
    allowed_moods = ["Happy", "Okay", "Lonely", "Stressed", "Tired", "Excited"]
    for m in allowed_moods:
        if m not in distribution:
            distribution[m] = 0
            
    # 2. Daily mood history for the last 7 days (line chart data)
    today = datetime.datetime.utcnow().date()
    history = []
    
    # Mapping moods to scores for numeric line graph rendering
    mood_scores = {
        "Excited": 100,
        "Happy": 80,
        "Okay": 60,
        "Tired": 40,
        "Stressed": 20,
        "Lonely": 10
    }
    
    for i in range(6, -1, -1):
        day = today - datetime.timedelta(days=i)
        start_dt = datetime.datetime.combine(day, datetime.time.min)
        end_dt = datetime.datetime.combine(day, datetime.time.max)
        
        # Get the latest mood logged on this day
        daily_mood = db.query(Mood).filter(
            Mood.user_id == current_user.id,
            Mood.created_at >= start_dt,
            Mood.created_at <= end_dt
        ).order_by(Mood.created_at.desc()).first()
        
        history.append({
            "date": day.strftime("%b %d"),
            "mood": daily_mood.mood if daily_mood else "None",
            "score": mood_scores.get(daily_mood.mood, 60) if daily_mood else None, # 60 as standard fallback
            "note": daily_mood.note if daily_mood else ""
        })
        
    return {
        "distribution": distribution,
        "history": history
    }
