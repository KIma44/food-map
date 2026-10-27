from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
import requests
import google.generativeai as genai
from typing import List

app = FastAPI()

# Google API 키 설정
API_KEY = ""
genai.configure(api_key=API_KEY)

@app.get("/")
def home():
    return {"message": "캡스톤 AI 서버가 정상적으로 실행 중입니다!"}


# 백그라운드에서 실행될 AI 분석 및 결과 콜백 함수
def process_ai_analysis_background(review_id: int, review_text: str, images_data: list):
    try:
        model = genai.GenerativeModel('gemini-3.8-flash')
        
        # 🚀 개인 맞춤 판정이 아닌, 음식의 객관적인 성분과 맵기를 분석하도록 프롬프트 수정
        prompt = f"""
        - 음식 리뷰 내용: {review_text}

        위 리뷰 내용과 첨부된 사진을 바탕으로, 인사말이나 기타 불필요한 서두 없이 아래 형식으로만 정확히 결과를 출력하세요.

        1. 한국인 맵기: [X/5단계]
        2. 외국인 맵기: [X/5단계]
        3. 포함된 주요 성분 및 알레르기 유발 물질: [포함된 원재료 및 성분들을 쉼표로 나열, 예: 딸기, 우유, 견과류, 밀 등]
        """
        
        contents = [prompt]
        
        for img_info in images_data:
            image_part = {
                "mime_type": img_info["mime_type"],
                "data": img_info["bytes"]
            }
            contents.append(image_part)
        
        response = model.generate_content(contents)
        analysis_result = response.text
        
        callback_url = f"http://localhost:8080/api/reviews/{review_id}/ai-result"
        requests.post(callback_url, json={"aiAnalysis": analysis_result})
        print(f"[백그라운드 완료] Review ID {review_id} AI 분석 결과 Spring Boot 전송 성공")
        
    except Exception as e:
        print(f"[백그라운드 오류] AI 분석 중 에러 발생: {e}")


@app.post("/api/analyze")
async def analyze_food(
    review_id: int = Form(...),            
    review_text: str = Form(...),
    files: List[UploadFile] = File(None),
    background_tasks: BackgroundTasks = None 
):
    try:
        images_data = []
        if files:
            for file in files:
                if file and file.filename:
                    image_bytes = await file.read()
                    if image_bytes:
                        images_data.append({
                            "mime_type": file.content_type if file.content_type else "image/jpeg",
                            "bytes": image_bytes
                        })

        background_tasks.add_task(
            process_ai_analysis_background,
            review_id,
            review_text,
            images_data
        )
        
        return {
            "status": "accepted",
            "message": "AI 분석이 백그라운드에서 시작되었습니다."
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error_message": str(e)
        }