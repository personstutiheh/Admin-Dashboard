from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas
from auth import require_admin

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=list[schemas.OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@router.post("/", response_model=schemas.OrderOut)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    return crud.create_order(db, order)