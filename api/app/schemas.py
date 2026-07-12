from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

# --- User Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# --- Profile Schemas ---
class ProfileBase(BaseModel):
    name: str
    age: int
    gender: str
    city: str
    bio: Optional[str] = None
    occupation: Optional[str] = None
    university: Optional[str] = None
    interests: List[str] = []
    hobbies: List[str] = []
    favorite_activities: List[str] = []
    languages: List[str] = []
    profile_pic: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    active_goal: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    occupation: Optional[str] = None
    university: Optional[str] = None
    interests: Optional[List[str]] = None
    hobbies: Optional[List[str]] = None
    favorite_activities: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    profile_pic: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    active_goal: Optional[str] = None

class ProfileResponse(ProfileBase):
    user_id: int

    class Config:
        from_attributes = True

# --- Mood Schemas ---
class MoodCreate(BaseModel):
    mood: str
    note: Optional[str] = None

class MoodResponse(BaseModel):
    id: int
    user_id: int
    mood: str
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Event Schemas ---
class EventParticipantResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    joined_at: datetime
    profile: Optional[ProfileResponse] = None

    class Config:
        from_attributes = True

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    time: str
    location: str
    category: str
    max_participants: int = 10

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    date: str
    time: str
    location: str
    category: str
    max_participants: int
    host_id: int
    host_profile: Optional[ProfileResponse] = None
    participants: List[EventParticipantResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# --- Community Schemas ---
class CommunityCreate(BaseModel):
    name: str
    description: str
    cover_image: Optional[str] = None
    category: str

class CommunityResponse(BaseModel):
    id: int
    name: str
    description: str
    cover_image: Optional[str] = None
    category: str
    creator_id: int
    created_at: datetime
    member_count: int = 0
    is_joined: bool = False

    class Config:
        from_attributes = True

class CommunityCommentCreate(BaseModel):
    content: str

class CommunityCommentResponse(BaseModel):
    id: int
    post_id: int
    author_id: int
    author_name: Optional[str] = None
    author_pic: Optional[str] = None
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityPostCreate(BaseModel):
    title: str
    content: str

class CommunityPostResponse(BaseModel):
    id: int
    community_id: int
    author_id: int
    author_name: Optional[str] = None
    author_pic: Optional[str] = None
    title: str
    content: str
    likes_count: int = 0
    is_liked: bool = False
    comments: List[CommunityCommentResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

# --- Chat Schemas ---
class ChatCreate(BaseModel):
    receiver_id: int
    message: str

class ChatResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Match Schemas ---
class MatchResponse(BaseModel):
    id: int
    profile: ProfileResponse
    score: float
    mutual_interests: List[str]
    distance: float
    status: str

    class Config:
        from_attributes = True

class MatchAction(BaseModel):
    action: str  # connect, block, report

# --- AI Assistant Schemas ---
class AssistantRequest(BaseModel):
    message: str

class AssistantResponse(BaseModel):
    reply: str
    suggested_people: List[ProfileResponse] = []
    suggested_events: List[EventResponse] = []
    suggested_communities: List[CommunityResponse] = []
    suggested_activities: List[str] = []
