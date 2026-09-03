import json
from pathlib import Path
from ..database import Base, SessionLocal, engine
from ..models import Suspect

DEMO_SUSPECTS = [
    {"suspect_code": "S001", "name": "Raj Kumar", "role": "Theft Suspect", "wanted": True, "image_path": "data/demo/S001-1.png"},
    {"suspect_code": "S002", "name": "Arjun Mehta", "role": "Fraud Suspect", "wanted": False},
    {"suspect_code": "S003", "name": "Vikram Singh", "role": "Robbery Suspect", "wanted": True},
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        for item in DEMO_SUSPECTS:
            existing = db.query(Suspect).filter_by(suspect_code=item["suspect_code"]).first()
            if not existing:
                db.add(Suspect(**item))
            elif item.get("image_path") and existing.suspect_code == "S001":
                existing.image_path = item["image_path"]
        db.commit()

def main():
    seed_database()
    print("CINTRA demo database seeded.")

if __name__ == "__main__":
    main()
