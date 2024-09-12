import random
from app.models import db, Dice, Side, SavedString

class DiceManager:
    def __init__(self):
        self.dice_list = []
        self.saved_strings = []

    def add_dice(self, name):
        # 중복된 주사위가 있는지 확인
        existing_dice = Dice.query.filter_by(name=name).first()
        if existing_dice:
            return None

        dice = Dice(name=name)
        db.session.add(dice)
        db.session.commit()
        self.dice_list.append(dice)
        return dice

    def add_sides(self, dice_id, values):
        dice = Dice.query.get(dice_id)
        if not dice:
            return None

        added_sides = []
        for value in values:
            value = value.strip()  # 공백 제거
            if not value:  # 빈 문자열 무시
                continue
            # 중복된 면이 있는지 확인
            existing_side = Side.query.filter_by(dice_id=dice_id, value=value).first()
            if existing_side:
                continue

            side = Side(value=value, dice_id=dice_id)
            db.session.add(side)
            added_sides.append(side)

        # 기존의 빈 문자열 면 삭제
        Side.query.filter_by(dice_id=dice_id, value='').delete()

        db.session.commit()
        return added_sides

    def list_dice(self):
        return Dice.query.all()

    def list_sides(self, dice_id):
        dice = Dice.query.get(dice_id)
        if not dice:
            return None
        # 빈 문자열 면 제외하고 반환
        return [side for side in dice.sides if side.value != '']

    def roll_dice(self, dice_id):
        dice = Dice.query.get(dice_id)
        if not dice or not dice.sides:
            return None

        sides = [side.value for side in dice.sides]
        return random.choice(sides)

    def delete_dice(self, dice_id):
        dice = Dice.query.get(dice_id)
        if dice:
            # 먼저 관련된 모든 면을 삭제합니다.
            Side.query.filter_by(dice_id=dice_id).delete()
            # 그 다음 주위를 삭제합니다.
            db.session.delete(dice)
            db.session.commit()
            return True
        return False

    def delete_side(self, dice_id, value):
        dice = Dice.query.get(dice_id)
        if not dice:
            return False
        side = Side.query.filter_by(dice_id=dice_id, value=value).first()
        if side:
            db.session.delete(side)
            db.session.commit()
            return True
        return False

    def save_string(self, string):
        saved_string = SavedString(value=string)
        db.session.add(saved_string)
        db.session.commit()
        return True

    def get_saved_strings(self):
        saved_strings = SavedString.query.all()
        return [{"id": string.id, "value": string.value} for string in saved_strings]

    def delete_saved_string(self, string_id):
        saved_string = SavedString.query.get(string_id)
        if saved_string:
            db.session.delete(saved_string)
            db.session.commit()
            return True
        return False

    def get_dice_sides_count(self, dice_id):
        dice = Dice.query.get(dice_id)
        if not dice:
            return None
        return len([side for side in dice.sides if side.value != ''])

    def get_strings_by_ids(self, string_ids):
        return SavedString.query.filter(SavedString.id.in_(string_ids)).all()