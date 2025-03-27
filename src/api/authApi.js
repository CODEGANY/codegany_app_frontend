import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';

export const getInfoAboutTokenUser = async (token) => {
    try {
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

export const sendRegistration = async (values) => {
    try {
        const response = await axios.post(
            `${BASE_API_URL}${API_ENDPOINTS.USERS.REGISTER}`, 
            { values }, 
            {
                headers: {
                  'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données d\'inscription au backend:', error);
        throw error; 
    }
};






