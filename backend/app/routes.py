from flask import Blueprint, jsonify, request, current_app, send_file
from app.models import SavedString
from app.sentence_generator import SentenceGenerator
import io
import json
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "Hello from Flask!"}
    return jsonify(data)

@main.route('/api/add_dice', methods=['POST'])
def add_dice():
    name = request.json.get('name')
    if not name:
        return jsonify({"error": "Name not provided"}), 400

    dice = current_app.dice_manager.add_dice(name)
    if not dice:
        return jsonify({"error": "Dice already exists"}), 400

    return jsonify({"name": dice.name}), 201

@main.route('/api/add_sides', methods=['POST'])
def add_sides():
    dice_id = request.json.get('dice_id')
    values = request.json.get('values')
    if not dice_id or not values:
        return jsonify({"error": "Dice ID or values not provided"}), 400

    sides = current_app.dice_manager.add_sides(dice_id, values)
    if not sides:
        return jsonify({"error": "No sides added or dice not found"}), 400

    return jsonify({"sides": [side.value for side in sides]}), 201

@main.route('/api/list_dice', methods=['GET'])
def list_dice():
    dice_list = current_app.dice_manager.list_dice()
    return jsonify([{"id": dice.id, "name": dice.name, "sides_count": len(dice.sides)} for dice in dice_list]), 200

@main.route('/api/list_sides/<int:dice_id>', methods=['GET'])
def list_sides(dice_id):
    sides = current_app.dice_manager.list_sides(dice_id)
    if sides is None:
        return jsonify({"error": "Dice not found"}), 404
    return jsonify([{"value": side.value} for side in sides]), 200

@main.route('/api/roll_dice', methods=['POST'])
def roll_dice():
    dice_ids = request.json.get('dice_ids')
    if not dice_ids:
        return jsonify({"error": "Dice IDs not provided"}), 400

    results = []
    for dice_id in dice_ids:
        result = current_app.dice_manager.roll_dice(dice_id)
        if result:
            results.append({"dice_id": dice_id, "result": result})
        else:
            results.append({"dice_id": dice_id, "result": "Invalid dice ID or no sides found"})

    return jsonify({"results": results}), 200

@main.route('/api/delete_dice/<int:dice_id>', methods=['DELETE'])
def delete_dice(dice_id):
    result = current_app.dice_manager.delete_dice(dice_id)
    if result:
        return jsonify({"message": "Dice deleted successfully"}), 200
    else:
        return jsonify({"error": "Dice not found"}), 404

@main.route('/api/delete_side/<int:dice_id>', methods=['DELETE'])
def delete_side(dice_id):
    value = request.json.get('value')
    if not value:
        return jsonify({"error": "Side value not provided"}), 400

    result = current_app.dice_manager.delete_side(dice_id, value)
    if result:
        return jsonify({"message": "Side deleted successfully"}), 200
    else:
        return jsonify({"error": "Side not found or dice not found"}), 404

@main.route('/api/save_string', methods=['POST'])
def save_string():
    string = request.json.get('string')
    if not string:
        return jsonify({"error": "String not provided"}), 400

    result = current_app.dice_manager.save_string(string)
    if result:
        return jsonify({"message": "String saved successfully"}), 200
    else:
        return jsonify({"error": "Failed to save string"}), 500

@main.route('/api/get_saved_strings', methods=['GET'])
def get_saved_strings():
    strings = current_app.dice_manager.get_saved_strings()
    return jsonify(strings), 200

@main.route('/api/delete_saved_string/<int:string_id>', methods=['DELETE'])
def delete_saved_string(string_id):
    result = current_app.dice_manager.delete_saved_string(string_id)
    if result:
        return jsonify({"message": "String deleted successfully"}), 200
    else:
        return jsonify({"error": "String not found"}), 404

@main.route('/api/dice_sides_count/<int:dice_id>', methods=['GET'])
def get_dice_sides_count(dice_id):
    count = current_app.dice_manager.get_dice_sides_count(dice_id)
    if count is None:
        return jsonify({"error": "Dice not found"}), 404
    return jsonify({"sides_count": count}), 200

@main.route('/api/generate_sentence', methods=['POST'])
def generate_sentence():
    data = request.json
    if not data or 'words' not in data:
        return jsonify({"error": "Words not provided"}), 400

    words = data['words']
    result = SentenceGenerator.create_sentence(words)
    
    # 자동 저장 부분을 제거합니다.
    return jsonify({"sentence": result.sentence}), 200

@main.route('/api/create_dice_from_strings', methods=['POST'])
def create_dice_from_strings():
    data = request.json
    if not data or 'name' not in data or 'string_ids' not in data:
        return jsonify({"error": "Name or string IDs not provided"}), 400

    name = data['name']
    string_ids = data['string_ids']

    # 새 주사위 생성
    new_dice = current_app.dice_manager.add_dice(name)
    if not new_dice:
        return jsonify({"error": "Failed to create new dice"}), 500

    # 선택된 문자열을 주사위의 면으로 추가
    strings = current_app.dice_manager.get_strings_by_ids(string_ids)
    sides = current_app.dice_manager.add_sides(new_dice.id, [s['value'] for s in strings])

    if not sides:
        return jsonify({"error": "Failed to add sides to the new dice"}), 500

    return jsonify({"message": "Dice created successfully", "dice_id": new_dice.id}), 201

@main.route('/api/add_side_to_dice', methods=['POST'])
def add_side_to_dice():
    data = request.json
    if not data or 'dice_id' not in data or 'value' not in data:
        return jsonify({"error": "Dice ID or value not provided"}), 400

    dice_id = data['dice_id']
    value = data['value']

    sides = current_app.dice_manager.add_sides(dice_id, [value])
    if not sides:
        return jsonify({"error": "Failed to add side to the dice"}), 500

    return jsonify({"message": "Side added successfully"}), 201

@main.route('/api/update_side/<int:dice_id>', methods=['PUT'])
def update_side(dice_id):
    data = request.json
    if not data or 'old_value' not in data or 'new_value' not in data:
        return jsonify({"error": "Old value or new value not provided"}), 400

    result = current_app.dice_manager.update_side(dice_id, data['old_value'], data['new_value'])
    if result:
        return jsonify({"message": "Side updated successfully"}), 200
    else:
        return jsonify({"error": "Side not found or dice not found"}), 404

@main.route('/api/export_database', methods=['GET'])
def export_database():
    dice_list = current_app.dice_manager.list_dice()
    saved_strings = current_app.dice_manager.get_saved_strings()

    export_data = {
        "dice": [],
        "saved_strings": saved_strings
    }

    for dice in dice_list:
        dice_data = {
            "id": dice.id,
            "name": dice.name,
            "sides": [side.value for side in dice.sides]
        }
        export_data["dice"].append(dice_data)

    # Convert to JSON string
    json_data = json.dumps(export_data, ensure_ascii=False, indent=2)

    # Create in-memory file
    mem_file = io.BytesIO()
    mem_file.write(json_data.encode('utf-8'))
    mem_file.seek(0)

    # Generate filename with current date and time
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'database_export_{current_time}.txt'

    return send_file(
        mem_file,
        as_attachment=True,
        download_name=filename,
        mimetype='text/plain'
    )