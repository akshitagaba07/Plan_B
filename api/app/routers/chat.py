from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from ..database import get_db
from ..models import User, Profile, Chat, Match
from ..schemas import ChatCreate, ChatResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/chat", tags=["Direct Chat"])

@router.get("/contacts")
def get_chat_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve all matched entries where they are "connected"
    connections = db.query(Match).filter(
        ((Match.user_a_id == current_user.id) | (Match.user_b_id == current_user.id)) &
        (Match.status == "connected")
    ).all()
    
    contacts = []
    for conn in connections:
        other_id = conn.user_b_id if conn.user_a_id == current_user.id else conn.user_a_id
        
        other_profile = db.query(Profile).filter(Profile.user_id == other_id).first()
        if not other_profile:
            continue
            
        # Get the very last message in their conversation history
        last_msg = db.query(Chat).filter(
            ((Chat.sender_id == current_user.id) & (Chat.receiver_id == other_id)) |
            ((Chat.sender_id == other_id) & (Chat.receiver_id == current_user.id))
        ).order_by(Chat.timestamp.desc()).first()
        
        contacts.append({
            "user_id": other_id,
            "name": other_profile.name,
            "profile_pic": other_profile.profile_pic,
            "last_message": last_msg.message if last_msg else "No messages yet",
            "last_message_time": last_msg.timestamp if last_msg else None,
            "unread": False # Can expand with unread flag if desired
        })
        
    # Sort contacts by last message time descending
    contacts.sort(key=lambda x: x["last_message_time"] or datetime_placeholder(), reverse=True)
    return contacts

def datetime_placeholder():
    import datetime
    return datetime.datetime.min

@router.get("/{other_user_id}", response_model=List[ChatResponse])
def get_chat_history(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch all chats between these two users
    chats = db.query(Chat).filter(
        ((Chat.sender_id == current_user.id) & (Chat.receiver_id == other_user_id)) |
        ((Chat.sender_id == other_user_id) & (Chat.receiver_id == current_user.id))
    ).order_by(Chat.timestamp.asc()).all()
    return chats

@router.post("", response_model=ChatResponse)
def send_chat_message(
    chat_in: ChatCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure they are connected first (optional safety check, can skip for free chatting)
    # Check if target exists
    target = db.query(User).filter(User.id == chat_in.receiver_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Recipient user not found")
        
    new_chat = Chat(
        sender_id=current_user.id,
        receiver_id=chat_in.receiver_id,
        message=chat_in.message
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat
