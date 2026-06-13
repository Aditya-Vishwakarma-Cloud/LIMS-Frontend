import { HelpCircle } from 'lucide-react';

export default function CustomerTables() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Customers by Value */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Top Customers by Value</h3>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 pb-2">Name</th>
                <th className="text-right text-sm font-medium text-gray-600 pb-2">Invoice</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Empty table for now - data would be populated from API */}
              <tr>
                <td colSpan={2} className="text-center text-gray-500 py-8">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Customers by Quantity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Top Customers by quantity</h3>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 pb-2">Name</th>
                <th className="text-right text-sm font-medium text-gray-600 pb-2">Invoice</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Empty table for now - data would be populated from API */}
              <tr>
                <td colSpan={2} className="text-center text-gray-500 py-8">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
