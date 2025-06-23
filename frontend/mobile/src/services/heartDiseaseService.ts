import axios from 'axios';

const HEART_DISEASE_API_URL = 'https://heartdisease-api.onrender.com/predict';

export interface HeartDiseaseInput {
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
  ca: number;
  thal: number;
}

export interface HeartDiseaseResponse {
  prediction: number;
}

export const heartDiseaseService = {
  predict: async (data: HeartDiseaseInput): Promise<HeartDiseaseResponse> => {
    try {
      // Format the data according to API expectations
      const formattedData = {
        age: Number(data.age),
        sex: data.sex === 'Male' ? 1 : 0,
        cp: data.chest_pain_type === 'ATA' ? 1 : 
            data.chest_pain_type === 'NAP' ? 2 :
            data.chest_pain_type === 'ASY' ? 3 :
            data.chest_pain_type === 'TA' ? 0 : 1,
        trestbps: Number(data.resting_bp),
        chol: Number(data.cholesterol),
        fbs: Number(data.fasting_bs),
        restecg: data.resting_ecg === 'Normal' ? 0 :
                data.resting_ecg === 'ST' ? 1 :
                data.resting_ecg === 'LVH' ? 2 : 0,
        thalachh: Number(data.max_hr),
        exang: data.exercise_angina === 'Yes' ? 1 : 0,
        oldpeak: Number(data.oldpeak),
        slope: data.st_slope === 'Up' ? 0 :
               data.st_slope === 'Flat' ? 1 :
               data.st_slope === 'Down' ? 2 : 0,
        ca: Number(data.ca),
        thal: Number(data.thal)
      };

      console.log('Sending heart disease prediction request with data:', formattedData);
      
      const response = await axios.post<HeartDiseaseResponse>(HEART_DISEASE_API_URL, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in heart disease prediction:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', {
          status: error.response?.status,
          data: error.response?.data
        });
      }
      throw new Error('Failed to get heart disease prediction');
    }
  },
}; 