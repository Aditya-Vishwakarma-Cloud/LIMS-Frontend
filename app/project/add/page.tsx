"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { projectService } from '@/services/projectService';
import CustomerSelector from '@/app/components/shared/CustomerSelector';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    customerId: '',
    projectName: '',
    projectNumber: '',
    siteName: '',
    engineer: '',
    consultant: '',
    contractor: '',
    location: '',
    expectedCompletion: '',
    status: 'Active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.projectName) {
      setError('Customer and Project Name are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await projectService.createProject(formData);
      router.push('/project/list');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/project/list" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Add Project</h2>
              <p className="text-sm text-gray-500 mt-1">Configure site and engineer specifications for the client.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Customer Selector */}
              <CustomerSelector
                value={formData.customerId}
                onChange={(val) => setFormData({ ...formData, customerId: val })}
                required
              />

              {/* Project Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Internal Project Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. NH48-Bridge-02"
                  value={formData.projectNumber}
                  onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai Metro Line 3"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Site Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Site Name / Phase
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thane Station"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Engineer */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Project Engineer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Rajesh Sharma"
                  value={formData.engineer}
                  onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Consultant */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Project Consultant
                </label>
                <input
                  type="text"
                  placeholder="e.g. L&T Consulting"
                  value={formData.consultant}
                  onChange={(e) => setFormData({ ...formData, consultant: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Contractor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Contractor
                </label>
                <input
                  type="text"
                  placeholder="e.g. XYZ Infrastructures"
                  value={formData.contractor}
                  onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thane, Maharashtra"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Expected Completion */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  value={formData.expectedCompletion}
                  onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            <div className="pt-4 border-t flex justify-end space-x-3">
              <Link
                href="/project/list"
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-sm flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
