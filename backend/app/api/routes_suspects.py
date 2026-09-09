from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import SuspectResponse
from ..services.suspect_service import get_suspect, list_suspects

router = APIRouter(prefix="/suspects", tags=["suspects"])

def _public_suspect(suspect):
    return {
        "suspect_id": suspect.suspect_code,
        "name": suspect.name,
        "role": suspect.role,
        "wanted": suspect.wanted,
        "alias": getattr(suspect, "alias", None),
        "dob": getattr(suspect, "dob", None),
        "gender": getattr(suspect, "gender", None),
        "nationality": getattr(suspect, "nationality", None),
        "fir_number": getattr(suspect, "fir_number", None),
        "offence_category": getattr(suspect, "offence_category", None),
        "incident_date": getattr(suspect, "incident_date", None),
        "incident_location": getattr(suspect, "incident_location", None),
        "police_station": getattr(suspect, "police_station", None),
        "court_name": getattr(suspect, "court_name", None),
        "court_case_number": getattr(suspect, "court_case_number", None),
        "filing_date": getattr(suspect, "filing_date", None),
        "offence_description": getattr(suspect, "offence_description", None),
        "applicable_section": getattr(suspect, "applicable_section", None),
        "severity": getattr(suspect, "severity", None),
        "case_status": getattr(suspect, "case_status", None),
        "judgment_date": getattr(suspect, "judgment_date", None),
        "verdict": getattr(suspect, "verdict", None),
        "sentence_type": getattr(suspect, "sentence_type", None),
        "sentence_duration": getattr(suspect, "sentence_duration", None),
        "penalty": getattr(suspect, "penalty", None),
        "appeal_status": getattr(suspect, "appeal_status", None),
    }


@router.get("", response_model=list[SuspectResponse])
def read_suspects(db: Session = Depends(get_db)):
    return [_public_suspect(suspect) for suspect in list_suspects(db)]

@router.get("/{suspect_code}", response_model=SuspectResponse)
def read_suspect(suspect_code: str, db: Session = Depends(get_db)):
    suspect = get_suspect(db, suspect_code)
    if not suspect:
        raise HTTPException(status_code=404, detail="Suspect not found")
    return _public_suspect(suspect)
