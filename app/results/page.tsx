"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Filter, ClipboardList, Clock, AlertTriangle, CheckCircle2, Play, Eye, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sampleTestService, SampleTest } from '@/services/sampleTestService';
import { testResultService, TechnicianMetrics } from '@/services/testResultService';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import StatusBadge from '../components/shared/StatusBadge';
import PriorityBadge from '../components/shared/PriorityBadge';

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tests, setTests] = useState<SampleTest[]>([]);
  const [metrics, setMetrics] = useState<TechnicianMetrics>({
    assigned: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ASSIGNED' | 'IN_PROGRESS' | 'OVERDUE' | 'COMPLETED'>('ASSIGNED');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchTechnicianWorkload();
    }
  }, [user]);

  const fetchTechnicianWorkload = async () => {
    try {
      setLoading(true);
      const data = await sampleTestService.getTechnicianWorkload(user!.id!);
      setTests(data);

      const metricCounts = await testResultService.getTechnicianMetrics(user!.id!);
      setMetrics(metricCounts);
    } catch (err) {
      console.error('Failed to load technician workload', err);
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (test: SampleTest) => {
    if (test.status === 'COMPLETED' || test.status === 'VERIFIED') return false;
    if (!test.dueDate) return false;
    return new Date(test.dueDate) < new Date();
  };

  const filteredTests = tests.filter(t => {
    // Tab filter
    if (activeTab === 'ASSIGNED' && t.status !== 'ASSIGNED') return false;
    if (activeTab === 'IN_PROGRESS' && t.status !== 'IN_PROGRESS' && t.status !== 'ON_HOLD') return false;
    if (activeTab === 'COMPLETED' && t.status !== 'COMPLETED' && t.status !== 'VERIFIED') return false;
    if (activeTab === 'OVERDUE' && !isOverdue(t)) return false;

    // Search filter
    const matchesSearch = 
      t.sampleCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.remarks?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Technician Workbench</h2>
          <p className="text-sm text-gray-500 mt-1">Manage assigned laboratory tests, enter raw observations, and submit testing logs.</p>
        </div>

        {/* Workload Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => setActiveTab('ASSIGNED')}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
              activeTab === 'ASSIGNED' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md transform -translate-y-0.5' 
                : 'bg-white border-gray-200 text-gray-800 hover:border-blue-400 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <ClipboardList className={`w-8 h-8 ${activeTab === 'ASSIGNED' ? 'text-blue-100' : 'text-blue-500'}`} />
              <span className="text-3xl font-extrabold">{metrics.assigned}</span>
            </div>
            <h4 className="mt-4 font-semibold text-sm">Assigned Today</h4>
            <p className={`text-xs mt-1 ${activeTab === 'ASSIGNED' ? 'text-blue-100' : 'text-gray-400'}`}>Pending execution</p>
          </div>

          <div 
            onClick={() => setActiveTab('IN_PROGRESS')}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
              activeTab === 'IN_PROGRESS' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md transform -translate-y-0.5' 
                : 'bg-white border-gray-200 text-gray-800 hover:border-indigo-400 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <Clock className={`w-8 h-8 ${activeTab === 'IN_PROGRESS' ? 'text-indigo-100' : 'text-indigo-500'}`} />
              <span className="text-3xl font-extrabold">{metrics.inProgress}</span>
            </div>
            <h4 className="mt-4 font-semibold text-sm">In Progress (Draft)</h4>
            <p className={`text-xs mt-1 ${activeTab === 'IN_PROGRESS' ? 'text-indigo-100' : 'text-gray-400'}`}>Saved drafts saved</p>
          </div>

          <div 
            onClick={() => setActiveTab('OVERDUE')}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
              activeTab === 'OVERDUE' 
                ? 'bg-rose-600 border-rose-600 text-white shadow-md transform -translate-y-0.5' 
                : 'bg-white border-gray-200 text-gray-800 hover:border-rose-400 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <AlertTriangle className={`w-8 h-8 ${activeTab === 'OVERDUE' ? 'text-rose-100' : 'text-rose-500'}`} />
              <span className="text-3xl font-extrabold">{metrics.overdue}</span>
            </div>
            <h4 className="mt-4 font-semibold text-sm">Overdue Tests</h4>
            <p className={`text-xs mt-1 ${activeTab === 'OVERDUE' ? 'text-rose-100' : 'text-gray-400'}`}>Past completion date</p>
          </div>

          <div 
            onClick={() => setActiveTab('COMPLETED')}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-300 ${
              activeTab === 'COMPLETED' 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md transform -translate-y-0.5' 
                : 'bg-white border-gray-200 text-gray-800 hover:border-emerald-400 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <CheckCircle2 className={`w-8 h-8 ${activeTab === 'COMPLETED' ? 'text-emerald-100' : 'text-emerald-500'}`} />
              <span className="text-3xl font-extrabold">{metrics.completed}</span>
            </div>
            <h4 className="mt-4 font-semibold text-sm">Completed Tests</h4>
            <p className={`text-xs mt-1 ${activeTab === 'COMPLETED' ? 'text-emerald-100' : 'text-gray-400'}`}>Submitted / Verified</p>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex space-x-2">
            {(['ASSIGNED', 'IN_PROGRESS', 'OVERDUE', 'COMPLETED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-md uppercase transition-colors ${
                  activeTab === tab 
                    ? 'bg-gray-100 text-gray-900 border border-gray-300' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by Sample Code or Test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-xs"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

        </div>

        {/* Workload Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
              Loading workbench tests...
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm italic">
              No tests found matching the selected state filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                    <th className="px-6 py-4">Sample Code</th>
                    <th className="px-6 py-4">Test Specification</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Target Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">{test.sampleCode}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{test.testName}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Method: {test.method || 'Standard'} | Unit: {test.unit || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={test.remarks?.includes('Urgent') ? 'Urgent' : 'Normal'} />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">{test.dueDate || 'No Target Date'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={test.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {test.status === 'COMPLETED' || test.status === 'VERIFIED' ? (
                          <button
                            onClick={() => router.push(`/results/enter/${test.id}`)}
                            className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-semibold flex items-center space-x-1.5 ml-auto transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Result</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => router.push(`/results/enter/${test.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-semibold flex items-center space-x-1.5 ml-auto transition-colors shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Enter Result</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
