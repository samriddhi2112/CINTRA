from sqlalchemy import select
from sqlalchemy.orm import Session
from ..models import Suspect

def list_suspects(db: Session):
    return list(db.scalars(select(Suspect).where(Suspect.active.is_(True)).order_by(Suspect.suspect_code)))

def get_suspect(db: Session, suspect_code: str):
    return db.scalar(select(Suspect).where(Suspect.suspect_code == suspect_code, Suspect.active.is_(True)))
