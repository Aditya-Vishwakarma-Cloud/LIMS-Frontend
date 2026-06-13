"use client";

import { useState } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, Plus, Filter, Download } from 'lucide-react';
import Link from 'next/link';

const sampleStatuses = [
  'All',
  'Collected',
  'Received',
  'Testing',
  'Review',
  'Approved',
  'Rejected',
  'Completed'
];

export default function SampleList() {
  const [activeTab, setActiveTab] = useState('All');

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Collected': return 'bg-blue-100 text-blue-800';
      case 'Received': return 'bg-indigo-100 text-indigo-800';
      case 'Testing': return 'bg-yellow-100 text-yellow-800';
      case 'Review': return 'bg-purple-100 text-purple-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 font-semibold';
      case 'High': return 'text-orange-600 font-semibold';
      case 'Medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Sample Management</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage construction material samples through the testing workflow.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <Link href="/sample/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Register Sample</span>
            </Link>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {sampleStatuses.map(status => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === status 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search by Sample ID, Project, or Material..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <SearchIcon className="absolute left-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Advanced Filter</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sample ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Material Type</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/* Mock Data Row */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">SMP-2026-0001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Metro Line 3 Phase A</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Concrete</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getPriorityColor('Urgent')}>Urgent</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-05-28</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor('Testing')}`}>
                      Testing
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Edit</a>
                  </td>
                </tr>
                {/* Empty state when no data matches active tab */}
                {activeTab !== 'All' && activeTab !== 'Testing' && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No samples found with status: {activeTab}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer (Mock) */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6 rounded-b-lg">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                  <span className="font-medium">97</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
