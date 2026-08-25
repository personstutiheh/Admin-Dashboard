from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal

# Role -----------------------------------------------
class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class RoleOut(RoleBase):
    id: int

    class Config:
        from_attributes = True
        
# User -----------------------------------------------
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    role_id: int

class UserOut(UserBase):
    id: int
    is_active: bool
    role_id: int
    role: RoleOut

    class Config:
        from_attributes = True

# Audit Log ------------------------------------------
class AuditLogOut(BaseModel):
    id: int
    timestamp: datetime
    action: str
    resource: str
    ip_address: Optional[str]
    user_id: Optional[int]

    class Config:
        from_attributes = True

# Orders ---------------------------------------------
class OrderBase(BaseModel):
    customer_name: str
    amount: Decimal
    status: str = "pending"

class OrderCreate(OrderBase):
    pass

class OrderOut(OrderBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Overview -------------------------------------------
class OverviewOut(BaseModel):
    total_users: int
    total_orders: int
    total_revenue: Decimal
    growth_percent: float

# Signup/Login ---------------------------------------
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: int

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# charts ---------------------------------------------
class OrdersOverTimePoint(BaseModel):
    date: str
    order_count: int
    revenue: float

class UsersOverTimePoint(BaseModel):
    date: str
    user_count: int