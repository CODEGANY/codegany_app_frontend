/**
 * @typedef {'logistique'|'daf'} UserRole
 * @typedef {'pending'|'approved'|'rejected'|'ordered'|'delivered'|'closed'} RequestStatus
 * @typedef {'approved'|'rejected'|'pending_info'} ApprovalDecision
 * @typedef {'prepared'|'shipped'|'delivered'} TrackingStatus
 * 
 * @typedef {Object} User
 * @property {number} user_id
 * @property {string} username
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [cin]
 * @property {string} [phone]
 * @property {UserRole} role
 * @property {string} email
 */

/**
 * @typedef {Object} PurchaseRequest
 * @property {number} request_id
 * @property {number} user_id
 * @property {string} created_at
 * @property {RequestStatus} status
 * @property {string} justification
 */

/**
 * @typedef {Object} Order
 * @property {number} order_id
 * @property {number} request_id
 * @property {number} supplier_id
 * @property {string} order_number
 * @property {TrackingStatus} tracking_status
 * @property {string} ordered_at
 * @property {string} [delivered_at]
 */

/**
 * Dashboard data containing summary statistics and recent items
 * @typedef {Object} DashboardData
 * @property {Object} requestStats
 * @property {number} requestStats.total
 * @property {number} requestStats.approved
 * @property {number} requestStats.rejected
 * @property {number} requestStats.pending
 * @property {Array<Object>} recentRequests
 * @property {Object} orderStats
 * @property {number} orderStats.total
 * @property {number} orderStats.inProgress
 * @property {number} orderStats.delivered
 * @property {Array<Object>} recentOrders
 */

export {};  // This export is empty because we're only using JSDoc types