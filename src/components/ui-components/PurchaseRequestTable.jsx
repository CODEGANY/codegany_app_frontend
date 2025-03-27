// filepath: /Users/krishna/Dev/codegany/codegany_app_frontend/src/components/ui-components/PurchaseRequestTable.jsx
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * @typedef {'pending'|'approved'|'rejected'|'ordered'|'delivered'|'closed'} RequestStatus
 */

/**
 * @typedef {Object} RequestItem
 * @property {number} material_id - Material ID
 * @property {number} quantity - Quantity requested
 * @property {number} estimated_cost - Estimated cost for this item
 */

/**
 * @typedef {Object} PurchaseRequest
 * @property {number} request_id - Request ID
 * @property {string} created_at - Request creation date
 * @property {RequestStatus} status - Current request status
 * @property {string} justification - Justification for the request
 * @property {RequestItem[]} [request_items] - Items in this request
 * @property {number} total_estimated_cost - Total estimated cost of the request (computed field)
 */

/**
 * Returns the appropriate status badge for the request status
 * @param {RequestStatus} status - The request status
 * @returns {JSX.Element} Status badge component
 */
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En attente',
          className: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'approved':
        return {
          label: 'Approuvée',
          className: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'rejected':
        return {
          label: 'Rejetée',
          className: 'bg-red-50 text-red-700 border-red-200'
        };
      case 'ordered':
        return {
          label: 'Commandée',
          className: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'delivered':
        return {
          label: 'Livrée',
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200'
        };
      case 'closed':
        return {
          label: 'Clôturée',
          className: 'bg-gray-50 text-gray-700 border-gray-200'
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
 * Table component showing purchase requests with their status
 * @param {Object} props Component props
 * @param {Array<PurchaseRequest>} [props.requests] Requests to display
 * @param {boolean} [props.showAll] Whether to show all requests or just the first few
 * @returns {JSX.Element} Table component
 */
const PurchaseRequestTable = ({ requests = [], showAll = false }) => {
  // If not showing all, limit to 5 requests
  const limitedRequests = showAll ? requests : requests.slice(0, 5);
  const hasRequests = limitedRequests.length > 0;

  // Format currency with French locale
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      {hasRequests ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demande
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant estimé
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {limitedRequests.map((request) => (
              <tr key={request.request_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      #{request.request_id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(request.created_at), 'dd MMM yyyy', { locale: fr })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(request.created_at), 'HH:mm', { locale: fr })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {formatCurrency(request.total_estimated_cost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/requests/${request.request_id}`} 
                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                  >
                    Détails <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucune demande disponible</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequestTable;