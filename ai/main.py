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
def process_ai_analysis_background(review_id: int, review_text: str, user_allergies: str, images_data: list):
    try:
        model = genai.GenerativeModel('gemini-3.8-flash')
        
        prompt = f"""
        - 사용자 알레르기 정보: {user_allergies}
        - 음식 리뷰 내용: {review_text}

        위 정보와 첨부된 사진을 바탕으로, 불필요한 설명이나 서두 없이 아래 형식으로만 정확히 결과를 출력하세요.

        1. 한국 맵기: [X/5단계]
        2. 외국인 맵기: [X/5단계]
        3. 알레르기 위험도: [안전 / 주의 / 위험] (이유는 1줄로만 아주 간결하게)
        """
        
        contents = [prompt]
        
        # 미리 읽어둔 이미지 바이트 데이터를 컨텐츠에 추가
        for img_info in images_data:
            image_part = {
                "mime_type": img_info["mime_type"],
                "data": img_info["bytes"]
            }
            contents.append(image_part)
        
        # Gemini API 호출 (시간이 걸리는 작업)
        response = model.generate_content(contents)
        analysis_result = response.text
        
        # 분석 완료 후 Spring Boot로 결과 전송 (Spring Boot가 DB를 업데이트함)
        callback_url = f"http://localhost:8080/api/reviews/{review_id}/ai-result"
        requests.post(callback_url, json={"aiAnalysis": analysis_result})
        print(f"[백그라운드 완료] Review ID {review_id} AI 분석 결과 Spring Boot 전송 성공")
        
    except Exception as e:
        print(f"[백그라운드 오류] AI 분석 중 에러 발생: {e}")


@app.post("/api/analyze")
async def analyze_food(
    review_id: int = Form(...),            #  어떤 리뷰인지 식별하기 위한 ID
    review_text: str = Form(...),
    user_allergies: str = Form(...),
    files: List[UploadFile] = File(None),
    background_tasks: BackgroundTasks = None #  FastAPI 백그라운드 태스크 객체
):
    try:
        # UploadFile은 엔드포인트가 끝나면 닫히므로, 
        # 백그라운드 작업에 넘기기 전에 반드시 미리 메모리에 바이트로 읽어둡니다.
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

        # 백그라운드 작업 등록 (Gemini 분석을 뒤로 미룸)
        background_tasks.add_task(
            process_ai_analysis_background,
            review_id,
            review_text,
            user_allergies,
            images_data
        )
        
        # 사용자와 Spring Boot에게 대기 시간 없이 즉시 응답 반환 (0.1초 소요)
        return {
            "status": "accepted",
            "message": "AI 분석이 백그라운드에서 시작되었습니다."
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error_message": str(e)
        }