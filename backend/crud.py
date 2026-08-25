from sqlalchemy.orm import Session
from models import User, Role, AuditLog, Order
from schemas import UserCreate, RoleCreate, OrderCreate, UserSignup
from datetime import datetime, timedelta
from sqlalchemy import func, cast, Date
from auth import hash_password, verify_password

# Users ----------------------------------------------
def get_users(db: Session):
    return db.query(User).all()

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    new_user = User(
        name=user.name,
        email=user.email,
        role_id=user.role_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def deactivate_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user:
        user.is_active = False
        db.commit()
        db.refresh(user)
        create_audit_log(db, user_id=user.id, action="DEACTIVATE", resource=f"user:{user.id}")
    return user

def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user:
        create_audit_log(db, user_id=user.id, action="DELETE", resource=f"user:{user.id}")
        db.delete(user)
        db.commit()
    return user

# Roles ----------------------------------------------
def get_roles(db: Session):
    return db.query(Role).all()

def get_role(db: Session, role_id: int):
    return db.query(Role).filter(Role.id==role_id).first()

def create_role(db: Session, role: RoleCreate):
    new_role = Role(name=role.name)
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role

def update_role(db: Session, role_id: int, role: RoleCreate):
    existing_role = get_role(db, role_id)
    if existing_role:
        existing_role.name = role.name
        db.commit()
        db.refresh(existing_role)
    return existing_role

def delete_role(db: Session, role_id: int):
    role = get_role(db, role_id)
    if role:
        db.delete(role)
        db.commit()
    return role

# AuditLog -------------------------------------------
def create_audit_log(db: Session, user_id: int, action: str, resource: str, ip_address: str=None):
    log = AuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        ip_address=ip_address
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

def get_audit_logs(db: Session):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

# Order ----------------------------------------------
def get_orders(db: Session):
    return db.query(Order).order_by(Order.created_at.desc()).all()

def create_order(db: Session, order: OrderCreate):
    new_order = Order(
        customer_name=order.customer_name,
        amount=order.amount,
        status=order.status
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

# Overview -------------------------------------------
def get_overview(db: Session):
    total_users = db.query(User).count()

    total_orders = db.query(Order). filter(Order.status == "completed").count()

    total_revenue = db.query(func.sum(Order.amount)).filter(
        Order.status == "completed"
    ).scalar() or 0

    now = datetime.utcnow()
    this_month_start = datetime(now.year, now.month, 1)
    last_month_end = this_month_start - timedelta(seconds=1)
    last_month_start = datetime(last_month_end.year, last_month_end.month, 1)

    this_month_revenue = db.query(func.sum(Order.amount)).filter(
        Order.status == "completed",
        Order.created_at >= this_month_start
    ).scalar() or 0

    last_month_revenue = db.query(func.sum(Order.amount)).filter(
        Order.status == "completed", 
        Order.created_at < this_month_start
    ).scalar() or 0

    if last_month_revenue>0:
        growth_percent = ((this_month_revenue - last_month_revenue) / last_month_revenue) * 100
    else:
        growth_percent = 0.0

    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "growth_percent": round(growth_percent, 2)
    }

# Signup/Login
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user_with_password(db: Session, user: UserSignup):
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        role_id=user.role_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Charts
def get_orders_over_time(db: Session):
    results = (
        db.query(
            cast(Order.created_at, Date).label("date"),
            func.count(Order.id).label("order_count"),
            func.sum(Order.amount).label("revenue"),
        )
        .filter(Order.status == "completed")
        .group_by(cast(Order.created_at, Date))
        .order_by(cast(Order.created_at, Date))
        .all()
    )
    return [
        {"date": str(r.date), "order_count": r.order_count, "revenue": float(r.revenue or 0)}
        for r in results
    ]

def get_users_over_time(db: Session):
    results = (
        db.query(
            cast(User.created_at, Date).label("date"),
            func.count(User.id).label("user_count"),
        )
        .group_by(cast(User.created_at, Date))
        .order_by(cast(User.created_at, Date))
        .all()
    )
    return [{"date": str(r.date), "user_count": r.user_count} for r in results]