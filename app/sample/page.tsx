"use client";

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, Plus, Filter, Download, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { sampleService, Sample } from '@/services/sampleService';
import StatusBadge from '../components/shared/StatusBadge';
import PriorityBadge from '../components/shared/PriorityBadge';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const sampleStatuses = [
  'All',
  'REGISTERED',
  'RECEIVED',
  'ASSIGNED',
  'TESTING',
  'REVIEW',
  'APPROVED',
  'REPORT_GENERATED',
  'DELIVERED',
  'ARCHIVED',
  'REJECTED'
];

export default function SampleList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isLabManager = roles.includes('ROLE_LAB_MANAGER');
  const isReception = roles.includes('ROLE_RECEPTION');
  const isClient = roles.includes('ROLE_CLIENT_VIEWER');

  const canRegister = isSuperAdmin || isAdmin || isLabManager || isReception;

  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const data = await sampleService.getAllSamples();
      setSamples(data);
    } catch (error) {
      console.error('Failed to fetch samples', error);
    } finally {
      setLoading(false);
    }
  };

  // Clients only view their own project samples
  const visibleSamples = isClient 
    ? samples.filter(s => s.projectName === 'Metro Line 3' || s.projectName === 'Commercial Complex Delta') 
    : samples;

  const filteredSamples = visibleSamples.filter(s => {
    const matchesSearch =
      s.sampleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeTab === 'All' || s.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Sample Management</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage construction material samples through the testing workflow.</p>
          </div>
          {canRegister && (
            <div className="flex space-x-3">
              <Link href="/sample/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Register Sample</span>
              </Link>
            </div>
          )}
        </div>

        {/* Workflow Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
            {sampleStatuses.map(status => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === status 
                    ? 'border-blue-600 text-blue-600 bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search by Sample ID, Project, Material, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Sample ID</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Customer</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Project</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Material Type</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Qty</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Priority</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Collection Date</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-500 py-12">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                      Loading samples...
                    </td>
                  </tr>
                ) : filteredSamples.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-500 py-12">
                      No samples found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-600 border-r border-gray-200">
                        <Link href={`/sample/${sample.id}`} className="hover:underline">
                          {sample.sampleId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">{sample.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 font-semibold">{sample.projectName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 font-semibold">{sample.materialName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">{sample.quantity} {sample.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm border-r border-gray-200">
                        <PriorityBadge priority={sample.priority || 'Normal'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">{sample.collectionDate || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <StatusBadge status={sample.status || 'REGISTERED'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold space-x-2">
                        <button
                          onClick={() => router.push(`/sample/${sample.id}`)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
