import axios from 'axios';
import { BASE_API_URL, API_ENDPOINTS } from '../constants/api';

/**
 * Fetches data for the dashboard overview
 * @returns {Promise<Object>} Dashboard data including request and order statistics
 */
export const fetchDashboardData = async () => {
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
    
    // Process request statistics
    const requests = requestsResponse.data || [];
    const requestStats = {
      total: requests.length,
      pending: requests.filter(req => req.status === 'pending').length,
      approved: requests.filter(req => req.status === 'approved').length,
      rejected: requests.filter(req => req.status === 'rejected').length,
    };
    
    // Get the 5 most recent requests
    const recentRequests = [...requests]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    
    // Process order statistics
    const orders = ordersResponse.data || [];
    const orderStats = {
      total: orders.length,
      inProgress: orders.filter(order => ['prepared', 'shipped'].includes(order.tracking_status)).length,
      delivered: orders.filter(order => order.tracking_status === 'delivered').length,
    };
    
    // Get the 5 most recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.ordered_at) - new Date(a.ordered_at))
      .slice(0, 5);
      
    return {
      requestStats,
      recentRequests,
      orderStats,
      recentOrders,
    };
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data. Please try again later.');
  }
};