"use client";

import { useState } from 'react';
import Layout from '../components/Layout';
import { Search as SearchIcon, FileText, Download, FilePlus, Filter, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function ReportsDashboard() {
  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isLabManager = roles.includes('ROLE_LAB_MANAGER');
  const isQualityEngineer = roles.includes('ROLE_QUALITY_ENGINEER');
  const isClient = roles.includes('ROLE_CLIENT_VIEWER');

  const canGenerate = isSuperAdmin || isAdmin || isLabManager;
  const canRelease = isSuperAdmin || isAdmin || isLabManager;

  const [activeTab, setActiveTab] = useState<'Ready' | 'Generated'>(canGenerate ? 'Ready' : 'Generated');

  const mockReady = [
    { id: 'APP-501', sampleId: 'SMP-2026-0001', project: 'Metro Line 3', material: 'Concrete', testCount: 3, dateApproved: '2026-05-28' },
    { id: 'APP-502', sampleId: 'SMP-2026-0002', project: 'Highway Exp NH-44', material: 'Soil', testCount: 1, dateApproved: '2026-05-28' },
  ];

  const mockGenerated = [
    { reportId: 'RPT-2026-0001', sampleId: 'SMP-2026-0000', project: 'Commercial Complex Delta', dateGenerated: '2026-05-27', status: 'Published' },
  ];

  // Client and Technician only download their own reports
  const readyList = canGenerate ? mockReady : [];
  const generatedList = isClient 
    ? mockGenerated.filter(item => item.project === 'Metro Line 3' || item.project === 'Commercial Complex Delta') 
    : mockGenerated;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Report Management</h2>
            <p className="text-sm text-gray-500 mt-1">Generate PDF reports for finalized tests and manage published documents.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Log</span>
            </button>
          </div>
        </div>

        {/* Tabs & Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            {canGenerate && (
              <button
                onClick={() => setActiveTab('Ready')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex-1 text-center sm:flex-none sm:text-left ${
                  activeTab === 'Ready' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ready for Reporting
                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">{readyList.length}</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('Generated')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex-1 text-center sm:flex-none sm:text-left ${
                activeTab === 'Generated' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Generated Reports
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50">
            <div className="relative w-full sm:max-w-md">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <SearchIcon className="absolute left-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 bg-white rounded-md flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50 text-sm font-medium">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                {activeTab === 'Ready' ? (
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Approval ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sample</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date Approved</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sample</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Generated On</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {activeTab === 'Ready' ? (
                  readyList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{item.sampleId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.material} ({item.testCount} tests)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateApproved}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/reports/generate/${item.sampleId}`} className="inline-flex items-center space-x-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">
                            <FilePlus className="w-4 h-4" />
                            <span>Draft Report</span>
                          </Link>
                          <Link href={`/invoice/create?fromReport=${item.sampleId}`} className="inline-flex items-center space-x-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded transition-colors">
                            <FileText className="w-4 h-4" />
                            <span>Invoice</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  generatedList.map((item) => (
                    <tr key={item.reportId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span>{item.reportId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.sampleId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dateGenerated}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3" />
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">View PDF</button>
                        {canRelease && (
                          <button className="text-gray-600 hover:text-gray-900">Email</button>
                        )}
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
