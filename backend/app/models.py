from app import db

class Dice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    sides = db.relationship('Side', backref='dice', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Dice {self.name}>'

class Side(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(80), nullable=False)
    dice_id = db.Column(db.Integer, db.ForeignKey('dice.id'), nullable=False)

    def __repr__(self):
        return f'<Side {self.value} of Dice {self.dice_id}>'

class SavedString(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<SavedString {self.value}>'