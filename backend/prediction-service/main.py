from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from typing import Optional

app = FastAPI(title="Health Oracle Prediction Service")

# Load all models
MODELS_DIR = "models"

try:
    # Load models
    diabetes_model = joblib.load(os.path.join(MODELS_DIR, "diabetes_model.pkl"))
    insomnia_model = joblib.load(os.path.join(MODELS_DIR, "insomnia_model.pkl"))
    obesity_model = joblib.load(os.path.join(MODELS_DIR, "obesity_model.pkl"))
    heart_disease_model = joblib.load(os.path.join(MODELS_DIR, "heart_disease_model.pkl"))
except Exception as e:
    print(f"Error loading models: {e}")
    raise

# Input schemas for each model
class DiabetesInput(BaseModel):
    pregnancies: float
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree: float
    age: float

class InsomniaInput(BaseModel):
    age: float
    sleep_duration: float
    quality_of_sleep: float
    physical_activity_level: float
    stress_level: float
    bmi_category: str
    heart_rate: float
    daily_steps: float

class ObesityInput(BaseModel):
    Gender: str
    family_history_with_overweight: str
    FAVC: str
    CAEC: str
    SMOKE: str
    SCC: str
    CALC: str
    MTRANS: str
    Age: float
    Height: float
    Weight: float
    FCVC: float
    NCP: float
    CH2O: float
    FAF: float
    TUE: float

class HeartDiseaseInput(BaseModel):
    age: float
    sex: str
    chest_pain_type: str
    resting_bp: float
    cholesterol: float
    fasting_bs: float
    resting_ecg: str
    max_hr: float
    exercise_angina: str
    oldpeak: float
    st_slope: str

@app.post("/predict/diabetes")
async def predict_diabetes(data: DiabetesInput):
    try:
        input_df = pd.DataFrame([data.dict()])
        prediction = diabetes_model.predict(input_df)[0]
        probability = diabetes_model.predict_proba(input_df)[0][1]
        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "message": "High risk of diabetes" if prediction == 1 else "Low risk of diabetes"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/insomnia")
async def predict_insomnia(data: InsomniaInput):
    try:
        input_df = pd.DataFrame([data.dict()])
        prediction = insomnia_model.predict(input_df)[0]
        return {
            "prediction": int(prediction),
            "message": "High risk of insomnia" if prediction == 1 else "Low risk of insomnia"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/obesity")
async def predict_obesity(data: ObesityInput):
    try:
        input_df = pd.DataFrame([data.dict()])
        prediction = obesity_model.predict(input_df)[0]
        return {
            "prediction": str(prediction),
            "message": f"Predicted obesity level: {prediction}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/heart-disease")
async def predict_heart_disease(data: HeartDiseaseInput):
    try:
        input_df = pd.DataFrame([data.dict()])
        prediction = heart_disease_model.predict(input_df)[0]
        probability = heart_disease_model.predict_proba(input_df)[0][1]
        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "message": "High risk of heart disease" if prediction == 1 else "Low risk of heart disease"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 