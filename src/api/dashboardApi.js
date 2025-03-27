import axios from 'axios';
import { BASE_API_URL } from '../constants/api';

/**
 * Mock data for dashboard when API is not available
 * @type {Object}
 */
const MOCK_DASHBOARD_DATA = {
  requestStats: {
    total: 42,
    approved: 28,
    rejected: 5,
    pending: 9
  },
  recentRequests: [
    {
      request_id: 123,
      requester_name: "Jean Dupont",
      created_at: "2025-03-20T10:30:00Z",
      status: "approved",
      total_estimated_cost: 2850.75
    },
    {
      request_id: 122,
      requester_name: "Marie Lambert",
      created_at: "2025-03-19T14:15:00Z",
      status: "pending",
      total_estimated_cost: 1435.20
    },
    {
      request_id: 121,
      requester_name: "Pierre Durand",
      created_at: "2025-03-18T09:45:00Z",
      status: "rejected",
      total_estimated_cost: 785.50
    },
    {
      request_id: 120,
      requester_name: "Sophie Martin",
      created_at: "2025-03-17T16:20:00Z",
      status: "approved",
      total_estimated_cost: 3250.00
    },
    {
      request_id: 119,
      requester_name: "Thomas Bernard",
      created_at: "2025-03-16T11:10:00Z",
      status: "ordered",
      total_estimated_cost: 1920.30
    }
  ],
  orderStats: {
    total: 35,
    inProgress: 12,
    delivered: 23
  },
  recentOrders: [
    {
      order_id: 85,
      order_number: "ORD-2025-0042",
      supplier_name: "Tech Solutions SA",
      ordered_at: "2025-03-21T08:45:00Z",
      tracking_status: "shipped",
      total_actual_cost: 2835.50
    },
    {
      order_id: 84,
      order_number: "ORD-2025-0041",
      supplier_name: "Bureau Express",
      ordered_at: "2025-03-20T14:30:00Z",
      tracking_status: "prepared",
      total_actual_cost: 975.25
    },
    {
      order_id: 83,
      order_number: "ORD-2025-0040",
      supplier_name: "Équipements Pro",
      ordered_at: "2025-03-19T10:15:00Z",
      tracking_status: "delivered",
      total_actual_cost: 3450.00
    },
    {
      order_id: 82,
      order_number: "ORD-2025-0039",
      supplier_name: "Tech Solutions SA",
      ordered_at: "2025-03-18T16:20:00Z",
      tracking_status: "delivered",
      total_actual_cost: 1280.75
    },
    {
      order_id: 81,
      order_number: "ORD-2025-0038",
      supplier_name: "Informatique Plus",
      ordered_at: "2025-03-17T09:30:00Z",
      tracking_status: "delivered",
      total_actual_cost: 2150.90
    }
  ]
};

/**
 * Fetches data for the dashboard overview
 * @returns {Promise<Object>} Dashboard data including request and order statistics
 */
export const fetchDashboardData = async () => {
  // const token = localStorage.getItem('token');
  const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlMTkzZDQ2NDdhYjRhMzU4NWFhOWIyYjNiNDg0YTg3YWE2OGJiNDIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjEyMjAyNDE0MDctOWswMmMzMzVmNmRqdHY1cXJodjJlaDJ1ZW9pNjd1YTQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI2MjE4NTg4MjQ0ODgxMDU3MjYiLCJlbWFpbCI6InJha290b21hbmRpbWJ5LmxvaWNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MjkwMjg5MSwibmFtZSI6Ikxvw69jIFJBS09UT01BTkRJTUJZIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pIRElKdGE4X0VlV0Q1MHpvbUZKTU9tUm1SZHRfMTF6Vi1iek1DbTlCSE43bVZFemh1PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikxvw69jIiwiZmFtaWx5X25hbWUiOiJSQUtPVE9NQU5ESU1CWSIsImlhdCI6MTc0MjkwMzE5MSwiZXhwIjoxNzQyOTA2NzkxLCJqdGkiOiI4MzA2YmE3ZjI1NmY2NjAxYTJjNzRhOTkyNDk1MDM4MjdhNDE3MDFjIn0.pCh6MkdwXUdwUzdlPbQZ0arOyusYHwC7gYTGe8wnlUr4JX4yfjG_e1XtMKS2aHYNa9GwltKTgj8wDZCJNld_o2hCD2FOuZKFmsgJQIxMFUxwD3nJ8Z2xJkq_5fDyEbj3tFJ4JNRD5uwtCm5ZcmC3CGQ3r78RZqLO131fKXIXKGAhDcLqJcQV3Wpj49m2Cf9H3wdZ6pmf-_986M44v-e_zFkdq4XTcTqq5DeyJ-VrtI9JIKwuz31V0ujQcfMh1CK61kfVBfzoBskX4ltGxFKYVfumqA1nvMYjYO1EHXmc9Tr5-SQNtaCZo9R5WDNbQqEx9LJB1nGqGKeL7qlza8xIug";
  
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log("testetstse")
    
    // Fetch purchase requests (all statuses)
    const requestsResponse = await axios.get(`${BASE_API_URL}/api/v1/purchase-requests`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Fetch orders
    const ordersResponse = await axios.get(`${BASE_API_URL}/api/v1/orders`, {
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
    // Return mock data as fallback
    return MOCK_DASHBOARD_DATA;
  }
};