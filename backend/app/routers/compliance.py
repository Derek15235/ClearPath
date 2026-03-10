from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/compliance", tags=["compliance"])

MOCK_COMPLIANCE_ITEMS = [
    {
        "id": "comp-001",
        "title": "Employee Handbook Required",
        "category": "HR",
        "severity": "high",
        "description": "Businesses with 5+ employees must maintain a written employee handbook covering workplace policies, harassment prevention, and disciplinary procedures.",
    },
    {
        "id": "comp-002",
        "title": "Workers Compensation Insurance",
        "category": "Insurance",
        "severity": "critical",
        "description": "Most states require employers to carry workers compensation insurance once they have at least one employee. Penalties for non-compliance can include fines and criminal charges.",
    },
    {
        "id": "comp-003",
        "title": "I-9 Employment Eligibility Verification",
        "category": "Federal",
        "severity": "high",
        "description": "Federal law requires employers to verify the identity and employment authorization of every person hired for employment in the United States using Form I-9.",
    },
    {
        "id": "comp-004",
        "title": "State Business License Renewal",
        "category": "Licensing",
        "severity": "medium",
        "description": "Your state business license must be renewed annually. Failure to renew can result in fines and suspension of business operations.",
    },
    {
        "id": "comp-005",
        "title": "Quarterly Payroll Tax Deposits",
        "category": "Tax",
        "severity": "high",
        "description": "Employers must deposit federal payroll taxes (Social Security, Medicare, and federal income tax withheld) on a schedule determined by the IRS based on your lookback period.",
    },
]


@router.post("/generate")
async def generate_compliance_items(
    user: dict = Depends(get_current_user),
) -> dict:
    """
    Rule engine stub -- returns mock compliance items.
    Phase 6 will replace this with real pgvector-powered rule matching.
    """
    return {
        "status": "generated",
        "user_id": user["sub"],
        "items": MOCK_COMPLIANCE_ITEMS,
    }
