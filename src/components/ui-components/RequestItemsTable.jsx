// filepath: /Users/krishna/Dev/codegany/codegany_app_frontend/src/components/ui-components/RequestItemsTable.jsx
import React from 'react';

/**
 * @typedef {Object} RequestItem
 * @property {number} request_item_id - Request item ID
 * @property {number} request_id - Request ID
 * @property {number} material_id - Material ID
 * @property {string} material_name - Material name
 * @property {string} material_category - Material category
 * @property {number} quantity - Quantity requested
 * @property {number} estimated_cost - Estimated cost
 * @property {number} unit_price - Unit price
 */

/**
 * Format currency in French locale
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Table component showing items in a purchase request
 * @param {Object} props Component props
 * @param {Array<RequestItem>} props.items - Request items to display
 * @param {number} props.totalAmount - Total amount of the request
 * @returns {JSX.Element} Table component
 */
const RequestItemsTable = ({ items = [], totalAmount = 0 }) => {
  const hasItems = items.length > 0;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Articles demandés</h2>
      
      <div className="overflow-x-auto rounded-lg border">
        {hasItems ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix unitaire
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût estimé
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.request_item_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.material_name || `Matériel #${item.material_id}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.material_category || 'Non catégorisé'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{formatCurrency(item.unit_price || 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(item.estimated_cost)}</div>
                  </td>
                </tr>
              ))}
              
              {/* Total row */}
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">Total</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun article dans cette demande</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestItemsTable;