from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Profile, Match, Mood
from ..schemas import MatchResponse, MatchAction
from ..auth import get_current_user
from ..ai import calculate_compatibility, generate_icebreakers

router = APIRouter(prefix="/api/matches", tags=["AI Matching & Discovery"])

@router.get("", response_model=List[MatchResponse])
def get_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    my_profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not my_profile:
        raise HTTPException(status_code=404, detail="Please create your profile first.")
        
    # Get my current mood today to factor into compatibility
    import datetime
    today = datetime.date.today()
    start_dt = datetime.datetime.combine(today, datetime.time.min)
    my_mood = db.query(Mood).filter(
        Mood.user_id == current_user.id,
        Mood.created_at >= start_dt
    ).order_by(Mood.created_at.desc()).first()
    my_mood_val = my_mood.mood if my_mood else None

    # Load all other user profiles
    other_profiles = db.query(Profile).filter(Profile.user_id != current_user.id).all()
    
    # Get active exclusions (blocked, reported, or already connected matches)
    exclusions = db.query(Match).filter(
        ((Match.user_a_id == current_user.id) | (Match.user_b_id == current_user.id)) &
        (Match.status.in_(["blocked", "reported", "connected"]))
    ).all()
    
    excluded_user_ids = set()
    connection_statuses = {}
    for ex in exclusions:
        other_id = ex.user_b_id if ex.user_a_id == current_user.id else ex.user_a_id
        excluded_user_ids.add(other_id)
        connection_statuses[other_id] = ex.status

    matches = []
    for profile in other_profiles:
        # Skip explicitly blocked or reported users
        if profile.user_id in excluded_user_ids and connection_statuses.get(profile.user_id) in ["blocked", "reported"]:
            continue
            
        # Get other user's latest mood today
        other_mood = db.query(Mood).filter(
            Mood.user_id == profile.user_id,
            Mood.created_at >= start_dt
        ).order_by(Mood.created_at.desc()).first()
        other_mood_val = other_mood.mood if other_mood else None
        
        # Calculate compatibility
        score, mutual_interests, distance = calculate_compatibility(
            my_profile,
            profile,
            my_mood_val,
            other_mood_val
        )
        
        status_val = connection_statuses.get(profile.user_id, "matched")
        
        # Map profile columns to schema structure
        prof_data = {
            "user_id": profile.user_id,
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
            "longitude": profile.longitude
        }
        
        matches.append({
            "id": profile.user_id,
            "profile": prof_data,
            "score": score,
            "mutual_interests": mutual_interests,
            "distance": distance,
            "status": status_val
        })
        
    # Sort matches by compatibility score descending
    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches

@router.post("/{target_user_id}/action")
def perform_match_action(
    target_user_id: int,
    action_in: MatchAction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    action = action_in.action.lower()
    if action not in ["connect", "block", "report"]:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    # Check if target user exists
    target = db.query(User).filter(User.id == target_user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")
        
    # Check if match entry already exists
    match_entry = db.query(Match).filter(
        ((Match.user_a_id == current_user.id) & (Match.user_b_id == target_user_id)) |
        ((Match.user_a_id == target_user_id) & (Match.user_b_id == current_user.id))
    ).first()
    
    status_mapping = {
        "connect": "connected",
        "block": "blocked",
        "report": "reported"
    }
    
    mapped_status = status_mapping[action]
    
    if match_entry:
        match_entry.status = mapped_status
    else:
        # Create a new Match entry
        match_entry = Match(
            user_a_id=current_user.id,
            user_b_id=target_user_id,
            score=0.0, # Will be calculated if query lists them, or left at 0 for system logs
            status=mapped_status
        )
        db.add(match_entry)
        
    db.commit()
    return {"message": f"Successfully performed '{action}' action on user {target_user_id}", "status": mapped_status}

@router.post("/{target_user_id}/icebreaker")
def get_match_icebreakers(
    target_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    my_profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    target_profile = db.query(Profile).filter(Profile.user_id == target_user_id).first()
    
    if not my_profile or not target_profile:
        raise HTTPException(status_code=404, detail="Profile details missing")
        
    icebreakers = generate_icebreakers(my_profile, target_profile)
    return {"icebreakers": icebreakers}
