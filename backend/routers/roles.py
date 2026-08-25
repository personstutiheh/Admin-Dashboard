from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas
from auth import require_admin

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/", response_model=list[schemas.RoleOut])
def list_roles(db: Session = Depends(get_db)):
    return crud.get_roles(db)

@router.get("/{role_id}", response_model=schemas.RoleOut)
def get_role(role_id: int, db: Session = Depends(get_db)):
    role = crud.get_role(db, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not Found")
    return role

@router.post("/", response_model=schemas.RoleOut)
def create_role(role: schemas.RoleCreate, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    return crud.create_role(db, role)

@router.patch("/{role_id}", response_model=schemas.RoleOut)
def update_role(role_id: int, role: schemas.RoleCreate, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    updated_role = crud.update_role(db, role_id, role)
    if not updated_role:
        raise HTTPException(status_code=404, detail="Role not Found")
    return updated_role

@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db), _: bool = Depends(require_admin)):
    role = crud.delete_role(db, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not Found")
    return {"message": "Role Deleted"}