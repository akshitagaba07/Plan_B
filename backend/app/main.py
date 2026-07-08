import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base, SessionLocal
from .models import User, Profile, Event, Community, CommunityPost, CommunityComment, Match, EventParticipant, CommunityMember
from .auth import get_password_hash
from .routers import auth, profile, moods, matching, events, community, chat, assistant
import datetime

# Create SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plan B API",
    description="Backend API services for the Plan B Social Discovery and Wellness Platform",
    version="1.0.0"
)

# Enable CORS for frontend connectivity
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

# Mount static folder for profile picture storage
os.makedirs("static/profile_pics", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include Routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(moods.router)
app.include_router(matching.router)
app.include_router(events.router)
app.include_router(community.router)
app.include_router(chat.router)
app.include_router(assistant.router)

@app.get("/")
def read_root():
    return {"name": "Plan B API", "status": "online", "version": "1.0.0"}

# --- DATABASE SEEDING LOGIC ---
def seed_database():
    db = SessionLocal()
    try:
        # Check if database has already been seeded
        user_count = db.query(User).count()
        if user_count > 0:
            print("Database already contains data. Skipping seeding.")
            return

        print("Seeding initial data...")
        
        # 1. Create Mock Users and Profiles
        seed_users = [
            {"email": "emily@planb.com", "name": "Emily", "age": 23, "gender": "Female", "city": "San Francisco", "bio": "Software engineer at a startup. Always code-cafe hopping or studying in library basements. Looking for a study buddy!", "occupation": "Software Engineer", "university": "UC Berkeley", "interests": ["Coding", "Coffee", "Books"], "hobbies": ["Baking", "Chess"], "acts": ["Cafe study", "Coding sprint"], "languages": ["English", "Mandarin"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Emily", "lat": 37.7858, "lon": -122.4012, "active_goal": "Cafe study"},
            {"email": "marcus@planb.com", "name": "Marcus", "age": 24, "gender": "Male", "city": "San Francisco", "bio": "Calisthenics addict and personal trainer. Let's hit the gym, run along the Embarcadero, or go trekking!", "occupation": "Fitness Trainer", "university": "USF", "interests": ["Gym", "Football", "Travel"], "hobbies": ["Hiking", "Powerlifting"], "acts": ["Workout", "Running session"], "languages": ["English", "Spanish"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus", "lat": 37.7651, "lon": -122.4211, "active_goal": "Workout"},
            {"email": "chen@planb.com", "name": "Chen", "age": 22, "gender": "Male", "city": "San Francisco", "bio": "Avid football fan and recreational midfield player. Looking to play a quick casual turf match this week!", "occupation": "Student", "university": "Stanford", "interests": ["Football", "Cricket", "Gaming"], "hobbies": ["Fifa", "Running"], "acts": ["Turf Football", "Fifa Match"], "languages": ["English", "Hindi"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Chen", "lat": 37.7599, "lon": -122.4368, "active_goal": "Play Football"},
            {"email": "chloe@planb.com", "name": "Chloe", "age": 23, "gender": "Female", "city": "San Francisco", "bio": "Graphic designer and modern art fan. Looking for a gallery companion to check out the SFMOMA exhibits this weekend!", "occupation": "Designer", "university": "SFSU", "interests": ["Art", "Coffee", "Photography"], "hobbies": ["Painting", "Museums"], "acts": ["Museum stroll", "Photo walk"], "languages": ["English", "French"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe", "lat": 37.7812, "lon": -122.4187, "active_goal": "Museum stroll"},
            {"email": "sofia@planb.com", "name": "Sofia", "age": 25, "gender": "Female", "city": "San Francisco", "bio": "Freelance writer and book reviewer. Let's grab iced matchas and read at Dolores Park or search for vintage books.", "occupation": "Writer", "university": "UCSF", "interests": ["Books", "Coffee", "Anime"], "hobbies": ["Novels", "Sketching"], "acts": ["Park reading", "Bookstore crawl"], "languages": ["English", "Italian"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia", "lat": 37.7739, "lon": -122.4312, "active_goal": "Park reading"},
            {"email": "jamal@planb.com", "name": "Jamal", "age": 24, "gender": "Male", "city": "San Francisco", "bio": "PC builder and competitive gamer. Looking for local players to team up for Valorant custom lobbies or Fifa nights.", "occupation": "Data Analyst", "university": "UC Berkeley", "interests": ["Gaming", "Coding", "Music"], "hobbies": ["Esports", "Keyboard building"], "acts": ["Fifa night", "Valorant lobby"], "languages": ["English", "Arabic"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Jamal", "lat": 37.7791, "lon": -122.4412, "active_goal": "Fifa night"},
            {"email": "david@planb.com", "name": "David", "age": 26, "gender": "Male", "city": "San Francisco", "bio": "Street photography enthusiast. Always roaming downtown SF with a film camera. Looking for photo walk partners!", "occupation": "Photographer", "university": "Stanford", "interests": ["Photography", "Travel", "Art"], "hobbies": ["Film scan", "Cycling"], "acts": ["Photo walk", "Cycle tour"], "languages": ["English", "German"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=David", "lat": 37.7689, "lon": -122.4091, "active_goal": "Photo walk"},
            {"email": "jessica@planb.com", "name": "Jessica", "age": 22, "gender": "Female", "city": "San Francisco", "bio": "Culinary student and foodie. Exploring SF's best bakeries and hidden noodle spots. Join me for food crawls!", "occupation": "Culinary Student", "university": "SFSU", "interests": ["Food", "Coffee", "Music"], "hobbies": ["Cooking", "Guitar"], "acts": ["Food crawl", "Cafe hopping"], "languages": ["English", "Korean"], "pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica", "lat": 37.7891, "lon": -122.4121, "active_goal": "Food crawl"}
        ]

        created_users = []
        for u in seed_users:
            new_user = User(email=u["email"], hashed_password=get_password_hash("password123"))
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            new_profile = Profile(
                user_id=new_user.id,
                name=u["name"],
                age=u["age"],
                gender=u["gender"],
                city=u["city"],
                bio=u["bio"],
                occupation=u["occupation"],
                university=u["university"],
                profile_pic=u["pic"],
                latitude=u["lat"],
                longitude=u["lon"],
                active_goal=u["active_goal"]
            )
            new_profile.interests = u["interests"]
            new_profile.hobbies = u["hobbies"]
            new_profile.favorite_activities = u["acts"]
            new_profile.languages = u["languages"]
            
            db.add(new_profile)
            db.commit()
            created_users.append(new_user)

        # 2. Create Communities
        seed_comms = [
            {"name": "Gamers Club", "desc": "For all gaming enthusiasts. Discussions on esports, consoles, PC builds, and scheduling multiplayer lobbies.", "cat": "Gaming"},
            {"name": "Movie Lovers", "desc": "Cinemaphiles unite! Share reviews, argue about directors, and coordinate movie nights.", "cat": "Movies"},
            {"name": "Anime Fans", "desc": "A dedicated space to share your favorite series, manga releases, and schedule cosplay meetups.", "cat": "Anime"},
            {"name": "Football Players", "desc": "Join local recreational matches, discuss matches, and find team members in the city.", "cat": "Football"},
            {"name": "Fitness Group", "desc": "Share workouts, nutrition advice, gym goals, and motivate each other towards a healthy lifestyle.", "cat": "Fitness"},
            {"name": "Book Club", "desc": "Reading lists, monthly discussions, and literature recommendations for all bookworms.", "cat": "Books"}
        ]

        created_comms = []
        for c in seed_comms:
            new_c = Community(
                name=c["name"],
                description=c["desc"],
                cover_image=f"https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=60",
                category=c["cat"],
                creator_id=created_users[0].id # Rohan is creator
            )
            db.add(new_c)
            db.commit()
            db.refresh(new_c)
            created_comms.append(new_c)
            
            # Creator is member
            mem = CommunityMember(community_id=new_c.id, user_id=created_users[0].id)
            db.add(mem)
            db.commit()

        # 3. Create Seed Posts & Comments in Gamers Club
        new_post = CommunityPost(
            community_id=created_comms[0].id,
            author_id=created_users[0].id, # Rohan
            title="Who is up for a Valorant custom match tonight?",
            content="Looking for 8 more players to fill a lobby at 8 PM. Drop your Discord usernames here and let's play!",
            likes_json=f"[{created_users[1].id}, {created_users[2].id}]"
        )
        db.add(new_post)
        db.commit()
        db.refresh(new_post)

        comment1 = CommunityComment(
            post_id=new_post.id,
            author_id=created_users[4].id, # Sofia
            content="I'm totally in! Add me, I usually play Sage."
        )
        comment2 = CommunityComment(
            post_id=new_post.id,
            author_id=created_users[1].id, # Marcus
            content="I can join too, though I'm a bit rusty. Warned you!"
        )
        db.add(comment1)
        db.add(comment2)
        db.commit()

        # 4. Create Events
        seed_events = [
            {"title": "Co-Working & Coding Session", "desc": "Grab a coffee and work on side projects or study together. Wifi and power outlets available!", "date": (datetime.date.today() + datetime.timedelta(days=2)).strftime("%Y-%m-%d"), "time": "14:00", "loc": "Hatch Cafe, San Francisco", "cat": "Study", "host": created_users[0].id},
            {"title": "Outdoor Football Scrimmage", "desc": "Casual 5v5 game on the turf. All skill levels welcome, just bring your soccer cleats!", "date": (datetime.date.today() + datetime.timedelta(days=4)).strftime("%Y-%m-%d"), "time": "16:00", "loc": "Golden Gate Park Turf, SF", "cat": "Football", "host": created_users[2].id},
            {"title": "Coffee & SFMOMA Art Gallery Stroll", "desc": "Starting at Blue Bottle Coffee for lattes, then visiting the nearby SFMOMA gallery exhibits.", "date": (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d"), "time": "10:30", "loc": "Blue Bottle Cafe, Downtown SF", "cat": "Cafe", "host": created_users[3].id}
        ]

        for e in seed_events:
            new_event = Event(
                title=e["title"],
                description=e["desc"],
                date=e["date"],
                time=e["time"],
                location=e["loc"],
                category=e["cat"],
                host_id=e["host"],
                max_participants=8
            )
            db.add(new_event)
            db.commit()
            db.refresh(new_event)
            
            # Host joins
            part = EventParticipant(event_id=new_event.id, user_id=e["host"])
            db.add(part)
            db.commit()

        print("Seeding completed successfully.")
    except Exception as err:
        db.rollback()
        print(f"Error during seeding: {err}")
    finally:
        db.close()

# Run the seeding
seed_database()
