🌾 AgriSmart is an AI-powered agriculture assistant that helps farmers and researchers make data-driven decisions using soil analysis, crop prediction, yield estimation, and fertilizer recommendations.

It combines Machine Learning + FastAPI + React (Vite) to deliver real-time agricultural insights.

🚀 Features
🌱 Crop Recommendation
- Predicts the best crop based on soil nutrients and weather
- Provides Top 3 crop suggestions with confidence scores

📊 Yield Prediction
- Estimates crop yield using trained ML models
- Built using XGBoost regression

🧪 Soil Health Analysis
- Calculates soil health score (0–100)
- Classifies soil as:
   - Excellent
   - Good
   - Moderate
   - Poor

🌿 Fertilizer Recommendation
- Suggests fertilizers based on nutrient deficiencies
- Covers:
   - Macronutrients (N, P, K)
   - Micronutrients (Zn, Fe, Mn, B, S)
   - pH correction

🤖 AI Chatbot (Gemini API)
- Integrated chatbot for agricultural queries
- Powered by Google Gemini (gemini-2.5-flash)

🏗️ Tech Stack
- Backend
   - FastAPI
   - Scikit-learn
   - XGBoost
   - NumPy
   - Joblib

- Frontend
   - React (Vite)
   - Tailwind CSS

- AI Integration
   - Google Gemini API (google-genai)

Main Sections:
1. Top Navbar with logo and weather info
2. Sidebar with:
   - Dashboard
   - Crop Recommendation
   - Soil Analysis
   - Weather Forecast
   - Market Prices
3. Main Dashboard showing:
   - Weather card
   - Soil health card
   - Crop suggestion card
   - Market price trends (chart)
4. Use cards with soft shadows and rounded corners
5. Include icons from lucide-react
6. Use dummy data
7. Make it a single file React component

Design vibe: Clean AgriTech startup UI# AgriSmart – Soil Analysis & Crop Recommendations

ML-powered agricultural analysis: crop recommendations, yield prediction, soil health, and fertilizer suggestions.

**Backend and frontend are integrated** – a single server serves both the React UI and the FastAPI API.

## Project Structure

```
   ├── app/
   │   ├── main.py                # FastAPI entry point
   │   ├── schemas.py            # Request schema
   │   ├── services.py           # ML prediction logic
   │   ├── soil_engine.py        # Soil health scoring   
   │   ├── fertilizer_engine.py  # Fertilizer logic
   │   ├── routes/
   │   │   └── chat.py           # Chatbot API
   │   └── models/               # Trained ML models  
   │
   ├── frontend/                 # React frontend (Vite)
   │
   ├── training/
   │   ├── train_crop.py
   │   ├── train_yield.py
   │   └── prepare_yield_dataset.py
   │
   ├── datasets/                 # Dataset files
   ├── requirements.txt
   ├── run.sh
   └── README.md
```

## Quick Start

```bash
pip3 install -r requirements.txt
cd frontend && npm install && cd ..
./run.sh
```

Open **http://localhost:8000** – the app and API run from one server.

**macOS:** If you get `libomp.dylib` error, run: `brew install libomp`

| URL | Description |
|-----|-------------|
| http://localhost:8000 | App (React UI) |
| http://localhost:8000/api/analyze | Analysis API |
| http://localhost:8000/docs | Swagger API docs |

## Development Mode (hot reload)

Run backend and frontend separately for faster iteration:

**Terminal 1 – Backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 – Frontend:**
```bash
cd frontend && npm run dev
```

Open http://localhost:5173 (Vite proxies `/api` to backend).

## Deployment

```bash
cd frontend && npm run build && cd ..
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

One process serves both the UI and API. Set `VITE_API_URL` before building only if the API is on a different host.
