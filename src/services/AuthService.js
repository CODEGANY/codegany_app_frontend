import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';

export const sendGoogleTokenBack = async (token) => {
    try {
      console.log(token);
      
        const response = await axios.post(
          `${BASE_API_URL}${API_ENDPOINTS.AUTH.CHECK_USER}`, 
          { token }, 
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'envoi du token au backend:', error);
        throw error; 
      }
};