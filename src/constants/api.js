/**
 * Base URL for all API requests
 * This can be easily switched between environments (dev, staging, prod)
 */
export const BASE_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://d67f-66-9-179-193.ngrok-free.app';

/**
 * API endpoints
 * Centralized location for all API paths
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    CHECK_USER: '/api/v1/auth/check-user',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
  },
  
  // Users
  USERS: {
    REGISTER: '/api/v1/users/register',
    GET_ALL: '/api/v1/users',
    GET_ONE: (id) => `/api/v1/users/${id}`,
    UPDATE: (id) => `/api/v1/users/${id}`,
    DELETE: (id) => `/api/v1/users/${id}`,
  },
  
  // Purchase Requests
  PURCHASE_REQUESTS: {
    GET_ALL: '/api/v1/purchase-requests',
    GET_ONE: (id) => `/api/v1/purchase-requests/${id}`,
    CREATE: '/api/v1/purchase-requests',
    UPDATE: (id) => `/api/v1/purchase-requests/${id}`,
    DELETE: (id) => `/api/v1/purchase-requests/${id}`,
  },
  
  // Orders
  ORDERS: {
    GET_ALL: '/api/v1/orders',
    GET_ONE: (id) => `/api/v1/orders/${id}`,
    CREATE: '/api/v1/orders',
    UPDATE_TRACKING: (id) => `/api/v1/orders/${id}/tracking`,
    DELETE: (id) => `/api/v1/orders/${id}`,
    GET_BY_SUPPLIER: (supplierId) => `/api/v1/orders/supplier/${supplierId}`,
    GET_BY_STATUS: (status) => `/api/v1/orders/status/${status}`,
  },
  
  // Suppliers
  SUPPLIERS: {
    GET_ALL: '/api/v1/suppliers',
    GET_ONE: (id) => `/api/v1/suppliers/${id}`,
    CREATE: '/api/v1/suppliers',
    UPDATE: (id) => `/api/v1/suppliers/${id}`,
    DELETE: (id) => `/api/v1/suppliers/${id}`,
  },
  
  // Materials
  MATERIALS: {
    GET_ALL: '/api/v1/materials',
    GET_ONE: (id) => `/api/v1/materials/${id}`,
    CREATE: '/api/v1/materials',
    UPDATE: (id) => `/api/v1/materials/${id}`,
    DELETE: (id) => `/api/v1/materials/${id}`
  },
};
