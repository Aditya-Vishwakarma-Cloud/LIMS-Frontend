"use client";

import { useState } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, Plus, Filter, Download } from 'lucide-react';
import Link from 'next/link';

export default function PlanList() {
  const [activeTab, setActiveTab] = useState<'Test Plans' | 'Sampling Plans'>('Test Plans');

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Plan Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage test plans and field sampling schedules.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <div className="relative group">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Create Plan</span>
              </button>
              {/* Dropdown for creating plans */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block z-10">
                <div className="py-1">
                  <Link href="/plan/test-plan/add" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Test Plan
                  </Link>
                  <Link href="/plan/sampling-plan/add" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sampling Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('Test Plans')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex-1 text-center sm:flex-none sm:text-left ${
                activeTab === 'Test Plans' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Test Plans
            </button>
            <button
              onClick={() => setActiveTab('Sampling Plans')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex-1 text-center sm:flex-none sm:text-left ${
                activeTab === 'Sampling Plans' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sampling Plans
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
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
                {activeTab === 'Test Plans' ? (
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Plan ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Material Type</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Specification</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Plan ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Next Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {activeTab === 'Test Plans' ? (
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">TP-2026-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Standard Concrete M30</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Concrete</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IS 456</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor('Active')}`}>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                      <a href="#" className="text-gray-600 hover:text-gray-900">Edit</a>
                    </td>
                  </tr>
                ) : (
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">SP-2026-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Metro Line 3 Phase A</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pillar 44, Block B</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Daily</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-05-29</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor('Pending')}`}>
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                      <a href="#" className="text-gray-600 hover:text-gray-900">Edit</a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
