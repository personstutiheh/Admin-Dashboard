from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/overview", tags=["Overview"])

@router.get("/", response_model=schemas.OverviewOut)
def get_overview(db: Session = Depends(get_db)):
    return crud.get_overview(db)

@router.get("/orders-over-time", response_model=list[schemas.OrdersOverTimePoint])
def orders_over_time(db: Session = Depends(get_db)):
    return crud.get_orders_over_time(db)

@router.get("/users-over-time", response_model=list[schemas.UsersOverTimePoint])
def users_over_time(db: Session = Depends(get_db)):
    return crud.get_users_over_time(db)