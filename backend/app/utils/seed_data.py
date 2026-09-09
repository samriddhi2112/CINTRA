import json
from pathlib import Path
from ..database import Base, SessionLocal, engine
from ..models import Suspect

DEMO_SUSPECTS = [
    {
        "suspect_code": "S001",
        "name": "Raj Kumar",
        "role": "Theft Suspect",
        "wanted": True,
        "image_path": "data/demo/S001-1.png",
        "alias": "Raju / Shadow",
        "dob": "1990-08-14",
        "gender": "Male",
        "nationality": "Indian",
        "fir_number": "FIR-2024-0981",
        "offence_category": "Theft & Burglary",
        "incident_date": "2024-02-18",
        "incident_location": "Connaught Place, New Delhi",
        "police_station": "Connaught Place PS, Delhi Police",
        "court_name": "Patiala House Courts, New Delhi",
        "court_case_number": "CC-4421/2024",
        "filing_date": "2024-02-20",
        "offence_description": "Unlawful breaking into commercial bank vault and theft of cash and gold ornaments worth ₹45 Lakhs.",
        "applicable_section": "IPC Section 379 (Theft), IPC Section 457 (Lurking House-trespass)",
        "severity": "High Risk",
        "case_status": "Under Investigation",
        "judgment_date": "Pending",
        "verdict": "Non-Bailable Warrant Issued",
        "sentence_type": "Custodial Imprisonment Requested",
        "sentence_duration": "Up to 7 Years upon conviction",
        "penalty": "₹ 2,00,000 Fine Requested",
        "appeal_status": "Pre-trial Status",
    },
    {
        "suspect_code": "S002",
        "name": "Arjun Mehta",
        "role": "Fraud Suspect",
        "wanted": False,
        "alias": "Mr. Broker",
        "dob": "1985-03-22",
        "gender": "Male",
        "nationality": "Indian",
        "fir_number": "FIR-2023-4102",
        "offence_category": "Financial Fraud & Forgery",
        "incident_date": "2023-09-10",
        "incident_location": "Bandra Kurla Complex (BKC), Mumbai",
        "police_station": "BKC Crime Branch, Mumbai Police",
        "court_name": "Bombay Sessions Court",
        "court_case_number": "CC-8812/2023",
        "filing_date": "2023-09-25",
        "offence_description": "Creation of fraudulent corporate entity documents to illegally obtain ₹1.2 Crore loan disbursement.",
        "applicable_section": "IPC Section 420 (Cheating), Section 468 (Forgery for Cheating)",
        "severity": "Medium Risk",
        "case_status": "Charges Filed / Trial Pending",
        "judgment_date": "2024-05-15",
        "verdict": "Charges Filed (Interim Bail Sanctioned)",
        "sentence_type": "Conditional Interim Bail",
        "sentence_duration": "Trial Pending",
        "penalty": "₹ 5,00,000 Surety Bond Deposited",
        "appeal_status": "Bail Granted",
    },
    {
        "suspect_code": "S003",
        "name": "Vikram Singh",
        "role": "Robbery Suspect",
        "wanted": True,
        "alias": "Vicky Cobra",
        "dob": "1982-11-05",
        "gender": "Male",
        "nationality": "Indian",
        "fir_number": "FIR-2024-1109",
        "offence_category": "Armed Robbery & Assault",
        "incident_date": "2024-01-08",
        "incident_location": "MG Road, Bengaluru",
        "police_station": "Central Crime Station (CCB), Bengaluru",
        "court_name": "City Civil & Sessions Court, Bengaluru",
        "court_case_number": "CC-3301/2024",
        "filing_date": "2024-01-12",
        "offence_description": "Armed robbery of cash transit vehicle using unlicensed firearms resulting in severe injury to guard.",
        "applicable_section": "IPC Section 392 (Robbery), Section 397 (Robbery with Attempt to Cause Death), Arms Act Sec 25",
        "severity": "Critical Danger",
        "case_status": "Under Investigation / Absconding",
        "judgment_date": "Pending",
        "verdict": "Absconding / Red Notice Active",
        "sentence_type": "Rigorous Imprisonment Sought",
        "sentence_duration": "10 Years to Life Imprisonment",
        "penalty": "₹ 10,00,000 Penalty & Property Seizure",
        "appeal_status": "Absconding",
    },
    {
        "suspect_code": "S004",
        "name": "Anvi Mishra",
        "role": "Cyber Crime Suspect",
        "wanted": True,
        "image_path": "data/demo/S004-1.jpg",
        "alias": "Cyber Queen / Cipher",
        "dob": "1994-07-19",
        "gender": "Female",
        "nationality": "Indian",
        "fir_number": "FIR-2024-7702",
        "offence_category": "Cybercrime & Data Breach",
        "incident_date": "2024-04-01",
        "incident_location": "Sector 62, Cyber Hub Noida / Remote",
        "police_station": "Cyber Crime HQ, Sector 108 Noida",
        "court_name": "Special IT Act Court, Gautam Buddha Nagar",
        "court_case_number": "CC-9904/2024",
        "filing_date": "2024-04-05",
        "offence_description": "Unauthorized access to state infrastructure, deployment of ransomware payload, and extortion demand of ₹2 Crores.",
        "applicable_section": "IT Act Sec 66, 66C (Identity Theft), 66D (Cheating by Impersonation), IPC Sec 384 (Extortion)",
        "severity": "Extreme Threat",
        "case_status": "Under Investigation",
        "judgment_date": "Pending",
        "verdict": "Prime Suspect / Lookout Circular Active",
        "sentence_type": "Non-Bailable Custodial Detention",
        "sentence_duration": "Up to 10 Years",
        "penalty": "₹ 25,00,000 Fine & Asset Freezing",
        "appeal_status": "Under Investigation",
    },
]

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        for item in DEMO_SUSPECTS:
            db.add(Suspect(**item))
        db.commit()


def main():
    seed_database()
    print("CINTRA demo database seeded with detailed criminal records.")

if __name__ == "__main__":
    main()

