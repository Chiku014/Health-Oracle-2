import axios from 'axios';

const DIABETES_API_URL = 'https://diabetes-api-rukg.onrender.com';
const INSOMNIA_API_URL = 'https://insomnia-api-nztu.onrender.com';
const OBESITY_API_URL = 'https://obesity-api-0v0o.onrender.com';
const HEART_DISEASE_API_URL = 'https://heartdisease-api.onrender.com';

export interface DiabetesPrediction {
  age: number;
  gender: string;
  bmi: number;
  hba1c: number;
  blood_glucose: number;
  hypertension: string;
  heart_disease: string;
  smoking_history: string;
}

export type InsomniaPrediction = {
  age: number;
  gender: string;
  occupation: string;
  sleep_duration: number;
  quality_of_sleep: number;
  physical_activity_level: number;
  stress_level: number;
  bmi_category: string;
  blood_pressure: string;
  heart_rate: number;
  daily_steps: number;
};

export interface ObesityPrediction {
  Gender: string;
  family_history_with_overweight: string;
  FAVC: string;
  CAEC: string;
  SMOKE: string;
  SCC: string;
  CALC: string;
  MTRANS: string;
  Age: number;
  Height: number;
  Weight: number;
  FCVC: number;
  NCP: number;
  CH2O: number;
  FAF: number;
  TUE: number;
}

export interface HeartDiseasePrediction {
  age: number;
  sex: string;
  chest_pain_type: string;
  resting_bp: number;
  cholesterol: number;
  fasting_bs: number;
  resting_ecg: string;
  max_hr: number;
  exercise_angina: string;
  oldpeak: number;
  st_slope: string;
}

export const predictionService = {
  predictDiabetes: async (data: DiabetesPrediction) => {
    const response = await axios.post(`${DIABETES_API_URL}/predict`, data);
    return response.data;
  },

  predictInsomnia: async (data: InsomniaPrediction) => {
    const response = await axios.post(`${INSOMNIA_API_URL}/predict`, data);
    return response.data;
  },

  predictObesity: async (data: ObesityPrediction) => {
    const response = await axios.post(`${OBESITY_API_URL}/predict`, data);
    return response.data;
  },

  predictHeartDisease: async (data: HeartDiseasePrediction) => {
    const response = await axios.post(`${HEART_DISEASE_API_URL}/predict`, data);
    return response.data;
  },
}; 