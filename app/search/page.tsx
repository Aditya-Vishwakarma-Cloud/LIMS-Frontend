"use client";

import { ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';

export default function Search() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Order No.
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Order Date From.
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Approved</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Completed</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice No.
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project.
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Planned</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Invoice Generated</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer.
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                  <option value="">Select Customer</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type.
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                  <option value="">Select Test Type</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors">
              SEARCH
            </button>
          </div>
        </div>

        {/* Search Results Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Job No</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Qty</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Customer</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Project</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Customer Type</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Job Date</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Due Date</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Plan Completed</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Plan Date</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Tech Rev. Date</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Result Completion</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-4 py-3">Approved</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm border-r border-gray-200">NBL/25-26/0137</td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-200">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                  <td className="px-4 py-3 text-sm border-r border-gray-200">NEXUS ALLOYS & STEELS PRIVATE LIMITED</td>
                  <td className="px-4 py-3 text-sm border-r border-gray-200"></td>
                  <td className="px-4 py-3 text-sm border-r border-gray-200"></td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-200">16-Sep-25</td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-200">20-Sep-25</td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-200">Y</td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-200">17-Sep-25</td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-200"></td>
                  <td className="px-4 py-3 text-sm text-center border-r border-gray-200">17-Sep-25</td>
                  <td className="px-4 py-3 text-sm text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex flex-wrap items-center justify-end gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto">
              Export
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto">
              Previous
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto">
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
