from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str
    service: str

class SuspectResponse(BaseModel):
    suspect_id: str
    name: str
    role: str
    wanted: bool

    # Person identification
    alias: str | None = None
    dob: str | None = None
    gender: str | None = None
    nationality: str | None = None

    # Case information
    fir_number: str | None = None
    offence_category: str | None = None
    incident_date: str | None = None
    incident_location: str | None = None
    police_station: str | None = None
    court_name: str | None = None
    court_case_number: str | None = None
    filing_date: str | None = None

    # Offence information
    offence_description: str | None = None
    applicable_section: str | None = None
    severity: str | None = None

    # Case status
    case_status: str | None = None

    # Outcome
    judgment_date: str | None = None
    verdict: str | None = None
    sentence_type: str | None = None
    sentence_duration: str | None = None
    penalty: str | None = None
    appeal_status: str | None = None

class MatchedSuspectResponse(SuspectResponse):
    confidence: float = Field(ge=0, le=100)

class IdentificationResponse(BaseModel):
    match: bool
    suspect: MatchedSuspectResponse | None = None
    message: str

