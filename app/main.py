import math
import logging
import os
from pathlib import Path

from app.routes.chat import router as chat_router
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.schemas import AnalyzeRequest
from app.services import predict_crop, predict_yield
from app.soil_engine import compute_soil_health
from app.fertilizer_engine import recommend_fertilizer

app.include_router(chat_router)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AgriSmart ML API",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to frontend build (when integrated)
ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIST = ROOT / "frontend" / "dist"


@app.get("/api")
def api_health():
    return {"status": "ok", "message": "AgriSmart ML API", "docs": "/docs"}


@app.post("/api/analyze")
def analyze(data: AnalyzeRequest):
    try:
        # Crop prediction
        top1, top3 = predict_crop(data)
        best_crop = top1[0]
        best_confidence = float(top1[1])

        # Yield prediction
        predicted_yield = predict_yield(data)
        yield_val = predicted_yield / 1000
        if math.isnan(yield_val) or not math.isfinite(yield_val):
            yield_val = 0.0

        # Soil health
        soil_score, soil_status = compute_soil_health(data)

        # Fertilizer recommendation
        fertilizer_recommendations = recommend_fertilizer(data)

        return {
            "cropRecommendation": {
                "bestCrop": best_crop,
                "confidence": round(best_confidence * 100, 2),
                "top3Crops": [
                    {"crop": crop, "confidence": round(float(prob) * 100, 2)}
                    for crop, prob in top3
                ],
            },
            "yieldPrediction": {"estimatedYield": round(yield_val, 2)},
            "soilHealth": {"score": soil_score, "status": soil_status},
            "fertilizerRecommendation": fertilizer_recommendations,
        }
    except Exception as e:
        logger.exception("Analyze failed")
        raise HTTPException(status_code=500, detail=str(e))


# Serve frontend when built (single integrated app)
if FRONTEND_DIST.exists():
    from fastapi.responses import FileResponse

    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    @app.get("/vite.svg")
    def serve_favicon():
        return FileResponse(FRONTEND_DIST / "vite.svg")

    @app.get("/")
    def serve_app():
        return FileResponse(FRONTEND_DIST / "index.html")
