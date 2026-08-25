from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])

@router.get("/", response_model=list[schemas.AuditLogOut])
def list_audit_logs(db: Session = Depends(get_db)):
    return crud.get_audit_logs(db)