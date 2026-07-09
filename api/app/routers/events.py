from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import User, Profile, Event, EventParticipant
from ..schemas import EventCreate, EventResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/events", tags=["Events & Meetups"])

def build_event_response(event: Event, db: Session) -> dict:
    host_profile = db.query(Profile).filter(Profile.user_id == event.host_id).first()
    
    # Load all participant details
    participants_db = db.query(EventParticipant).filter(EventParticipant.event_id == event.id).all()
    participants = []
    for p in participants_db:
        p_profile = db.query(Profile).filter(Profile.user_id == p.user_id).first()
        prof_data = None
        if p_profile:
            prof_data = {
                "user_id": p_profile.user_id,
                "name": p_profile.name,
                "age": p_profile.age,
                "gender": p_profile.gender,
                "city": p_profile.city,
                "bio": p_profile.bio,
                "occupation": p_profile.occupation,
                "university": p_profile.university,
                "interests": p_profile.interests,
                "hobbies": p_profile.hobbies,
                "favorite_activities": p_profile.favorite_activities,
                "languages": p_profile.languages,
                "profile_pic": p_profile.profile_pic,
                "latitude": p_profile.latitude,
                "longitude": p_profile.longitude
            }
        participants.append({
            "id": p.id,
            "event_id": p.event_id,
            "user_id": p.user_id,
            "joined_at": p.joined_at,
            "profile": prof_data
        })
        
    host_prof_data = None
    if host_profile:
        host_prof_data = {
            "user_id": host_profile.user_id,
            "name": host_profile.name,
            "age": host_profile.age,
            "gender": host_profile.gender,
            "city": host_profile.city,
            "bio": host_profile.bio,
            "occupation": host_profile.occupation,
            "university": host_profile.university,
            "interests": host_profile.interests,
            "hobbies": host_profile.hobbies,
            "favorite_activities": host_profile.favorite_activities,
            "languages": host_profile.languages,
            "profile_pic": host_profile.profile_pic,
            "latitude": host_profile.latitude,
            "longitude": host_profile.longitude
        }
        
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date,
        "time": event.time,
        "location": event.location,
        "category": event.category,
        "max_participants": event.max_participants,
        "host_id": event.host_id,
        "host_profile": host_prof_data,
        "participants": participants,
        "created_at": event.created_at
    }

@router.get("", response_model=List[EventResponse])
def get_events(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    if category and category != "All":
        query = query.filter(Event.category == category)
        
    events = query.order_by(Event.date.asc()).all()
    return [build_event_response(e, db) for e in events]

@router.get("/{event_id}", response_model=EventResponse)
def get_event_by_id(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return build_event_response(event, db)

@router.post("", response_model=EventResponse)
def create_event(
    event_in: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_event = Event(
        title=event_in.title,
        description=event_in.description,
        date=event_in.date,
        time=event_in.time,
        location=event_in.location,
        category=event_in.category,
        max_participants=event_in.max_participants,
        host_id=current_user.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    # Host automatically joins their own event
    part = EventParticipant(event_id=new_event.id, user_id=current_user.id)
    db.add(part)
    db.commit()
    
    return build_event_response(new_event, db)

@router.post("/{event_id}/join")
def join_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Check if user is already joined
    joined_entry = db.query(EventParticipant).filter(
        EventParticipant.event_id == event_id,
        EventParticipant.user_id == current_user.id
    ).first()
    
    if joined_entry:
        # Toggle leave if already joined
        db.delete(joined_entry)
        db.commit()
        return {"message": "You left the event successfully", "joined": False}
        
    # Check if event has reached capacity
    count = db.query(EventParticipant).filter(EventParticipant.event_id == event_id).count()
    if count >= event.max_participants:
        raise HTTPException(status_code=400, detail="This event is already full")
        
    # Join the event
    new_part = EventParticipant(event_id=event_id, user_id=current_user.id)
    db.add(new_part)
    db.commit()
    return {"message": "You joined the event successfully", "joined": True}
