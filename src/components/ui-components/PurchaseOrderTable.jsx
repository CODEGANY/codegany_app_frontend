import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * @typedef {'prepared'|'shipped'|'delivered'} TrackingStatus
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} order_id - Order ID
 * @property {number} request_id - Associated purchase request ID
 * @property {number} supplier_id - Supplier ID
 * @property {string} order_number - Order reference number
 * @property {string} supplier_name - Name of the supplier
 * @property {TrackingStatus} tracking_status - Current tracking status
 * @property {string} ordered_at - Order creation date
 * @property {string} [delivered_at] - Delivery date (if delivered)
 * @property {number} total_actual_cost - Total order amount
 */

const MOCK_ORDERS = [
  {
    order_id: 1,
    request_id: 101,
    supplier_id: 201,
    order_number: 'CMD-2025-0342',
    supplier_name: 'Fournitures Express',
    tracking_status: 'delivered',
    ordered_at: '2025-03-15T10:30:00',
    delivered_at: '2025-03-20T14:20:00',
    total_actual_cost: 12450.75
  },
  {
    order_id: 2,
    request_id: 102,
    supplier_id: 202,
    order_number: 'CMD-2025-0341',
    supplier_name: 'Bureau Pro',
    tracking_status: 'shipped',
    ordered_at: '2025-03-10T14:20:00',
    delivered_at: null,
    total_actual_cost: 5670.25
  },
  {
    order_id: 3,
    request_id: 103,
    supplier_id: 203,
    order_number: 'CMD-2025-0340',
    supplier_name: 'Équipements Industriels SA',
    tracking_status: 'prepared',
    ordered_at: '2025-03-05T09:15:00',
    delivered_at: null,
    total_actual_cost: 28940.50
  },
  {
    order_id: 4,
    request_id: 104,
    supplier_id: 204,
    order_number: 'CMD-2025-0339',
    supplier_name: 'Matériel Tech',
    tracking_status: 'delivered',
    ordered_at: '2025-02-28T16:45:00',
    delivered_at: '2025-03-04T11:30:00',
    total_actual_cost: 3450.80
  },
  {
    order_id: 5,
    request_id: 105,
    supplier_id: 205,
    order_number: 'CMD-2025-0338',
    supplier_name: 'Outillage Professionnel',
    tracking_status: 'delivered',
    ordered_at: '2025-02-25T11:10:00',
    delivered_at: '2025-03-01T09:45:00',
    total_actual_cost: 9875.30
  }
];

/**
 * Returns the appropriate status badge for the order status
 * @param {TrackingStatus} status - The order tracking status
 * @returns {JSX.Element} Status badge component
 */
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'prepared':
        return {
          label: 'Préparée',
          className: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'shipped':
        return {
          label: 'Expédiée',
          className: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'delivered':
        return {
          label: 'Livrée',
          className: 'bg-green-50 text-green-700 border-green-200'
        };
      default:
        return {
          label: 'Inconnue',
          className: 'bg-gray-50 text-gray-700 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

/**
 * Table component showing purchase orders with their status
 */
const PurchaseOrderTable = () => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commande
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fournisseur
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {MOCK_ORDERS.map((order) => (
            <tr key={order.order_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{order.order_number}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.supplier_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(order.ordered_at), 'dd MMM yyyy', { locale: fr })}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(order.ordered_at), 'HH:mm', { locale: fr })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(order.total_actual_cost)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={order.tracking_status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link 
                  to={`/orders/${order.order_id}`} 
                  className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                >
                  Détails <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderTable;