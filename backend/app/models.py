from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class Suspect(Base):
    __tablename__ = "suspects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    suspect_code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(160), nullable=False)
    wanted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    image_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Person identification
    alias: Mapped[str | None] = mapped_column(String(120), nullable=True)
    dob: Mapped[str | None] = mapped_column(String(20), nullable=True)
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    nationality: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Case information
    fir_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    offence_category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    incident_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    incident_location: Mapped[str | None] = mapped_column(String(150), nullable=True)
    police_station: Mapped[str | None] = mapped_column(String(150), nullable=True)
    court_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    court_case_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    filing_date: Mapped[str | None] = mapped_column(String(20), nullable=True)

    # Offence information
    offence_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    applicable_section: Mapped[str | None] = mapped_column(String(150), nullable=True)
    severity: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # Case status
    case_status: Mapped[str | None] = mapped_column(String(80), nullable=True)

    # Outcome
    judgment_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
    verdict: Mapped[str | None] = mapped_column(String(120), nullable=True)
    sentence_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sentence_duration: Mapped[str | None] = mapped_column(String(50), nullable=True)
    penalty: Mapped[str | None] = mapped_column(String(100), nullable=True)
    appeal_status: Mapped[str | None] = mapped_column(String(100), nullable=True)

