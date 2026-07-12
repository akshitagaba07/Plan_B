import datetime
import json
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    moods = relationship("Mood", back_populates="user", cascade="all, delete-orphan")
    hosted_events = relationship("Event", back_populates="host", cascade="all, delete-orphan")
    sent_chats = relationship("Chat", foreign_keys="Chat.sender_id", back_populates="sender", cascade="all, delete-orphan")
    received_chats = relationship("Chat", foreign_keys="Chat.receiver_id", back_populates="receiver", cascade="all, delete-orphan")
    created_communities = relationship("Community", back_populates="creator", cascade="all, delete-orphan")
    posts = relationship("CommunityPost", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("CommunityComment", back_populates="author", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    city = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    occupation = Column(String, nullable=True)
    university = Column(String, nullable=True)
    active_goal = Column(String, nullable=True, default="")
    
    # Store list data as JSON strings in SQLite
    interests_json = Column(Text, default="[]")
    hobbies_json = Column(Text, default="[]")
    favorite_activities_json = Column(Text, default="[]")
    languages_json = Column(Text, default="[]")
    
    profile_pic = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Relationships
    user = relationship("User", back_populates="profile")

    @property
    def interests(self):
        try:
            return json.loads(self.interests_json)
        except Exception:
            return []

    @interests.setter
    def interests(self, value):
        self.interests_json = json.dumps(value)

    @property
    def hobbies(self):
        try:
            return json.loads(self.hobbies_json)
        except Exception:
            return []

    @hobbies.setter
    def hobbies(self, value):
        self.hobbies_json = json.dumps(value)

    @property
    def favorite_activities(self):
        try:
            return json.loads(self.favorite_activities_json)
        except Exception:
            return []

    @favorite_activities.setter
    def favorite_activities(self, value):
        self.favorite_activities_json = json.dumps(value)

    @property
    def languages(self):
        try:
            return json.loads(self.languages_json)
        except Exception:
            return []

    @languages.setter
    def languages(self, value):
        self.languages_json = json.dumps(value)

class Mood(Base):
    __tablename__ = "moods"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    mood = Column(String, nullable=False) # e.g. "Happy", "Lonely", etc.
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="moods")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    date = Column(String, nullable=False) # Store as YYYY-MM-DD string
    time = Column(String, nullable=False) # Store as HH:MM string
    location = Column(String, nullable=False)
    host_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(String, nullable=False) # Gaming, Movies, Football, Cafe, Study, Anime, Other
    max_participants = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    host = relationship("User", back_populates="hosted_events")
    participants = relationship("EventParticipant", back_populates="event", cascade="all, delete-orphan")

class EventParticipant(Base):
    __tablename__ = "event_participants"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="participants")

class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    cover_image = Column(String, nullable=True)
    category = Column(String, nullable=False) # e.g. Gamers Club, Movie Lovers
    creator_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    creator = relationship("User", back_populates="created_communities")
    posts = relationship("CommunityPost", back_populates="community", cascade="all, delete-orphan")
    members = relationship("CommunityMember", back_populates="community", cascade="all, delete-orphan")

class CommunityMember(Base):
    __tablename__ = "community_members"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    relationship("Community", back_populates="members")
    community = relationship("Community", back_populates="members")

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    likes_json = Column(Text, default="[]") # Store list of user IDs who liked it
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    community = relationship("Community", back_populates="posts")
    author = relationship("User", back_populates="posts")
    comments = relationship("CommunityComment", back_populates="post", cascade="all, delete-orphan")

    @property
    def likes(self):
        try:
            return json.loads(self.likes_json)
        except Exception:
            return []

    @likes.setter
    def likes(self, value):
        self.likes_json = json.dumps(value)

class CommunityComment(Base):
    __tablename__ = "community_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    post = relationship("CommunityPost", back_populates="comments")
    author = relationship("User", back_populates="comments")

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_chats")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_chats")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    user_a_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user_b_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, default=0.0) # Match score percentage (0-100)
    mutual_interests_json = Column(Text, default="[]")
    distance = Column(Float, default=0.0) # Distance in km
    status = Column(String, default="matched") # matched, connected, blocked, reported

    @property
    def mutual_interests(self):
        try:
            return json.loads(self.mutual_interests_json)
        except Exception:
            return []

    @mutual_interests.setter
    def mutual_interests(self, value):
        self.mutual_interests_json = json.dumps(value)
