import { HelpCircle } from 'lucide-react';

export default function AnalyticsTables() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Machining Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Machining Analysis (Top 6)</h3>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 pb-2">Name</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-2">Today</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-2">Yesterday</th>
                <th className="text-right text-sm font-medium text-gray-600 pb-2">Previous 5 Days</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Empty table for now - data would be populated from API */}
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-8">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Delay in Samples */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Dept. Delay in Samples (Last 60 Days)</h3>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 pb-2">Test Type</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-2">1-5</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-2">6-10</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-2">11-20</th>
                <th className="text-right text-sm font-medium text-gray-600 pb-2">21-60</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Empty table for now - data would be populated from API */}
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
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
