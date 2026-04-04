from fastapi import APIRouter
import os
import google.generativeai as genai

router = APIRouter()

# Load API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

@router.post("/api/chat")
async def chat(data: dict):
    message = data.get("message")

    if not message:
        return {"reply": "Please provide a message."}

    try:
        response = model.generate_content(message)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}
