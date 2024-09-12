from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    CORS(app)

    with app.app_context():
        from app import models
        db.create_all()
        from app.dice_manager import DiceManager
        app.dice_manager = DiceManager()

    from app.routes import main
    app.register_blueprint(main)

    return app