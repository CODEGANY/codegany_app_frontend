import axios from 'axios';

const adress = 'https://d67f-66-9-179-193.ngrok-free.app/api/v1'
export const getInfoAboutTokenUser = async (token) => {
    const API_URL = `${adress}/auth/check-user`;
    try {
        const response = await axios.post(API_URL, { token }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'envoi du token au backend:', error);
        throw error; 
      }
};

export const sendRegistration = async (values) => {
    const API_URL = `${adress}/users/register`;
    try {
      console.log(values);
      
        const response = await axios.post(API_URL, { values }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'envoi du token au backend:', error);
        throw error; 
      }
};






