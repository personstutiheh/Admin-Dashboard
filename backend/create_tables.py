from database import Base, engine
from models import User, Role, AuditLog

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")