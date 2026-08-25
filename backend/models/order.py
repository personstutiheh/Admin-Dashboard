from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    