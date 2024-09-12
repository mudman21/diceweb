from app import db
from app.models import Dice, Side, SavedString
import random

class DiceManager:
    def add_dice(self, name):
        existing_dice = Dice.query.filter_by(name=name).first()
        if existing_dice:
            return None
        new_dice = Dice(name=name)
        db.session.add(new_dice)
        db.session.commit()
        return new_dice

    def add_sides(self, dice_id, values):
        dice = Dice.query.get(dice_id)
        if not dice:
            return None
        new_sides = []
        for value in values:
            new_side = Side(value=value, dice_id=dice.id)
            db.session.add(new_side)
            new_sides.append(new_side)
        db.session.commit()
        return new_sides

    def list_dice(self):
        return Dice.query.all()

    def list_sides(self, dice_id):
        dice = Dice.query.get(dice_id)
        if not dice:
            return None
        return dice.sides

    def roll_dice(self, dice_id):
        dice = Dice.query.get(dice_id)
        if not dice or not dice.sides:
            return None
        return random.choice(dice.sides).value

    def delete_dice(self, dice_id):
        dice = Dice.query.get(dice_id)
        if not dice:
            return False
        db.session.delete(dice)
        db.session.commit()
        return True

    def delete_side(self, dice_id, value):
        side = Side.query.filter_by(dice_id=dice_id, value=value).first()
        if not side:
            return False
        db.session.delete(side)
        db.session.commit()
        return True

    def update_side(self, dice_id, old_value, new_value):
        side = Side.query.filter_by(dice_id=dice_id, value=old_value).first()
        if not side:
            return False
        side.value = new_value
        db.session.commit()
        return True

    def save_string(self, string):
        new_string = SavedString(value=string)
        db.session.add(new_string)
        db.session.commit()
        return True

    def get_saved_strings(self):
        return [{"id": string.id, "value": string.value} for string in SavedString.query.all()]

    def delete_saved_string(self, string_id):
        string = SavedString.query.get(string_id)
        if not string:
            return False
        db.session.delete(string)
        db.session.commit()
        return True

    def get_dice_sides_count(self, dice_id):
        dice = Dice.query.get(dice_id)
        if not dice:
            return None
        return len(dice.sides)

    def get_strings_by_ids(self, string_ids):
        return [{"id": string.id, "value": string.value} for string in SavedString.query.filter(SavedString.id.in_(string_ids)).all()]