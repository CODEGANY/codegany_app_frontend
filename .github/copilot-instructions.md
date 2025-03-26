# GitHub Copilot Instructions for Frontend Purchase Management App

## Project Overview
This React application serves as the frontend for an enterprise equipment purchase management system. The application helps companies track, manage, and optimize their purchasing processes through a web interface that communicates with a backend API.

## Technology Stack
- React with JavaScript
- React Router for navigation
- Tailwind CSS with custom configuration
- shadcn/ui component library
- Tanstack Query (React Query) for data fetching
- Vite as build tool
- Backend communication via RESTful API endpoints

## Code Organization

### Directory Structure
- `/src/components/` - Reusable UI components
- `/src/components/ui/` - Base UI components from shadcn
- `/src/components/ui-components/` - Custom UI components
- `/src/pages/` - Route-based page components
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions and helpers
- `/src/context/` - React context providers
- `/src/constants/` - Application constants including types
- `/src/api/` - API interaction services

### Naming Conventions
- React components: PascalCase (e.g., `OrderItemsTable.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useOrders.js`)
- Utility files: camelCase (e.g., `formatDate.js`)
- PropTypes definitions: PascalCase (e.g., `const PurchaseOrderPropTypes = {}`)
- CSS files: same name as their component (e.g., `Button.css` for `Button.jsx`)

## Best Practices

### React Components
- Use functional components with hooks
- Destructure props for cleaner code
- Keep components small and focused on a single responsibility
- Create reusable components for repeated UI patterns
- Use React.memo() for components that render frequently with the same props

### JavaScript & PropTypes
- Use PropTypes for component props validation
- Add JSDoc comments for type documentation
- Export constants and PropTypes needed by other files
- Use object destructuring for cleaner imports/exports
- Always document function parameters and return values with JSDoc

### CSS and Styling
- Use Tailwind CSS utility classes when possible
- Follow the custom color scheme defined in the theme
- Use CSS variables for theme values
- For complex components, use the cn() utility for conditional classes

### State Management
- Use React Query for server state
- Use React Context for global application state
- Use useState for component-local state
- Use useReducer for complex state logic

### API Calls
- Create custom hooks that use React Query for data fetching
- Handle loading, error, and success states
- Implement proper error handling and display user-friendly messages
- Use AbortController for cancellable requests

### Performance Optimization
- Use proper dependency arrays for useEffect and useMemo
- Implement virtualization for long lists (react-window or similar)
- Optimize re-renders with useMemo, useCallback, and React.memo
- Use code-splitting with React.lazy and Suspense

### Accessibility
- Use semantic HTML elements
- Include ARIA attributes where necessary
- Ensure proper keyboard navigation
- Maintain sufficient color contrast
- Implement proper focus management

## Project-Specific Guidelines

### Data Models and JSDoc Type Definitions

#### Enums
```javascript
/**
 * @typedef {'logistique'|'daf'} UserRole
 * @typedef {'pending'|'approved'|'rejected'|'ordered'|'delivered'|'closed'} RequestStatus
 * @typedef {'approved'|'rejected'|'pending_info'} ApprovalDecision
 * @typedef {'prepared'|'shipped'|'delivered'} TrackingStatus
 */
```

#### Users
```javascript
/**
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
```

#### Suppliers
```javascript
/**
 * @typedef {Object} Supplier
 * @property {number} supplier_id
 * @property {string} supplier_name
 * @property {string} [supplier_description]
 * @property {string} [supplier_email]
 */
```

#### Materials
```javascript
/**
 * @typedef {Object} Material
 * @property {number} material_id
 * @property {string} name
 * @property {string} category
 * @property {number} unit_price
 * @property {number} supplier_id
 * @property {number} stock_available
 */
```

#### PurchaseRequests
```javascript
/**
 * @typedef {Object} PurchaseRequest
 * @property {number} request_id
 * @property {number} user_id
 * @property {string} created_at
 * @property {RequestStatus} status
 * @property {string} justification
 */
```

#### RequestItems
```javascript
/**
 * @typedef {Object} RequestItem
 * @property {number} request_item_id
 * @property {number} request_id
 * @property {number} material_id
 * @property {number} quantity
 * @property {number} estimated_cost
 */
```

#### Approvals
```javascript
/**
 * @typedef {Object} Approval
 * @property {number} approval_id
 * @property {number} request_id
 * @property {number} daf_user_id
 * @property {ApprovalDecision} decision
 * @property {string} [comment]
 * @property {string} [approved_at]
 */
```

#### Orders
```javascript
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
```

#### OrderItems
```javascript
/**
 * @typedef {Object} OrderItem
 * @property {number} order_item_id
 * @property {number} order_id
 * @property {number} material_id
 * @property {number} quantity
 * @property {number} actual_cost
 */
```

### Extended/Combined Models (for UI display)

```javascript
/**
 * @typedef {Object} MaterialWithSupplier
 * @property {number} material_id
 * @property {string} name
 * @property {string} category
 * @property {number} unit_price
 * @property {number} supplier_id
 * @property {number} stock_available
 * @property {string} supplier_name
 */

/**
 * @typedef {Object} RequestItemWithDetails
 * @property {number} request_item_id
 * @property {number} request_id
 * @property {number} material_id
 * @property {number} quantity
 * @property {number} estimated_cost
 * @property {string} material_name
 * @property {string} material_category
 * @property {number} unit_price
 */

/**
 * @typedef {Object} PurchaseRequestWithDetails
 * @property {number} request_id
 * @property {number} user_id
 * @property {string} created_at
 * @property {RequestStatus} status
 * @property {string} justification
 * @property {string} requester_name
 * @property {Array<RequestItemWithDetails>} items
 * @property {number} total_estimated_cost
 * @property {Approval} [approval]
 */

/**
 * @typedef {Object} OrderItemWithMaterial
 * @property {number} order_item_id
 * @property {number} order_id
 * @property {number} material_id
 * @property {number} quantity
 * @property {number} actual_cost
 * @property {string} material_name
 * @property {string} material_category
 */

/**
 * @typedef {Object} OrderWithDetails
 * @property {number} order_id
 * @property {number} request_id
 * @property {number} supplier_id
 * @property {string} order_number
 * @property {TrackingStatus} tracking_status
 * @property {string} ordered_at
 * @property {string} [delivered_at]
 * @property {string} request_justification
 * @property {string} supplier_name
 * @property {Array<OrderItemWithMaterial>} items
 * @property {number} total_actual_cost
 */
```

### API Endpoints

All API endpoints should be prefixed with `/api/v1`.

#### Authentication & User Management
- POST `/api/v1/auth/login` - Authenticate a user and get JWT token
- GET `/api/v1/auth/logout` - Logout a user (invalidate token)
- GET `/api/v1/auth/check-user` - Verify current user from token
- POST `/api/v1/users/register` - Register a new account

#### Users
- GET `/api/v1/users` - Get all users
- GET `/api/v1/users/:id` - Get a specific user
- POST `/api/v1/users` - Create a new user
- PUT `/api/v1/users/:id` - Update a user
- DELETE `/api/v1/users/:id` - Delete a user

#### Suppliers
- GET `/api/v1/suppliers` - Get all suppliers
- GET `/api/v1/suppliers/:id` - Get a specific supplier
- POST `/api/v1/suppliers` - Create a new supplier
- PUT `/api/v1/suppliers/:id` - Update a supplier
- DELETE `/api/v1/suppliers/:id` - Delete a supplier

#### Materials
- GET `/api/v1/materials` - Get all materials
- GET `/api/v1/materials/:id` - Get a specific material
- POST `/api/v1/materials` - Create a new material
- PUT `/api/v1/materials/:id` - Update a material
- DELETE `/api/v1/materials/:id` - Delete a material
- GET `/api/v1/materials/supplier/:supplierId` - Get materials by supplier

#### Purchase Requests
- GET `/api/v1/requests` - Get all purchase requests
- GET `/api/v1/requests/:id` - Get a specific purchase request with items
- POST `/api/v1/requests` - Create a new purchase request
- PUT `/api/v1/requests/:id` - Update a purchase request
- DELETE `/api/v1/requests/:id` - Delete a purchase request
- GET `/api/v1/requests/user/:userId` - Get requests by user
- GET `/api/v1/requests/status/:status` - Get requests by status

#### Request Items
- GET `/api/v1/request-items/request/:requestId` - Get items for a request
- POST `/api/v1/request-items` - Add an item to a request
- PUT `/api/v1/request-items/:id` - Update a request item
- DELETE `/api/v1/request-items/:id` - Remove an item from a request

#### Approvals
- GET `/api/v1/approvals/request/:requestId` - Get approval for a request
- POST `/api/v1/approvals` - Create a new approval
- PUT `/api/v1/approvals/:id` - Update an approval

#### Orders
- GET `/api/v1/orders` - Get all orders
- GET `/api/v1/orders/:id` - Get a specific order with items
- POST `/api/v1/orders` - Create a new order
- PUT `/api/v1/orders/:id` - Update an order
- DELETE `/api/v1/orders/:id` - Delete an order
- GET `/api/v1/orders/supplier/:supplierId` - Get orders by supplier
- GET `/api/v1/orders/status/:status` - Get orders by status

#### Order Items
- GET `/api/v1/order-items/order/:orderId` - Get items for an order
- POST `/api/v1/order-items` - Add an item to an order
- PUT `/api/v1/order-items/:id` - Update an order item
- DELETE `/api/v1/order-items/:id` - Remove an item from an order

### Common UI Patterns
- Use Badge component for status indicators
- Follow the established date format (fr locale)
- Use proper icons from Lucide React library
- Implement consistent loading states with spinners
- Follow the order detail page layout for similar detail pages

### Error Handling
- Display user-friendly error messages
- Implement retry mechanisms for failed requests
- Provide fallback UI for error states
- Log errors to console in development

## Localization
- The application uses French as the primary language
- Use date-fns with fr locale for date formatting
- Format currency using `Intl.NumberFormat('fr-FR')`

## Animation Guidelines
- Use subtle animations for improved UX
- Keep animations short (300-500ms)
- Use CSS transitions for hover states
- Add staggered animations for lists using delay utilities

## Testing Guidelines
- Write unit tests for utility functions
- Write component tests with React Testing Library
- Mock API calls in tests
- Test key user flows

## Code Quality
- Follow ESLint rules
- Use Prettier for consistent formatting
- Add JSDoc comments for complex functions
- Keep functions small and focused

## Workflow Guidelines

### Authentication Flow
- Users must be authenticated to access protected routes
- Implement role-based access control (Logistics Manager vs Finance Director)
- Store JWT token in localStorage or secure cookies
- Use `/api/v1/check-user` to validate user session on application load
- Token refresh mechanism should be implemented for extended sessions

### Purchase Request Flow
1. Logistics Manager creates a request with items
2. Request is submitted for approval to Finance Director
3. Finance Director reviews and approves/rejects/requests more info
4. If approved, order can be created from the request
5. Order is sent to supplier and tracked until delivery

### Order Management Flow
1. Once request is approved, Logistics Manager creates order
2. Order is tracked through prepared → shipped → delivered stages
3. When delivered, related purchase request is marked as closed
4. Material inventory is updated

## Data Fetching Strategy
- Use React Query's prefetching capabilities for frequently accessed data
- Implement infinite scrolling for long lists
- Cache responses to reduce API calls
- Invalidate queries appropriately when mutations occur

## API Response Structure

All API responses should follow a consistent structure:

```javascript
/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {T} [data]
 * @property {Object} [error]
 * @property {string} [error.code]
 * @property {string} [error.message]
 * @property {any} [error.details]
 * @property {Object} [pagination]
 * @property {number} [pagination.page]
 * @property {number} [pagination.limit]
 * @property {number} [pagination.total]
 * @property {number} [pagination.totalPages]
 */
```

## HTTP Error Handling

Map HTTP status codes to appropriate user-friendly messages:
- 400: Bad Request - "Les données fournies sont invalides"
- 401: Unauthorized - "Vous devez vous connecter pour accéder à cette ressource"
- 403: Forbidden - "Vous n'avez pas les permissions nécessaires"
- 404: Not Found - "La ressource demandée n'existe pas"
- 500: Server Error - "Une erreur serveur est survenue, veuillez réessayer"

## API Usage Guidelines

All authenticated endpoints require a JWT token in the request body. The token should be included as follows:

```javascript
{
  "token": "your_jwt_token"
}
```

### Authentication Endpoints

#### User Registration (POST `/api/v1/users/register`)

**Request Format:**
```javascript
{
  "username": "jean_dupont",
  "first_name": "Jean",
  "last_name": "Dupont",
  "cin": "FR123456789",
  "phone": "+33612345678",
  "role": "logistique",  // Must be 'logistique' or 'daf'
  "email": "jean.dupont@example.com"
}
```

**Response Format:**
```javascript
{
  "exists": true,
  "user_data": {
    "user_id": 1,
    "username": "jean_dupont",
    "first_name": "Jean",
    "last_name": "Dupont",
    "cin": "FR123456789",
    "phone": "+33612345678",
    "role": "logistique",
    "email": "jean.dupont@example.com"
  }
}
```

**Common Errors:**
- 400: Invalid role or missing fields
- 409: Email or username already exists

#### Verify User (POST `/api/v1/auth/check-user`)

**Request Format:**
```javascript
{
  "token": "your_jwt_token"
}
```

**Response Format:**
```javascript
{
  "exists": true,
  "user_data": {
    "user_id": 1,
    "username": "jean_dupont",
    "first_name": "Jean",
    "last_name": "Dupont",
    "cin": "FR123456789",
    "phone": "+33612345678",
    "role": "logistique",
    "email": "jean.dupont@example.com"
  }
}
```

**Common Errors:**
- 401: Invalid token
- 500: Database error

### Suppliers Endpoints

#### Get All Suppliers (GET `/api/v1/suppliers`)

**Request Format:**
```javascript
{
  "token": "your_jwt_token"
}
```

**Response Format:**
```javascript
[
  {
    "supplier_id": 1,
    "supplier_name": "Fournisseur A",
    "supplier_description": "Description du fournisseur A",
    "supplier_email": "contact@fournisseura.com"
  },
  // More suppliers...
]
```

**Common Errors:**
- 401: Authentication failed
- 500: Database error

### Materials Endpoints

#### Get Materials with Pagination (GET `/api/v1/materials`)

**Request Format:**
```javascript
{
  "token": "your_jwt_token"
}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10)

**Response Format:**
```javascript
{
  "data": [
    {
      "material_id": 1,
      "name": "Écran Dell 24\"",
      "category": "Informatique",
      "unit_price": 199.99,
      "supplier_id": 1,
      "stock_available": 50
    },
    // More materials...
  ],
  "total_count": 100,
  "page": 1,
  "page_size": 10,
  "total_pages": 10
}
```

**Common Errors:**
- 400: Invalid pagination parameters
- 401: Authentication failed
- 500: Database error

#### Update Material (PUT `/api/v1/materials/{material_id}`)

**Request Format:**
```javascript
{
  "token": "your_jwt_token",
  "name": "Écran Dell 27\"",  // Optional
  "category": "Informatique", // Optional
  "unit_price": 249.99,       // Optional
  "supplier_id": 1,           // Optional
  "stock_available": 45       // Optional
}
```

**Response Format:**
```javascript
{
  "material_id": 1,
  "name": "Écran Dell 27\"",
  "category": "Informatique",
  "unit_price": 249.99,
  "supplier_id": 1,
  "stock_available": 45
}
```

**Common Errors:**
- 400: No update data provided
- 401: Authentication failed
- 403: User doesn't have 'logistique' role
- 404: Material not found
- 500: Database error

#### Delete Material (DELETE `/api/v1/materials/{material_id}`)

**Request Format:**
```javascript
{
  "token": "your_jwt_token"
}
```

**Response Format:**
```javascript
{
  "message": "Material with ID 1 successfully deleted"
}
```

**Common Errors:**
- 401: Authentication failed
- 403: User doesn't have 'logistique' role
- 404: Material not found
- 409: Material is referenced in requests or orders
- 500: Database error

### Usage Example in Frontend

Here's an example of how to call the API from the frontend using React Query:

```javascript
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Get all suppliers
const useSuppliers = () => {
  const token = localStorage.getItem('jwt_token');
  
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/suppliers', {
        data: { token }
      });
      return response.data;
    },
    onError: (error) => {
      console.error('Failed to fetch suppliers:', error);
      // Handle error state
    }
  });
};

// Update a material
const useUpdateMaterial = () => {
  const token = localStorage.getItem('jwt_token');
  
  return useMutation({
    mutationFn: async ({ materialId, updateData }) => {
      const payload = { token, ...updateData };
      const response = await axios.put(`/api/v1/materials/${materialId}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      // Handle success state
      console.log('Material updated successfully:', data);
    },
    onError: (error) => {
      // Handle error state
      console.error('Failed to update material:', error);
    }
  });
};
```

## Implementation Tips:

1. **Token Handling**: Always include the JWT token in the request body for authenticated endpoints
2. **Error Handling**: Use try/catch blocks and handle specific HTTP status codes
3. **Request Validation**: Validate data before sending to the API
4. **Response Processing**: Check for proper response format before using the data
5. **Authentication Flow**: Verify user authentication status on application load

## Security Considerations:

1. Never log or expose the JWT token in client-side code
2. Use HTTPS for all API communications
3. Implement proper token expiration and refresh mechanisms
4. Validate all user input before sending to the API
5. Handle unauthorized responses by redirecting to the login page
