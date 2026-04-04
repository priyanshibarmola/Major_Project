from fastapi import APIRouter
import os
from google import genai

router = APIRouter()

# Create client (NEW way)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@router.post("/api/chat")
async def chat(data: dict):
    message = data.get("message")

    if not message:
        return {"reply": "Please provide a message."}

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=message
        )
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}
