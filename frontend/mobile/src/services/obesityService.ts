import axios from 'axios';

const OBESITY_API_URL = 'https://obesity-api-0v0o.onrender.com/predict';

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Valid transportation modes
const VALID_TRANSPORT_MODES = ['Automobile', 'Motorbike', 'Walking', 'Bike', 'Public_Transportation'];

export interface ObesityInput {
  Gender: string;
  Age: number;
  Height: number;
  Weight: number;
  family_history_with_overweight: string;
  FAVC: string;
  FCVC: number;
  NCP: number;
  CAEC: string;
  SMOKE: string;
  CH2O: number;
  SCC: string;
  FAF: number;
  TUE: number;
  CALC: string;
  MTRANS: string;
}

export interface ObesityResponse {
  prediction: number;
}

export const obesityService = {
  predict: async (data: ObesityInput): Promise<ObesityResponse> => {
    try {
      // Debug logging for transport mode
      console.log('Received transport mode:', data.MTRANS);
      console.log('Type of received mode:', typeof data.MTRANS);
      console.log('Valid modes:', VALID_TRANSPORT_MODES);
      console.log('Is mode included?', VALID_TRANSPORT_MODES.includes(data.MTRANS));
      
      // Validate the selected transport mode
      const selectedMode = data.MTRANS;
      if (!VALID_TRANSPORT_MODES.includes(selectedMode)) {
        console.error('Invalid transport mode:', selectedMode);
        console.error('Valid modes are:', VALID_TRANSPORT_MODES);
        console.error('Strict comparison results:');
        VALID_TRANSPORT_MODES.forEach(mode => {
          console.error(`Comparing with ${mode}:`, {
            equals: selectedMode === mode,
            selectedLength: selectedMode.length,
            validLength: mode.length
          });
        });
        throw new Error(`Invalid transport mode. Must be one of: ${VALID_TRANSPORT_MODES.join(', ')}`);
      }

      // Format data with correct capitalization and exact values
      const formattedData = {
        Gender: capitalizeFirstLetter(data.Gender),
        Age: Number(data.Age),
        Height: Number(data.Height),
        Weight: Number(data.Weight),
        family_history_with_overweight: data.family_history_with_overweight.toLowerCase(),
        FAVC: data.FAVC.toLowerCase(),
        FCVC: Number(data.FCVC),
        NCP: Number(data.NCP),
        CAEC: data.CAEC === 'no' ? 'no' : capitalizeFirstLetter(data.CAEC),
        SMOKE: data.SMOKE.toLowerCase(),
        CH2O: Number(data.CH2O),
        SCC: data.SCC.toLowerCase(),
        FAF: Number(data.FAF),
        TUE: Number(data.TUE),
        CALC: data.CALC === 'no' ? 'no' : capitalizeFirstLetter(data.CALC),
        MTRANS: selectedMode
      };

      console.log('Final transport mode being sent:', formattedData.MTRANS);
      console.log('Request data:', JSON.stringify(formattedData, null, 2));

      const response = await axios.post<ObesityResponse>(OBESITY_API_URL, formattedData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Detailed error information:');
      if (axios.isAxiosError(error)) {
        console.error('Error response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          request: {
            method: error.config?.method,
            url: error.config?.url,
            data: error.config?.data,
            headers: error.config?.headers
          }
        });
        throw new Error(`API Error: ${error.response?.status} - ${error.response?.statusText}\n${JSON.stringify(error.response?.data)}`);
      } else {
        console.error('Non-Axios error:', error);
        throw new Error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  },
}; 