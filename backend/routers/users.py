from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas
from auth import require_admin

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User Not Found")
    return user

@router.post("/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    return crud.create_user(db, user)

@router.patch("/{user_id}/deactivate", response_model=schemas.UserOut)
def deactivate_user(user_id: int, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    user = crud.deactivate_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User Not Found")
    return {"message": "User Deleted"}