import json
from pathlib import Path
from ..database import Base, SessionLocal, engine
from ..models import Suspect

DEMO_SUSPECTS = [
    {"suspect_code": "S001", "name": "Raj Kumar", "role": "Theft Suspect", "wanted": True},
    {"suspect_code": "S002", "name": "Arjun Mehta", "role": "Fraud Suspect", "wanted": False},
    {"suspect_code": "S003", "name": "Vikram Singh", "role": "Robbery Suspect", "wanted": True},
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        for item in DEMO_SUSPECTS:
            if not db.query(Suspect).filter_by(suspect_code=item["suspect_code"]).first():
                db.add(Suspect(**item))
        db.commit()

def main():
    seed_database()
    print("CINTRA demo database seeded.")

if __name__ == "__main__":
    main()
