from app.dice import DiceManager
from app.models import db, Dice, Side
from app import create_app

app = create_app()
app.app_context().push()

# DiceManager 인스턴스 생성
dice_manager = DiceManager()

# 콘솔에서 사용할 수 있는 함수 정의
def add_dice(name):
    return dice_manager.add_dice(name)

def list_dice():
    return dice_manager.list_dice()

def add_sides(dice_id, values):
    return dice_manager.add_sides(dice_id, values)

def list_sides(dice_id):
    return dice_manager.list_sides(dice_id)

def roll_dice(dice_id):
    return dice_manager.roll_dice(dice_id)

def menu():
    while True:
        print("\n1. Add Dice")
        print("2. List Dice")
        print("3. Add Sides to Dice")
        print("4. List Sides of Dice")
        print("5. Roll Dice")
        print("6. Exit")
        choice = input("Enter choice: ")

        if choice == '1':
            name = input("Enter dice name: ")
            dice = add_dice(name)
            if dice:
                print(f"Added dice: {dice}")
            else:
                print("Dice already exists.")
        elif choice == '2':
            dice_list = list_dice()
            for dice in dice_list:
                print(f"Dice ID: {dice.id}, Name: {dice.name}")
        elif choice == '3':
            dice_id = int(input("Enter dice ID: "))
            values = input("Enter side values (comma-separated): ").split(',')
            sides = add_sides(dice_id, values)
            if sides:
                for side in sides:
                    print(f"Added side: {side}")
            else:
                print("No sides added or dice not found.")
        elif choice == '4':
            dice_id = int(input("Enter dice ID: "))
            sides = list_sides(dice_id)
            if sides:
                for side in sides:
                    print(f"Side: {side.value}")
            else:
                print("No sides found or dice not found.")
        elif choice == '5':
            dice_ids = input("Enter dice IDs to roll (comma-separated): ").split(',')
            results = []
            for dice_id in dice_ids:
                result = roll_dice(int(dice_id.strip()))
                if result:
                    results.append(result)
                else:
                    results.append("Invalid dice ID or no sides found.")
            print("Roll results:", results)
        elif choice == '6':
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == '__main__':
    menu()