import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';

/**
 * Fetches orders and purchase requests data
 * @returns {Promise<Object>} Orders and requests data
 */
export const fetchOrdersAndRequests = async () => {
  // Use token from localStorage in production
  const token = localStorage.getItem('token') || "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI2MjE4NTg4MjQ0ODgxMDU3MjYiLCJlbWFpbCI6InJha290b21hbmRpbWJ5LmxvaWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MjkwMjg5MSwibmFtZSI6Ikxvw69jIFJBS09UT01BTkRJTUJZIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pIRElKdGE4X0VlV0Q1MHpvbUZKTU9tUm1SZHRfMTF6Vi1iek1DbTlCSE43bVZFemh1PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikxvw69jIiwiZmFtaWx5X25hbWUiOiJSQUtPVE9NQU5ESU1CWSIsImlhdCI6MTc0MjkwMzE5MSwiZXhwIjoxNzQyOTA2NzkxLCJqdGkiOiI4MzA2YmE3ZjI1NmY2NjAxYTJjNzRhOTkyNDk1MDM4MjdhNDE3MDFjIn0.pCh6MkdwXUdwUzdlPbQZ0arOyusYHwC7gYTGe8wnlUr4JX4yfjG_e1XtMKS2aHYNa9GwltKTgj8wDZCJNld_o2hCD2FOuZKFmsgJQIxMFUxwD3nJ8Z2xJkq_5fDyEbj3tFJ4JNRD5uwtCm5ZcmC3CGQ3r78RZqLO131fKXIXKGAhDcLqJcQV3Wpj49m2Cf9H3wdZ6pmf-_986M44v-e_zFkdq4XTcTqq5DeyJ-VrtI9JIKwuz31V0ujQcfMh1CK61kfVBfzoBskX4ltGxFKYVfumqA1nvMYjYO1EHXmc9Tr5-SQNtaCZo9R5WDNbQqEx9LJB1nGqGKeL7qlza8xIug";
  
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Fetch purchase requests (all statuses)
    const requestsResponse = await axios.get(`${BASE_API_URL}${API_ENDPOINTS.PURCHASE_REQUESTS.GET_ALL}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Fetch orders
    const ordersResponse = await axios.get(`${BASE_API_URL}${API_ENDPOINTS.ORDERS.GET_ALL}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Process request data to include item details and calculate totals
    const processedRequests = [];
    if (requestsResponse.data && requestsResponse.data.length > 0) {
      for (const request of requestsResponse.data) {
        // Fetch request items for each request
        const requestItemsResponse = await axios.get(
          `${BASE_API_URL}/api/v1/request-items/${request.request_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (requestItemsResponse.data) {
          // Calculate total estimated cost from request items
          const total_estimated_cost = requestItemsResponse.data.reduce(
            (sum, item) => sum + parseFloat(item.estimated_cost || 0),
            0
          );
          
          // Add processed request with request items and total
          processedRequests.push({
            ...request,
            request_items: requestItemsResponse.data,
            total_estimated_cost
          });
        } else {
          // If no items found, add request with empty items array and zero total
          processedRequests.push({
            ...request,
            request_items: [],
            total_estimated_cost: 0
          });
        }
      }
    }

    return {
      orders: ordersResponse.data || [],
      requests: processedRequests
    };
    
  } catch (error) {
    console.error('Error fetching orders and requests data:', error);
    throw new Error('Failed to fetch orders and requests. Please try again later.');
  }
};

/**
 * Fetches detailed material information for a specific request item
 * @param {number} materialId - The ID of the material to fetch
 * @returns {Promise<Object>} Material data
 */
export const fetchMaterialDetails = async (materialId) => {
//   const token = localStorage.getItem('token');
    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI2MjE4NTg4MjQ0ODgxMDU3MjYiLCJlbWFpbCI6InJha290b21hbmRpbWJ5LmxvaWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MjkwMjg5MSwibmFtZSI6Ikxvw69jIFJBS09UT01BTkRJTUJZIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pIRElKdGE4X0VlV0Q1MHpvbUZKTU9tUm1SZHRfMTF6Vi1iek1DbTlCSE43bVZFemh1PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikxvw69jIiwiZmFtaWx5X25hbWUiOiJSQUtPVE9NQU5ESU1CWSIsImlhdCI6MTc0MjkwMzE5MSwiZXhwIjoxNzQyOTA2NzkxLCJqdGkiOiI4MzA2YmE3ZjI1NmY2NjAxYTJjNzRhOTkyNDk1MDM4MjdhNDE3MDFjIn0.pCh6MkdwXUdwUzdlPbQZ0arOyusYHwC7gYTGe8wnlUr4JX4yfjG_e1XtMKS2aHYNa9GwltKTgj8wDZCJNld_o2hCD2FOuZKFmsgJQIxMFUxwD3nJ8Z2xJkq_5fDyEbj3tFJ4JNRD5uwtCm5ZcmC3CGQ3r78RZqLO131fKXIXKGAhDcLqJcQV3Wpj49m2Cf9H3wdZ6pmf-_986M44v-e_zFkdq4XTcTqq5DeyJ-VrtI9JIKwuz31V0ujQcfMh1CK61kfVBfzoBskX4ltGxFKYVfumqA1nvMYjYO1EHXmc9Tr5-SQNtaCZo9R5WDNbQqEx9LJB1nGqGKeL7qlza8xIug";
  
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${BASE_API_URL}/api/v1/materials/${materialId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching material details for material ID ${materialId}:`, error);
    throw new Error(`Failed to fetch material details for ID ${materialId}`);
  }
};

/**
 * Calculates the estimated cost for request items based on material unit price and quantity
 * @param {Array} requestItems - Array of request items with material_id and quantity
 * @returns {Promise<Array>} Request items with calculated estimated costs
 */
export const calculateRequestItemsCost = async (requestItems) => {
//   const token = localStorage.getItem('token');
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI2MjE4NTg4MjQ0ODgxMDU3MjYiLCJlbWFpbCI6InJha290b21hbmRpbWJ5LmxvaWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MjkwMjg5MSwibmFtZSI6Ikxvw69jIFJBS09UT01BTkRJTUJZIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pIRElKdGE4X0VlV0Q1MHpvbUZKTU9tUm1SZHRfMTF6Vi1iek1DbTlCSE43bVZFemh1PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikxvw69jIiwiZmFtaWx5X25hbWUiOiJSQUtPVE9NQU5ESU1CWSIsImlhdCI6MTc0MjkwMzE5MSwiZXhwIjoxNzQyOTA2NzkxLCJqdGkiOiI4MzA2YmE3ZjI1NmY2NjAxYTJjNzRhOTkyNDk1MDM4MjdhNDE3MDFjIn0.pCh6MkdwXUdwUzdlPbQZ0arOyusYHwC7gYTGe8wnlUr4JX4yfjG_e1XtMKS2aHYNa9GwltKTgj8wDZCJNld_o2hCD2FOuZKFmsgJQIxMFUxwD3nJ8Z2xJkq_5fDyEbj3tFJ4JNRD5uwtCm5ZcmC3CGQ3r78RZqLO131fKXIXKGAhDcLqJcQV3Wpj49m2Cf9H3wdZ6pmf-_986M44v-e_zFkdq4XTcTqq5DeyJ-VrtI9JIKwuz31V0ujQcfMh1CK61kfVBfzoBskX4ltGxFKYVfumqA1nvMYjYO1EHXmc9Tr5-SQNtaCZo9R5WDNbQqEx9LJB1nGqGKeL7qlza8xIug";
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const itemsWithCost = [];
  
  for (const item of requestItems) {
    try {
      // Get material details to access unit_price
      const materialDetails = await fetchMaterialDetails(item.material_id);
      
      if (materialDetails) {
        // Calculate estimated cost based on unit price and quantity
        const estimatedCost = parseFloat(materialDetails.unit_price) * item.quantity;
        
        itemsWithCost.push({
          ...item,
          estimated_cost: estimatedCost.toFixed(2),
          material_name: materialDetails.name,
          material_category: materialDetails.category
        });
      } else {
        // If material details not available, keep original estimated_cost if present
        itemsWithCost.push(item);
      }
    } catch (error) {
      // Add the item without additional details if there's an error
      itemsWithCost.push(item);
      console.error(`Error processing request item with material ID ${item.material_id}:`, error);
    }
  }
  
  return itemsWithCost;
};

/**
 * Fetches a specific purchase request with all its details
 * @param {number} requestId - The ID of the purchase request to fetch
 * @returns {Promise<Object>} Purchase request data with items and totals
 */
export const fetchRequestDetails = async (requestId) => {
//   const token = localStorage.getItem('token');
    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI2MjE4NTg4MjQ0ODgxMDU3MjYiLCJlbWFpbCI6InJha290b21hbmRpbWJ5LmxvaWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MjkwMjg5MSwibmFtZSI6Ikxvw69jIFJBS09UT01BTkRJTUJZIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pIRElKdGE4X0VlV0Q1MHpvbUZKTU9tUm1SZHRfMTF6Vi1iek1DbTlCSE43bVZFemh1PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikxvw69jIiwiZmFtaWx5X25hbWUiOiJSQUtPVE9NQU5ESU1CWSIsImlhdCI6MTc0MjkwMzE5MSwiZXhwIjoxNzQyOTA2NzkxLCJqdGkiOiI4MzA2YmE3ZjI1NmY2NjAxYTJjNzRhOTkyNDk1MDM4MjdhNDE3MDFjIn0.pCh6MkdwXUdwUzdlPbQZ0arOyusYHwC7gYTGe8wnlUr4JX4yfjG_e1XtMKS2aHYNa9GwltKTgj8wDZCJNld_o2hCD2FOuZKFmsgJQIxMFUxwD3nJ8Z2xJkq_5fDyEbj3tFJ4JNRD5uwtCm5ZcmC3CGQ3r78RZqLO131fKXIXKGAhDcLqJcQV3Wpj49m2Cf9H3wdZ6pmf-_986M44v-e_zFkdq4XTcTqq5DeyJ-VrtI9JIKwuz31V0ujQcfMh1CK61kfVBfzoBskX4ltGxFKYVfumqA1nvMYjYO1EHXmc9Tr5-SQNtaCZo9R5WDNbQqEx9LJB1nGqGKeL7qlza8xIug";
  
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Fetch purchase request details
    const requestResponse = await axios.get(
      `${BASE_API_URL}${API_ENDPOINTS.PURCHASE_REQUESTS.GET_ONE(requestId)}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Fetch request items
    const requestItemsResponse = await axios.get(
      `${BASE_API_URL}/api/v1/request-items/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Calculate total estimated cost
    const total_estimated_cost = requestItemsResponse.data?.reduce(
      (sum, item) => sum + parseFloat(item.estimated_cost || 0),
      0
    ) || 0;
    
    // Add material details to each item
    const itemsWithDetails = await calculateRequestItemsCost(requestItemsResponse.data || []);
    
    return {
      ...requestResponse.data,
      request_items: itemsWithDetails,
      total_estimated_cost
    };
    
  } catch (error) {
    console.error(`Error fetching request details for request ID ${requestId}:`, error);
    throw new Error(`Failed to fetch purchase request details`);
  }
};

/**
 * Fetches a specific order with all its details
 * @param {number} orderId - The ID of the order to fetch
 * @returns {Promise<Object>} Order data with items and related information
 */
export const fetchOrderDetails = async (orderId) => {
//   const token = localStorage.getItem('token')
    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI2MjE4NTg4MjQ0ODgxMDU3MjYiLCJlbWFpbCI6InJha290b21hbmRpbWJ5LmxvaWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MjkwMjg5MSwibmFtZSI6Ikxvw69jIFJBS09UT01BTkRJTUJZIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pIRElKdGE4X0VlV0Q1MHpvbUZKTU9tUm1SZHRfMTF6Vi1iek1DbTlCSE43bVZFemh1PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikxvw69jIiwiZmFtaWx5X25hbWUiOiJSQUtPVE9NQU5ESU1CWSIsImlhdCI6MTc0MjkwMzE5MSwiZXhwIjoxNzQyOTA2NzkxLCJqdGkiOiI4MzA2YmE3ZjI1NmY2NjAxYTJjNzRhOTkyNDk1MDM4MjdhNDE3MDFjIn0.pCh6MkdwXUdwUzdlPbQZ0arOyusYHwC7gYTGe8wnlUr4JX4yfjG_e1XtMKS2aHYNa9GwltKTgj8wDZCJNld_o2hCD2FOuZKFmsgJQIxMFUxwD3nJ8Z2xJkq_5fDyEbj3tFJ4JNRD5uwtCm5ZcmC3CGQ3r78RZqLO131fKXIXKGAhDcLqJcQV3Wpj49m2Cf9H3wdZ6pmf-_986M44v-e_zFkdq4XTcTqq5DeyJ-VrtI9JIKwuz31V0ujQcfMh1CK61kfVBfzoBskX4ltGxFKYVfumqA1nvMYjYO1EHXmc9Tr5-SQNtaCZo9R5WDNbQqEx9LJB1nGqGKeL7qlza8xIug";
  
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Fetch order details
    const orderResponse = await axios.get(
      `${BASE_API_URL}${API_ENDPOINTS.ORDERS.GET_ONE(orderId)}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    // Fetch supplier details
    const supplierResponse = await axios.get(
      `${BASE_API_URL}${API_ENDPOINTS.SUPPLIERS.GET_ONE(orderResponse.data.supplier_id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    // Fetch associated request details to get additional context
    const requestResponse = await axios.get(
      `${BASE_API_URL}${API_ENDPOINTS.PURCHASE_REQUESTS.GET_ONE(orderResponse.data.request_id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    // Fetch order items
    const orderItemsResponse = await axios.get(
      `${BASE_API_URL}/api/v1/order-items/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    // Calculate total actual cost
    const total_actual_cost = orderItemsResponse.data?.reduce(
      (sum, item) => sum + parseFloat(item.actual_cost || 0),
      0
    ) || 0;
    
    // Get full material details for each order item
    const itemsWithDetails = await Promise.all((orderItemsResponse.data || []).map(async (item) => {
      try {
        const materialDetails = await fetchMaterialDetails(item.material_id);
        
        // Log material details for debugging
        console.debug(`Material details for ID ${item.material_id}:`, materialDetails);
        
        // Validate that unit_price exists and is a number
        let unitPrice = 0;
        if (materialDetails && materialDetails.unit_price) {
          unitPrice = parseFloat(materialDetails.unit_price);
          // Handle NaN case
          if (isNaN(unitPrice)) {
            console.warn(`Invalid unit price for material ID ${item.material_id}: ${materialDetails.unit_price}`);
            unitPrice = 0;
          }
        } else {
          console.warn(`No unit price found for material ID ${item.material_id}`);
        }
        
        // Calculate unit price from actual_cost and quantity if missing
        if (unitPrice === 0 && item.quantity && item.quantity > 0 && item.actual_cost) {
          unitPrice = parseFloat(item.actual_cost) / item.quantity;
        }
        
        return {
          ...item,
          material_name: materialDetails?.name || `Matériel #${item.material_id}`,
          material_category: materialDetails?.category || 'Non catégorisé',
          unit_price: unitPrice
        };
      } catch (error) {
        console.error(`Error fetching material details for order item with material ID ${item.material_id}:`, error);
        // Calculate unit price from actual_cost and quantity as fallback
        let unitPrice = 0;
        if (item.quantity && item.quantity > 0 && item.actual_cost) {
          unitPrice = parseFloat(item.actual_cost) / item.quantity;
        }
        
        return {
          ...item,
          material_name: `Matériel #${item.material_id}`,
          material_category: 'Non catégorisé',
          unit_price: unitPrice
        };
      }
    }));
    
    return {
      ...orderResponse.data,
      supplier_name: supplierResponse.data.supplier_name,
      supplier_email: supplierResponse.data.supplier_email,
      supplier_description: supplierResponse.data.supplier_description,
      requester: requestResponse.data.user_id, // The user who created the purchase request
      order_items: itemsWithDetails,
      total_actual_cost
    };
    
  } catch (error) {
    console.error(`Error fetching order details for order ID ${orderId}:`, error);
    throw new Error(`Failed to fetch order details`);
  }
};