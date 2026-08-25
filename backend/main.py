from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, roles, audit_log, orders, overview, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(roles.router)
app.include_router(audit_log.router)
app.include_router(orders.router)
app.include_router(overview.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "API is running"}