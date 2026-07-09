import os
import json
import math
from typing import List, Tuple, Dict
from openai import OpenAI
from sqlalchemy.orm import Session
from .models import User, Profile, Event, Community, Mood

# Setup OpenAI client if API key is provided
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = None
if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)

# Helper: Calculate distance using Haversine formula
def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return 5.0 # Default fallback distance in km
        
    R = 6371.0 # Radius of Earth in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return round(distance, 1)

# AI-Powered Match Logic
def calculate_compatibility(p1: Profile, p2: Profile, mood1: str = None, mood2: str = None) -> Tuple[float, List[str], float]:
    """
    Computes match score (0-100) between two profiles.
    Returns: (score, mutual_interests, distance_in_km)
    """
    score = 0.0
    
    # 1. Mutual Interests (35 points max)
    interests1 = set(p1.interests)
    interests2 = set(p2.interests)
    mutual_interests = list(interests1.intersection(interests2))
    
    if interests1 or interests2:
        union_interests = interests1.union(interests2)
        interest_ratio = len(mutual_interests) / len(union_interests) if union_interests else 0
        score += interest_ratio * 35.0
        
    # 2. Hobbies & Activities (25 points max)
    hobbies1 = set(p1.hobbies)
    hobbies2 = set(p2.hobbies)
    mutual_hobbies = hobbies1.intersection(hobbies2)
    
    acts1 = set(p1.favorite_activities)
    acts2 = set(p2.favorite_activities)
    mutual_acts = acts1.intersection(acts2)
    
    union_hobbies = hobbies1.union(hobbies2)
    hobbies_ratio = len(mutual_hobbies) / len(union_hobbies) if union_hobbies else 0
    
    union_acts = acts1.union(acts2)
    acts_ratio = len(mutual_acts) / len(union_acts) if union_acts else 0
    
    score += (hobbies_ratio * 15.0) + (acts_ratio * 10.0)

    # 3. Distance (20 points max)
    distance = calculate_haversine_distance(p1.latitude, p1.longitude, p2.latitude, p2.longitude)
    if distance <= 2.0:
        score += 20.0
    elif distance <= 10.0:
        score += 15.0
    elif distance <= 30.0:
        score += 10.0
    else:
        score += 5.0

    # 4. Mood Compatibility (20 points max)
    if mood1 and mood2:
        if mood1 == mood2:
            score += 20.0 # Shared emotional state
        elif (mood1 in ["Lonely", "Stressed"] and mood2 in ["Happy", "Excited"]):
            score += 15.0 # Support matching (uplifting vibe)
        elif mood1 in ["Happy", "Excited"] and mood2 in ["Happy", "Excited"]:
            score += 20.0 # High energy matching
        else:
            score += 10.0 # Neutral matching
    else:
        score += 12.0 # Neutral placeholder if mood not logged today

    # Keep within limits and round
    final_score = min(max(round(score, 0), 10.0), 99.0)
    return final_score, mutual_interests, distance

# Icebreaker Generator
def generate_icebreakers(p1: Profile, p2: Profile) -> List[str]:
    """
    Generates 3 conversation icebreakers based on mutual interests and bios.
    """
    interests = list(set(p1.interests).intersection(set(p2.interests)))
    hobbies = list(set(p1.hobbies).intersection(set(p2.hobbies)))
    
    # Try OpenAI first
    if client:
        try:
            prompt = (
                f"You are a social icebreaker coach. Create 3 short, engaging, and friendly conversation starter options "
                f"for User A (Name: {p1.name}, Bio: {p1.bio}, Interests: {', '.join(p1.interests)}, Hobbies: {', '.join(p1.hobbies)}) "
                f"to message User B (Name: {p2.name}, Bio: {p2.bio}, Interests: {', '.join(p2.interests)}, Hobbies: {', '.join(p2.hobbies)}). "
                f"Focus on their shared points or ask friendly open-ended questions based on their profile details. "
                f"Return only a JSON array of 3 strings. Example format: ['icebreaker 1', 'icebreaker 2', 'icebreaker 3']."
            )
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            data = json.loads(content)
            if isinstance(data, dict) and "icebreakers" in data:
                return data["icebreakers"]
            elif isinstance(data, list):
                return data[:3]
            elif isinstance(data, dict) and len(data.values()) > 0:
                # Return the list inside the dict key
                first_val = list(data.values())[0]
                if isinstance(first_val, list):
                    return first_val[:3]
        except Exception as e:
            # Fallback on failure
            pass

    # Heuristic Fallback Icebreakers
    icebreakers = []
    if interests:
        fav_interest = interests[0]
        icebreakers.append(f"Hey {p2.name}! I noticed we're both into {fav_interest}. What's your favorite thing about it?")
    else:
        icebreakers.append(f"Hi {p2.name}! I read your bio and thought it was super interesting. How are you doing today?")
        
    if hobbies:
        fav_hobby = hobbies[0]
        icebreakers.append(f"Hello! I saw that you like {fav_hobby}. I've been doing that too! How long have you been into it?")
    else:
        if p2.occupation:
            icebreakers.append(f"Hey! What's it like working as a {p2.occupation}? I'd love to hear more about your day-to-day!")
        else:
            icebreakers.append(f"Hey! If you had to pick one favorite spot in {p2.city}, where would it be?")

    if p2.favorite_activities:
        act = p2.favorite_activities[0]
        icebreakers.append(f"I see you enjoy {act}! We should totally plan to do that sometime. Are you free this week?")
    else:
        icebreakers.append(f"Marvel or DC? Let's settle this debate, {p2.name}!")
        
    return icebreakers[:3]

# AI Assistant
def run_assistant_query(user_msg: str, user_profile: Profile, current_mood: str, db: Session) -> Dict:
    """
    Main Assistant engine. Interprets message, finds contextual resources, and writes an LLM response or heuristic response.
    """
    user_msg_lower = user_msg.lower()
    
    # 1. Search DB for contextual recommendation entities
    
    # Scan for interest/activity tags
    matching_interest = None
    all_interests = ["gaming", "movies", "football", "cricket", "badminton", "gym", "music", "anime", "travel", "books", "coffee", "coding", "photography", "food", "art"]
    for interest in all_interests:
        if interest in user_msg_lower:
            matching_interest = interest
            break
            
    # Find matching events
    events_query = db.query(Event)
    if matching_interest:
        events_query = events_query.filter(
            (Event.title.contains(matching_interest)) | 
            (Event.description.contains(matching_interest)) |
            (Event.category.contains(matching_interest.capitalize()))
        )
    events = events_query.limit(3).all()
    
    # Find matching communities
    comm_query = db.query(Community)
    if matching_interest:
        comm_query = comm_query.filter(
            (Community.name.contains(matching_interest.capitalize())) | 
            (Community.description.contains(matching_interest))
        )
    communities = comm_query.limit(3).all()
    
    # Find matching users (nearby & sharing interests)
    people_profiles = db.query(Profile).filter(Profile.user_id != user_profile.user_id).all()
    suggested_people_list = []
    for p in people_profiles:
        score, mutual, dist = calculate_compatibility(user_profile, p, current_mood, None)
        if matching_interest and matching_interest.capitalize() in p.interests:
            score += 20
        suggested_people_list.append((p, score))
        
    # Sort people by match score descending
    suggested_people_list.sort(key=lambda x: x[1], reverse=True)
    top_people = [item[0] for item in suggested_people_list[:3]]
    
    # Suggested activities
    activities = [
        "Take a 15-minute mindful walk around your neighborhood",
        "Grab a hot cup of coffee/tea at a local café",
        "Put on your favorite upbeat song and do a 5-minute stretch",
        "Write down three things you are grateful for today",
        "Message a friend or connect with a new match on Plan B"
    ]
    
    # Vibe check for prompt matching
    vibe = "neutral"
    if any(word in user_msg_lower for word in ["lonely", "alone", "sad", "depressed", "isolate"]):
        vibe = "lonely"
    elif any(word in user_msg_lower for word in ["bored", "boredom", "nothing to do"]):
        vibe = "bored"
    elif any(word in user_msg_lower for word in ["stressed", "anxious", "panic", "worry"]):
        vibe = "stressed"
    elif any(word in user_msg_lower for word in ["tired", "sleepy", "exhausted", "lazy"]):
        vibe = "tired"
    elif any(word in user_msg_lower for word in ["football", "play", "cricket", "badminton", "sport", "game"]):
        vibe = "sports"

    # AI Text Generation
    reply = ""
    if client:
        try:
            # Construct a comprehensive prompt for OpenAI
            context = {
                "user_name": user_profile.name,
                "current_mood": current_mood,
                "user_message": user_msg,
                "suggested_people": [p.name for p in top_people],
                "suggested_events": [e.title for e in events],
                "suggested_communities": [c.name for c in communities]
            }
            
            prompt = (
                f"You are the AI Social Wellness Assistant on the platform 'Plan B'. "
                f"The user ({context['user_name']}) is feeling '{context['current_mood']}' and wrote: '{context['user_message']}'.\n\n"
                f"We scanned our database and found some recommendations:\n"
                f"- People: {', '.join(context['suggested_people']) if context['suggested_people'] else 'None matching directly'}\n"
                f"- Events: {', '.join(context['suggested_events']) if context['suggested_events'] else 'None scheduled yet'}\n"
                f"- Communities: {', '.join(context['suggested_communities']) if context['suggested_communities'] else 'None'}\n\n"
                f"Respond with a warm, highly empathetic, supportive message (2-4 sentences). "
                f"Acknowledge their state, give them practical self-care suggestions, and direct them to connect with the suggested people, events, or groups. "
                f"Keep it positive and encouraging. Don't write placeholders."
            )
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            reply = response.choices[0].message.content
        except Exception:
            pass

    if not reply:
        # Heuristic Text Generation based on vibe
        if vibe == "lonely":
            reply = (
                f"I'm sorry you're feeling lonely, {user_profile.name}. Loneliness can be tough, but remember it is temporary. "
                f"I found {len(top_people)} people nearby (like {', '.join([p.name for p in top_people])}) who share your interests and would love to chat. "
                f"There's also some great events coming up that you can browse to step out and meet others."
            )
        elif vibe == "bored":
            reply = (
                f"Feeling bored is just an invitation for a new adventure, {user_profile.name}! "
                f"How about checking out the communities or joining an event today? I see {len(events)} events scheduled that you might enjoy. "
                f"You could also check out activities like taking a walk or trying a new coffee spot."
            )
        elif vibe == "stressed":
            reply = (
                f"Take a deep breath, {user_profile.name}. It's okay to feel overwhelmed. Stress is your body's way of asking for a pause. "
                f"I highly recommend trying a mindfulness activity, listening to relaxing music, or checking in with a close group in our wellness portal. "
                f"Connecting with someone who has a calm energy might also help."
            )
        elif vibe == "tired":
            reply = (
                f"It sounds like you need to recharge, {user_profile.name}. Don't push yourself too hard today. "
                f"Maybe wind down with a good book, take a warm shower, or browse some calm discussions in the Book Club community. "
                f"Rest is productive!"
            )
        elif vibe == "sports" and matching_interest:
            reply = (
                f"Awesome! It looks like you're looking for some {matching_interest} action! "
                f"I found {len(top_people)} people nearby who love {matching_interest}. "
                f"We also have matching active events or groups. Let's get a game going!"
            )
        else:
            reply = (
                f"Hello {user_profile.name}! I'm here to help you connect and look after your wellness. "
                f"Based on your profile, I've curated a list of matches who share your interests, "
                f"and some events and groups you can check out. Let me know if you want to explore something specific!"
            )

    return {
        "reply": reply,
        "suggested_people": top_people,
        "suggested_events": events,
        "suggested_communities": communities,
        "suggested_activities": activities
    }
