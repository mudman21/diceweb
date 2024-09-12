# Flask & React App

## 백엔드 설정
1. `cd backend`
2. `python3 -m venv venv`
3. `source venv/bin/activate` (Windows에서는 `venv\Scripts\activate`)
4. `pip install -r requirements.txt`
5. `python init_db.py`  # 데이터베이스 초기화
6. `python run.py`

## 프론트엔드 설정
1. `cd frontend`
2. `npm install`
3. `npm start`

## 콘솔 사용법
1. `python console.py`
2. 메뉴에서 옵션을 선택하여 주사위를 추가하거나 목록을 확인할 수 있습니다.
3. 주사위에 면을 추가하거나 면 목록을 확인할 수 있습니다.

## API 사용법
### 주사위 추가
- Endpoint: `/api/add_dice`
- Method: `POST`
- Request Body: `{"name": "<dice_name>"}`
- Response: `{"name": "<dice_name>"}`

### 면 추가
- Endpoint: `/api/add_sides`
- Method: `POST`
- Request Body: `{"dice_id": <dice_id>, "values": ["<side_value1>", "<side_value2>", ...]}`
- Response: `{"sides": ["<side_value1>", "<side_value2>", ...]}`

### 주사위 목록 조회
- Endpoint: `/api/list_dice`
- Method: `GET`
- Response: `[{"id": <dice_id>, "name": "<dice_name>"}, ...]`

### 주사위 면 목록 조회
- Endpoint: `/api/list_sides/<dice_id>`
- Method: `GET`
- Response: `[{"value": "<side_value>"}, ...]`

### 주사위 굴리기
- Endpoint: `/api/roll_dice`
- Method: `POST`
- Request Body: `{"dice_ids": [<dice_id1>, <dice_id2>, ...]}`
- Response: `{"results": [{"dice_id": <dice_id>, "result": "<side_value>"}, ...]}`