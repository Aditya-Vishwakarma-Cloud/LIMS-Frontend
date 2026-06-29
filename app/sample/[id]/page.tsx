"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Loader2, Calendar, MapPin, User, FileText, CheckCircle, Clock, AlertCircle, Beaker, Play } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { sampleService, Sample, SampleHistory } from '@/services/sampleService';
import { usersService, UserResponse } from '@/services/users.service';
import StatusBadge from '@/app/components/shared/StatusBadge';
import PriorityBadge from '@/app/components/shared/PriorityBadge';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

interface SampleDetailsProps {
  params: Promise<{ id: string }>;
}

export default function SampleDetails({ params }: SampleDetailsProps) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isLabManager = roles.includes('ROLE_LAB_MANAGER');
  const isReception = roles.includes('ROLE_RECEPTION');
  const isClient = roles.includes('ROLE_CLIENT_VIEWER');

  const canReceiveOrEdit = isSuperAdmin || isAdmin || isLabManager || isReception;
  
  const [sample, setSample] = useState<Sample | null>(null);
  const [history, setHistory] = useState<SampleHistory[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    receivedDate: new Date().toISOString().split('T')[0],
    receivedTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    receivedById: '',
    condition: 'GOOD',
    remarks: ''
  });

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    remarks: ''
  });

  useEffect(() => {
    fetchSampleDetails();
    loadUsers();
  }, [id]);

  const fetchSampleDetails = async () => {
    try {
      setLoading(true);
      const sampleData = await sampleService.getSampleById(id);
      setSample(sampleData);

      const historyData = await sampleService.getSampleHistory(id);
      setHistory(historyData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReceiveSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sample) return;

    try {
      setError('');
      const updated = await sampleService.receiveSample(sample.id!, receiveForm);
      setSample(updated);
      setIsReceiveModalOpen(false);
      
      // Reload timeline
      const historyData = await sampleService.getSampleHistory(sample.id!);
      setHistory(historyData);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to receive sample.');
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sample || !statusForm.status) return;

    try {
      setError('');
      const updated = await sampleService.updateSampleStatus(sample.id!, statusForm.status, statusForm.remarks);
      setSample(updated);
      setIsStatusModalOpen(false);
      
      // Reload timeline
      const historyData = await sampleService.getSampleHistory(sample.id!);
      setHistory(historyData);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update sample status.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          Loading sample details...
        </div>
      </Layout>
    );
  }

  if (!sample) {
    return (
      <Layout>
        <div className="p-6 text-center text-red-500 font-semibold">
          Sample not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Back and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/sample" className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white border">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Sample Tracking</span>
              <h2 className="text-2xl font-bold text-gray-800">{sample.sampleId}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {sample.status === 'REGISTERED' && canReceiveOrEdit && (
              <button
                onClick={() => setIsReceiveModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-all duration-300 flex items-center space-x-2"
              >
                <Beaker className="w-4 h-4" />
                <span>Receive Sample physically</span>
              </button>
            )}
            {sample.status !== 'REGISTERED' && sample.status !== 'ARCHIVED' && canReceiveOrEdit && (
              <button
                onClick={() => {
                  setStatusForm({ status: '', remarks: '' });
                  setIsStatusModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Update Workflow Status</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Sample Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Beaker className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Material Type</p>
                    <p className="text-sm font-semibold text-gray-800">{sample.materialName} ({sample.materialCode})</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Work Order / Submission ID</p>
                    <p className="text-sm font-semibold text-blue-600 hover:underline">
                      <Link href={`/work-order/${sample.workOrderId}`}>{sample.workOrderNumber}</Link>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Customer & Project</p>
                    <p className="text-sm font-semibold text-gray-800">{sample.customerName} - {sample.projectName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Sample Quantity</p>
                    <p className="text-sm font-semibold text-gray-800">{sample.quantity} {sample.unit}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Collection Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Collected By</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{sample.collectedByName || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Collection Date</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{sample.collectionDate || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Collection Location</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">{sample.collectionLocation || 'N/A'}</p>
                </div>
              </div>
            </div>

            {sample.status !== 'REGISTERED' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Reception Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-500 font-semibold">Received By</p>
                    <p className="text-sm font-bold text-indigo-900 mt-1">{sample.receivedByName || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-500 font-semibold">Received Date</p>
                    <p className="text-sm font-bold text-indigo-900 mt-1">{sample.receivedDate || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-500 font-semibold">Received Time</p>
                    <p className="text-sm font-bold text-indigo-900 mt-1">{sample.receivedTime ? sample.receivedTime.substring(0, 5) : 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-xs text-indigo-500 font-semibold">Sample Condition</p>
                    <p className="text-sm font-bold text-indigo-900 mt-1">{sample.condition || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Properties & State Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Current Workflow</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={sample.status || 'REGISTERED'} />
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-500">Priority</span>
                  <PriorityBadge priority={sample.priority || 'Normal'} />
                </div>
                <div className="py-2">
                  <span className="text-sm text-gray-500 block mb-1">Remarks</span>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg italic">
                    {sample.remarks || 'No remarks recorded.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Status Timeline History */}
        {!isClient && history.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6">Workflow Audit Trail</h3>
            <div className="relative border-l border-gray-200 ml-4 space-y-8">
              {history.map((h, idx) => (
                <div key={h.id} className="relative pl-6">
                  {/* Dots */}
                  <div className="absolute -left-3 top-1 bg-white border-2 border-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-400">
                        {new Date(h.changedAt).toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        By {h.changedByName || 'System'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-3">
                      {h.oldStatus && (
                        <>
                          <StatusBadge status={h.oldStatus} />
                          <span className="text-gray-400 text-sm">→</span>
                        </>
                      )}
                      <StatusBadge status={h.newStatus} />
                    </div>
                    {h.remarks && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2.5 rounded-md mt-2 italic">
                        {h.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Receive Sample */}
        {isReceiveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <h3 className="text-lg font-bold">Receive Sample physically</h3>
                <button onClick={() => setIsReceiveModalOpen(false)} className="text-white hover:text-blue-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleReceiveSample} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Received Date *</label>
                  <input
                    type="date"
                    required
                    value={receiveForm.receivedDate}
                    onChange={(e) => setReceiveForm({ ...receiveForm, receivedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Received Time *</label>
                  <input
                    type="time"
                    required
                    value={receiveForm.receivedTime}
                    onChange={(e) => setReceiveForm({ ...receiveForm, receivedTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Received By (Lab Staff) *</label>
                  <select
                    required
                    value={receiveForm.receivedById}
                    onChange={(e) => setReceiveForm({ ...receiveForm, receivedById: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    <option value="">Select Lab Member</option>
                    {users.filter(u => u.roles.includes('ROLE_TECHNICIAN')).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sample Condition *</label>
                  <select
                    value={receiveForm.condition}
                    onChange={(e) => setReceiveForm({ ...receiveForm, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    <option value="GOOD">GOOD</option>
                    <option value="DAMAGED">DAMAGED</option>
                    <option value="BROKEN">BROKEN</option>
                    <option value="CONTAMINATED">CONTAMINATED</option>
                    <option value="WET">WET</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks / Note</label>
                  <textarea
                    rows={2}
                    value={receiveForm.remarks}
                    onChange={(e) => setReceiveForm({ ...receiveForm, remarks: e.target.value })}
                    placeholder="Enter condition notes if broken/damaged..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsReceiveModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-sm"
                  >
                    Receive physically
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Update Status */}
        {isStatusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <h3 className="text-lg font-bold">Update Workflow Status</h3>
                <button onClick={() => setIsStatusModalOpen(false)} className="text-white hover:text-blue-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">New Status *</label>
                  <select
                    required
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    <option value="">Select Status</option>
                    <option value="ASSIGNED">ASSIGNED (Assign testing staff)</option>
                    <option value="TESTING">TESTING (Test in progress)</option>
                    <option value="REVIEW">REVIEW (QA Check)</option>
                    <option value="APPROVED">APPROVED (Approve test result)</option>
                    <option value="REPORT_GENERATED">REPORT GENERATED</option>
                    <option value="DELIVERED">DELIVERED (Send to client)</option>
                    <option value="ARCHIVED">ARCHIVED (Archive sample)</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status Remarks *</label>
                  <textarea
                    rows={3}
                    required
                    value={statusForm.remarks}
                    onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                    placeholder="Enter explanation for the status change..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsStatusModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-sm"
                  >
                    Save Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
