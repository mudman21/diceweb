import os
from dotenv import load_dotenv

# 현재 스크립트의 디렉토리 경로를 가져옵니다.
current_dir = os.path.dirname(os.path.abspath(__file__))

# 프로젝트 루트 디렉토리 경로를 계산합니다.
project_root = os.path.dirname(current_dir)

# .env 파일의 경로를 지정합니다.
dotenv_path = os.path.join(project_root, '.env')

print(f"Looking for .env file at: {dotenv_path}")
print(f"File exists: {os.path.exists(dotenv_path)}")

# .env 파일을 로드합니다.
load_dotenv(dotenv_path)

# 환경 변수가 제대로 로드되었는지 확인합니다.
openai_api_key = os.getenv('OPENAI_API_KEY')
if openai_api_key:
    print(f"OPENAI_API_KEY loaded successfully: {openai_api_key[:5]}...")
else:
    print("Failed to load OPENAI_API_KEY")

# 현재 작업 디렉토리와 PYTHONPATH를 출력합니다.
print(f"Current working directory: {os.getcwd()}")
print(f"PYTHONPATH: {os.environ.get('PYTHONPATH', 'Not set')}")

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)