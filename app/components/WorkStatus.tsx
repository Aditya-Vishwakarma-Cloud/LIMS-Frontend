import { HelpCircle } from 'lucide-react';

export default function WorkStatus() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Work Status</h3>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-medium text-gray-600 pb-3">User Name</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Inward</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Plan/Draft</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Result</th>
              <th className="text-center text-sm font-medium text-gray-600 pb-3">Invoice</th>
              <th className="text-right text-sm font-medium text-gray-600 pb-3">Dispatch</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* Empty table for now - data would be populated from API */}
            <tr>
              <td colSpan={6} className="text-center text-gray-500 py-8">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
