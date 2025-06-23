import axios from 'axios';

const DIABETES_API_URL = 'https://diabetes-api-rukg.onrender.com/predict';

export interface DiabetesInput {
  Age: number;
  Gender: string;
  Hypertension: number;
  Heart_Disease: number;
  Smoking_History: string;
  BMI: number;
  HbA1c_Level: number;
  Blood_Glucose_Level: number;
}

export interface DiabetesResponse {
  prediction: string;
  confidence: number;
  raw_input: DiabetesInput;
}

export const diabetesService = {
  predict: async (data: DiabetesInput): Promise<DiabetesResponse> => {
    try {
      const response = await axios.post<DiabetesResponse>(DIABETES_API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error in diabetes prediction:', error);
      throw new Error('Failed to get diabetes prediction');
    }
  },
}; 