import axios from 'axios';

const INSOMNIA_API_URL = 'https://insomnia-api-nztu.onrender.com/predict';

export interface InsomniaInput {
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
}

export interface InsomniaResponse {
  prediction: string;
  confidence: number;
  raw_input: InsomniaInput;
}

export const insomniaService = {
  predict: async (data: InsomniaInput): Promise<InsomniaResponse> => {
    try {
      const response = await axios.post<InsomniaResponse>(INSOMNIA_API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error in insomnia prediction:', error);
      throw new Error('Failed to get insomnia prediction');
    }
  },
}; 