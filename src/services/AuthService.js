import axios from 'axios';

const API_URL = 'https://7161-102-16-209-142.ngrok-free.app/api/v1/auth/check-user';

export const sendGoogleTokenBack = async (token) => {
    try {
        const response = await axios.post(API_URL, { token }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'envoi du token au backend:', error);
        throw error; 
      }
};