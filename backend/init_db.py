from app import create_app
from app.models import db

app = create_app()
app.app_context().push()

# 데이터베이스 초기화
db.drop_all()
db.create_all()
print("Database initialized.")