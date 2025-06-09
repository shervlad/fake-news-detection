import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from datetime import datetime, timedelta
import random
from flask import Flask
from dotenv import load_dotenv

from src.models import db, User, FlaggedContent, Flag, Verification, ApiKey, Statistics

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USERNAME', 'root')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'mydb')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def seed_users():
    """Seed users table with initial data."""
    print("Seeding users...")
    
    # Create admin user
    admin = User(
        username="admin",
        email="admin@example.com",
        role="admin",
        reputation_score=100,
        created_at=datetime.utcnow() - timedelta(days=30),
        last_login=datetime.utcnow()
    )
    admin.set_password("admin123")
    
    # Create moderator user
    moderator = User(
        username="moderator",
        email="moderator@example.com",
        role="moderator",
        reputation_score=50,
        created_at=datetime.utcnow() - timedelta(days=20),
        last_login=datetime.utcnow() - timedelta(days=1)
    )
    moderator.set_password("moderator123")
    
    # Create regular users
    users = [
        User(
            username=f"user{i}",
            email=f"user{i}@example.com",
            role="user",
            reputation_score=random.randint(0, 30),
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            last_login=datetime.utcnow() - timedelta(days=random.randint(0, 10))
        ) for i in range(1, 11)
    ]
    
    # Set passwords for regular users
    for user in users:
        user.set_password("password123")
    
    # Add all users to database
    db.session.add(admin)
    db.session.add(moderator)
    db.session.add_all(users)
    db.session.commit()
    
    print(f"Created {len(users) + 2} users")
    return [admin, moderator] + users

def seed_flagged_content(users):
    """Seed flagged_content table with initial data."""
    print("Seeding flagged content...")
    
    # Sample content types and platforms
    content_types = ["article", "social_post", "video", "image", "advertisement"]
    platforms = ["Facebook", "Twitter/X", "Instagram", "TikTok", "YouTube", "Reddit", "News Website", "Blog"]
    verification_statuses = ["pending", "verified_fake", "verified_misleading", "verified_true"]
    
    # Sample URLs and titles
    sample_content = [
        {
            "url": "https://example-fake-news.com/miracle-cure",
            "title": "Scientists Discover Cure for All Diseases in Common Household Item",
            "description": "A breakthrough study claims that a common household item can cure all diseases. This is clearly false information."
        },
        {
            "url": "https://conspiracy-theories.com/streetlight-mind-control",
            "title": "Government Secretly Installing Mind Control Devices in Streetlights",
            "description": "A conspiracy theory claiming that streetlights contain mind control devices."
        },
        {
            "url": "https://celebrity-gossip.com/alien-revelation",
            "title": "Celebrity Announces They Are Actually an Alien From Another Planet",
            "description": "A false claim about a celebrity being an alien."
        },
        {
            "url": "https://health-news.com/chocolate-covid",
            "title": "New Study Shows Chocolate Prevents COVID-19",
            "description": "Misleading health information claiming chocolate can prevent COVID-19."
        },
        {
            "url": "https://climate-news.com/city-underwater",
            "title": "Major City Underwater After Climate Disaster",
            "description": "Misleading image showing a city underwater, which is actually from a movie set."
        },
        {
            "url": "https://political-news.com/controversial-statement",
            "title": "Political Leader Makes Controversial Statement About Opponent",
            "description": "A quote taken out of context to make it seem more controversial."
        },
        {
            "url": "https://tech-news.com/ai-takeover",
            "title": "AI System Gains Consciousness and Takes Over Power Grid",
            "description": "Science fiction presented as news about AI taking over infrastructure."
        },
        {
            "url": "https://medical-journal.fake/vaccine-danger",
            "title": "New Research Shows Vaccines Cause Superhuman Abilities",
            "description": "False medical information about vaccines giving people superpowers."
        },
        {
            "url": "https://economic-news.com/market-crash",
            "title": "Stock Market to Crash Tomorrow, Experts Say",
            "description": "Fear-mongering financial news without credible sources."
        },
        {
            "url": "https://science-daily.fake/moon-landing",
            "title": "NASA Admits Moon Landing Was Filmed in Hollywood",
            "description": "Classic conspiracy theory about the moon landing being faked."
        },
        {
            "url": "https://wildlife-news.com/dragon-discovery",
            "title": "Dragons Discovered Living in Remote Mountain Range",
            "description": "Fictional story about dragons being discovered, presented as news."
        },
        {
            "url": "https://education-news.com/genius-pill",
            "title": "New Pill Makes Students Ace All Tests Without Studying",
            "description": "False claims about a pill that enhances intelligence dramatically."
        },
        {
            "url": "https://sports-news.com/athlete-superhuman",
            "title": "Athlete Breaks World Record by Factor of Ten After Secret Training",
            "description": "Exaggerated sports achievement that defies physical possibilities."
        },
        {
            "url": "https://food-science.com/water-memory",
            "title": "Scientists Prove Water Has Memory and Emotions",
            "description": "Pseudoscientific claim about water having memory and emotions."
        },
        {
            "url": "https://archaeology-today.fake/ancient-tech",
            "title": "Archaeologists Find Modern Smartphone in Ancient Ruins",
            "description": "False archaeological claim about finding modern technology in ancient sites."
        }
    ]
    
    # Create flagged content
    flagged_content_list = []
    for content in sample_content:
        content_type = random.choice(content_types)
        platform = random.choice(platforms)
        verification_status = random.choice(verification_statuses)
        flag_count = random.randint(1, 200)
        
        flagged_content = FlaggedContent(
            url=content["url"],
            title=content["title"],
            content_type=content_type,
            platform=platform,
            description=content["description"],
            verification_status=verification_status,
            flag_count=flag_count,
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            updated_at=datetime.utcnow() - timedelta(days=random.randint(0, 10))
        )
        
        flagged_content_list.append(flagged_content)
    
    # Add all flagged content to database
    db.session.add_all(flagged_content_list)
    db.session.commit()
    
    print(f"Created {len(flagged_content_list)} flagged content items")
    return flagged_content_list

def seed_flags(users, flagged_content_list):
    """Seed flags table with initial data."""
    print("Seeding flags...")
    
    # Sample reasons
    reasons = ["fake_news", "misleading", "outdated", "satire_as_news", "manipulated_media", "false_context"]
    
    # Create flags
    flags = []
    for content in flagged_content_list:
        # Create between 1 and 10 flags for each content
        num_flags = min(content.flag_count, 10)
        
        for _ in range(num_flags):
            user = random.choice(users) if random.random() > 0.3 else None  # 30% anonymous flags
            reason = random.choice(reasons)
            details = f"This content appears to be {reason.replace('_', ' ')}."
            
            flag = Flag(
                reason=reason,
                details=details,
                flagged_content_id=content.id,
                user_id=user.id if user else None,
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            
            flags.append(flag)
    
    # Add all flags to database
    db.session.add_all(flags)
    db.session.commit()
    
    print(f"Created {len(flags)} flags")
    return flags

def seed_verifications(users, flagged_content_list):
    """Seed verifications table with initial data."""
    print("Seeding verifications...")
    
    # Get moderator and admin users
    moderators = [user for user in users if user.role in ["moderator", "admin"]]
    
    # Create verifications
    verifications = []
    for content in flagged_content_list:
        # Only create verifications for content that's not pending
        if content.verification_status != "pending":
            moderator = random.choice(moderators)
            
            evidence_links = [
                "https://www.factcheck.org/example-fact-check",
                "https://www.snopes.com/example-verification",
                "https://www.politifact.com/example-rating"
            ]
            
            verification = Verification(
                status=content.verification_status,
                notes=f"This content has been verified as {content.verification_status.replace('_', ' ')}.",
                evidence_links=",".join(evidence_links),
                flagged_content_id=content.id,
                moderator_id=moderator.id,
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 20)),
                updated_at=datetime.utcnow() - timedelta(days=random.randint(0, 10))
            )
            
            verifications.append(verification)
    
    # Add all verifications to database
    db.session.add_all(verifications)
    db.session.commit()
    
    print(f"Created {len(verifications)} verifications")
    return verifications

def seed_api_keys(users):
    """Seed api_keys table with initial data."""
    print("Seeding API keys...")
    
    # Create API keys for some users
    api_keys = []
    for user in users[:5]:  # Create API keys for the first 5 users
        api_key = ApiKey(
            name=f"{user.username}'s API Key",
            user_id=user.id,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            last_used_at=datetime.utcnow() - timedelta(days=random.randint(0, 10)) if random.random() > 0.3 else None
        )
        
        api_keys.append(api_key)
    
    # Add all API keys to database
    db.session.add_all(api_keys)
    db.session.commit()
    
    print(f"Created {len(api_keys)} API keys")
    return api_keys

def seed_statistics():
    """Seed statistics table with initial data."""
    print("Seeding statistics...")
    
    # Create statistics for the past 30 days
    statistics = []
    for i in range(30, 0, -1):
        date = datetime.utcnow().date() - timedelta(days=i)
        
        # Generate random statistics with an increasing trend
        total_flags = int(100 + i * 10 + random.randint(-20, 20))
        total_users = int(50 + i * 5 + random.randint(-10, 10))
        total_verified_fake = int(30 + i * 3 + random.randint(-5, 5))
        total_verified_misleading = int(20 + i * 2 + random.randint(-5, 5))
        total_verified_true = int(10 + i * 1 + random.randint(-3, 3))
        total_pending = total_flags - total_verified_fake - total_verified_misleading - total_verified_true
        
        stat = Statistics(
            date=date,
            total_flags=max(0, total_flags),
            total_users=max(0, total_users),
            total_verified_fake=max(0, total_verified_fake),
            total_verified_misleading=max(0, total_verified_misleading),
            total_verified_true=max(0, total_verified_true),
            total_pending=max(0, total_pending)
        )
        
        statistics.append(stat)
    
    # Add all statistics to database
    db.session.add_all(statistics)
    db.session.commit()
    
    print(f"Created {len(statistics)} statistics entries")
    return statistics

def main():
    """Main function to seed the database."""
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if database is already seeded
        if User.query.count() > 0:
            print("Database already seeded. Skipping...")
            return
        
        # Seed database
        users = seed_users()
        flagged_content_list = seed_flagged_content(users)
        seed_flags(users, flagged_content_list)
        seed_verifications(users, flagged_content_list)
        seed_api_keys(users)
        seed_statistics()
        
        print("Database seeded successfully!")

if __name__ == "__main__":
    main()

