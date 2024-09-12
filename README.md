# Dice Web Application

이 프로젝트는 주사위를 관리하고 굴릴 수 있는 웹 애플리케이션입니다.

## 주요 기능

1. 주사위 관리
   - 새로운 주사위 추가
   - 기존 주사위 삭제
   - 주사위 목록 조회

2. 주사위 면 관리
   - 주사위에 면 추가
   - 기존 면 수정 및 삭제
   - 면 검색 기능

3. 주사위 굴리기
   - 선택한 주사위 굴리기
   - 결과 저장 및 조회

4. 데이터베이스 내보내기
   - 현재 데이터베이스 상태를 텍스트 파일로 내보내기

## 기술 스택

- Frontend: React.js
- Backend: Flask (Python)
- Database: SQLite

## 설치 및 실행 방법

1. 저장소 클론
   ```
   git clone https://github.com/mudman21/diceweb.git
   cd diceweb
   ```

2. 백엔드 설정
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python run.py
   ```

3. 프론트엔드 설정
   ```
   cd frontend
   npm install
   npm start
   ```

4. 브라우저에서 `http://localhost:3000` 접속

## 최근 업데이트

- 주사위 카드 디자인 개선
- 주사위 면 검색 기능 추가
- 데이터베이스 내보내기 기능 추가

## 기여 방법

이슈를 제출하거나 풀 리퀘스트를 보내주세요. 모든 기여를 환영합니다!

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.