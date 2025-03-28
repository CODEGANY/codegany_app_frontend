import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';

/**
 * Creates an approval for a purchase request
 * @param {number} requestId - ID of the purchase request to approve/reject
 * @param {string} decision - Approval decision: "approved", "rejected", or "pending_info"
 * @param {string} [comment] - Optional comment for the decision
 * @returns {Promise<Object>} The created approval
 */
export const createApproval = async (requestId, decision, comment = "") => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const approvalData = {
    request_id: requestId,
    decision: decision,
    comment: comment
  };
  
  try {
    const response = await axios.post(
      `${BASE_API_URL}${API_ENDPOINTS.APPROVALS.CREATE}`,
      {
        ...approvalData,
        token: token
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    // Add more specific error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.detail || 
        'Une erreur est survenue lors du traitement de cette demande';
      
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Aucune réponse du serveur. Vérifiez votre connexion internet.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Erreur lors de la demande: ${error.message}`);
    }
  }
};

/**
 * Fetches approval information for a specific purchase request
 * @param {number} requestId - ID of the purchase request
 * @returns {Promise<Object>} The approval information
 */
export const fetchRequestApproval = async (requestId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  try {
    const response = await axios.get(
      `${BASE_API_URL}${API_ENDPOINTS.APPROVALS.GET_BY_REQUEST(requestId)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No approval found, which is a valid state
      return null;
    }
    
    throw new Error(`Erreur lors de la récupération des informations d'approbation: ${error.message}`);
  }
};
