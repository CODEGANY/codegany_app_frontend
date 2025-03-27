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

## API Endpoints

### Authentication
- `POST /api/v1/auth/check-user`: Checks if the user exists in the database. Requires a valid JWT token.

### Suppliers
- `GET /api/v1/suppliers`: Retrieves a list of all suppliers. Requires a valid JWT token.
- `POST /api/v1/suppliers`: Creates a new supplier. Requires a valid JWT token and 'logistique' role.

### Materials
- `GET /api/v1/materials`: Retrieves a paginated list of materials. Requires a valid JWT token.
- `POST /api/v1/materials`: Creates a new material. Requires a valid JWT token and 'logistique' role.
- `PUT /api/v1/materials/{material_id}`: Updates a material by ID. Requires a valid JWT token and 'logistique' role.
- `DELETE /api/v1/materials/{material_id}`: Deletes a material by ID. Requires a valid JWT token and 'logistique' role.

### Users
- `POST /api/v1/users/register`: Registers a new user.

### Purchase Requests
- `POST /api/v1/purchase-requests`: Creates a new purchase request. Requires a valid JWT token and 'logistique' role.
- `GET /api/v1/purchase-requests/{request_id}`: Retrieves a purchase request by ID. Requires a valid JWT token.
- `GET /api/v1/purchase-requests`: Lists purchase requests, optionally filtered by status. Requires a valid JWT token.
- `PUT /api/v1/purchase-requests/{request_id}`: Updates a purchase request by ID. Requires a valid JWT token.

### Approvals
- `POST /api/v1/approvals`: Creates a new approval for a purchase request. Requires a valid JWT token and 'daf' role.
- `GET /api/v1/approvals/{approval_id}`: Retrieves an approval by ID. Requires a valid JWT token.
- `GET /api/v1/purchase-requests/{request_id}/approval`: Retrieves the approval for a specific purchase request. Requires a valid JWT token.

### Orders
- `POST /api/v1/orders`: Creates a new order. Requires a valid JWT token and 'logistique' role.
- `GET /api/v1/orders/{order_id}`: Retrieves an order by ID. Requires a valid JWT token.
- `GET /api/v1/orders`: Lists orders, optionally filtered by tracking status or supplier. Requires a valid JWT token.
- `PUT /api/v1/orders/{order_id}`: Updates an order by ID. Requires a valid JWT token and 'logistique' role.
- `GET /api/v1/orders/by-request/{request_id}`: Retrieves the order associated with a specific purchase request. Requires a valid JWT token.

## Database Schema

### Custom Types
- `user_role`: ENUM('logistique', 'daf')
- `request_status`: ENUM('pending', 'approved', 'rejected', 'ordered', 'delivered', 'closed')
- `approval_decision`: ENUM('approved', 'rejected', 'pending_info')
- `tracking_status`: ENUM('prepared', 'shipped', 'delivered')

### Users
Represents the actors: Logistics Manager, Finance Director, and Supplier.
- `user_id`: SERIAL [Primary Key]
- `username`: VARCHAR(50) [NOT NULL]
- `first_name`: VARCHAR(50)
- `last_name`: VARCHAR(50)
- `cin`: VARCHAR(12)
- `phone`: VARCHAR(10)
- `role`: user_role [NOT NULL]
- `email`: VARCHAR(100) [NOT NULL]

### Suppliers
Represents the suppliers providing materials.
- `supplier_id`: SERIAL [Primary Key]
- `supplier_name`: VARCHAR(100) [NOT NULL]
- `supplier_description`: VARCHAR(255)
- `supplier_email`: VARCHAR(100)

### Materials
Lists the available materials or those referenced for purchases (e.g., internal catalog).
- `material_id`: SERIAL [Primary Key]
- `name`: VARCHAR(100) [NOT NULL]
- `category`: VARCHAR(50) [NOT NULL]
- `unit_price`: DECIMAL(10,2) [NOT NULL]
- `supplier_id`: INT [Foreign Key -> Suppliers.supplier_id, NOT NULL]
- `stock_available`: INT [NOT NULL]

### PurchaseRequests
Represents the requests submitted by the Logistics Manager.
- `request_id`: SERIAL [Primary Key]
- `user_id`: INT [Foreign Key -> Users.user_id, NOT NULL]
- `created_at`: TIMESTAMP WITH TIME ZONE [NOT NULL]
- `status`: request_status [NOT NULL]
- `justification`: TEXT [NOT NULL]

### RequestItems
Links purchase requests with requested materials (allows multiple items per request).
- `request_item_id`: SERIAL [Primary Key]
- `request_id`: INT [Foreign Key -> PurchaseRequests.request_id, NOT NULL]
- `material_id`: INT [Foreign Key -> Materials.material_id, NOT NULL]
- `quantity`: INT [NOT NULL]
- `estimated_cost`: DECIMAL(10,2) [NOT NULL]

### Approvals
Records the decisions of the Financial Director (DAF).
- `approval_id`: SERIAL [Primary Key]
- `request_id`: INT [Foreign Key -> PurchaseRequests.request_id, NOT NULL]
- `daf_user_id`: INT [Foreign Key -> Users.user_id, NOT NULL]
- `decision`: approval_decision [NOT NULL]
- `comment`: TEXT
- `approved_at`: TIMESTAMP WITH TIME ZONE

### Orders
Represents orders placed with suppliers.
- `order_id`: SERIAL [Primary Key]
- `request_id`: INT [Foreign Key -> PurchaseRequests.request_id, NOT NULL]
- `supplier_id`: INT [Foreign Key -> Suppliers.supplier_id, NOT NULL]
- `order_number`: VARCHAR(50) [NOT NULL]
- `tracking_status`: tracking_status [NOT NULL]
- `ordered_at`: TIMESTAMP WITH TIME ZONE [NOT NULL]
- `delivered_at`: TIMESTAMP WITH TIME ZONE

### OrderItems
Details the materials ordered in each order.
- `order_item_id`: SERIAL [Primary Key]
- `order_id`: INT [Foreign Key -> Orders.order_id, NOT NULL]
- `material_id`: INT [Foreign Key -> Materials.material_id, NOT NULL]
- `quantity`: INT [NOT NULL]
- `actual_cost`: DECIMAL(10,2) [NOT NULL]
