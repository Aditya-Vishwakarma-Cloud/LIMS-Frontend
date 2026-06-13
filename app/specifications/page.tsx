"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Plus, Filter, FileText, CheckCircle, AlertTriangle, Edit, Eye } from 'lucide-react';
import { useState } from 'react';

export default function SpecificationsDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);

  const mockSpecs = [
    { id: 'SPEC-001', code: 'IS 456:2000', name: 'Plain and Reinforced Concrete', material: 'Concrete', status: 'Active', lastUpdated: '2025-10-12' },
    { id: 'SPEC-002', code: 'ASTM C39', name: 'Compressive Strength of Cylindrical Concrete Specimens', material: 'Concrete', status: 'Active', lastUpdated: '2026-01-05' },
    { id: 'SPEC-003', code: 'IS 2720-4', name: 'Grain Size Analysis of Soils', material: 'Soil', status: 'Under Review', lastUpdated: '2026-05-20' },
    { id: 'SPEC-004', code: 'IS 1786', name: 'High Strength Deformed Steel Bars', material: 'Steel', status: 'Active', lastUpdated: '2024-11-30' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /><span>Active</span></span>;
      case 'Under Review': return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3" /><span>Under Review</span></span>;
      default: return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><span>Draft</span></span>;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Test Specifications Master</h2>
            <p className="text-sm text-gray-500 mt-1">Manage standard testing codes (IS, ASTM) and parameter limits.</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Specification</span>
            </button>
          </div>
        </div>

        {/* Specifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50">
            <div className="relative w-full sm:max-w-md">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search Code or Name..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <SearchIcon className="absolute left-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-600 bg-white">
                <option value="">All Materials</option>
                <option value="Concrete">Concrete</option>
                <option value="Soil">Soil</option>
                <option value="Steel">Steel</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 bg-white rounded-md flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50 text-sm font-medium">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced Filter</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Spec Code</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name / Title</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockSpecs.map((spec) => (
                  <tr key={spec.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{spec.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium truncate max-w-[300px]">{spec.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.material}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(spec.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-blue-600 mr-3 transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit Specification">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Basic Add Specification Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Add New Specification</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Standard Code</label>
                  <input type="text" placeholder="e.g. IS 456" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                    <option>Concrete</option>
                    <option>Soil</option>
                    <option>Aggregate</option>
                    <option>Steel</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Title</label>
                  <input type="text" placeholder="e.g. Plain and Reinforced Concrete - Code of Practice" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                  <textarea rows={3} placeholder="Any specific notes about this standard..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm transition-colors"
              >
                Save Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
