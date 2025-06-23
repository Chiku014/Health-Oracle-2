# Health Oracle Prediction Service

This service provides prediction endpoints for various health conditions using machine learning models.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Place your model files in the `models` directory:
- diabetes_model.pkl
- insomnia_model.pkl
- obesity_model.pkl
- heart_disease_model.pkl

## Running the Service

Start the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- GET `/health`

### Prediction Endpoints
- POST `/predict/diabetes`
- POST `/predict/insomnia`
- POST `/predict/obesity`
- POST `/predict/heart-disease`

## Input Schemas

Each prediction endpoint expects different input parameters. See the FastAPI documentation at `http://localhost:8000/docs` for details.

## Example Usage

```python
import requests

# Diabetes Prediction
response = requests.post("http://localhost:8000/predict/diabetes", json={
    "pregnancies": 6,
    "glucose": 148,
    "blood_pressure": 72,
    "skin_thickness": 35,
    "insulin": 0,
    "bmi": 33.6,
    "diabetes_pedigree": 0.627,
    "age": 50
})
print(response.json()) 