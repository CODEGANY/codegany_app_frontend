import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';

/**
 * Fetches orders and purchase requests data
 * @returns {Promise<Object>} Orders and requests data
 */
export const fetchOrdersAndRequests = async () => {
  // Use token from localStorage
  const token = localStorage.getItem('token');
  
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
          `${BASE_API_URL}${API_ENDPOINTS.REQUEST_ITEMS.GET_BY_REQUEST(request.request_id)}`,
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
  const token = localStorage.getItem('token');
  
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${BASE_API_URL}${API_ENDPOINTS.MATERIALS.GET_ONE(materialId)}`, {
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
  const token = localStorage.getItem('token');
  
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
  const token = localStorage.getItem('token');
  
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
      `${BASE_API_URL}${API_ENDPOINTS.REQUEST_ITEMS.GET_BY_REQUEST(requestId)}`,
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
  const token = localStorage.getItem('token');
  
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
      `${BASE_API_URL}${API_ENDPOINTS.ORDER_ITEMS.GET_BY_ORDER(orderId)}`,
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