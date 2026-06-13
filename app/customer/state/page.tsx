"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Plus, ChevronDown } from 'lucide-react';

export default function StateMaster() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">State Master</h2>
        </div>

        {/* Add Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                  <option value="">Select Country</option>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State Name
              </label>
              <input
                type="text"
                placeholder="Enter state name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>SAVE</span>
            </button>
          </div>
        </div>

        {/* Search and List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search states..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md hover:bg-gray-200">
                  <SearchIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-700 px-6 py-3 border-r border-gray-200">State Name</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-6 py-3 border-r border-gray-200">Country</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-6 py-3 border-r border-gray-200">Status</th>
                  <th className="text-center text-sm font-medium text-gray-700 px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-8">
                    No states found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
