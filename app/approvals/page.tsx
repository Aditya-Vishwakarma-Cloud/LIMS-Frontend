"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, ShieldCheck, FileCheck, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { testResultService, TestResult } from '@/services/testResultService';

export default function ApprovalsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  const [approvals, setApprovals] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<TestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [qaRemarks, setQaRemarks] = useState('');
  const [signaturePin, setSignaturePin] = useState('');
  const [certified, setCertified] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Route Guard
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        const roles = user.roles || [];
        const canApprove = roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_ADMIN') || roles.includes('ROLE_QUALITY_ENGINEER');
        if (!canApprove) {
          router.push('/dashboard?error=unauthorized');
        }
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPendingApprovals();
    }
  }, [user]);

  useEffect(() => {
    if (selectedApprovalId) {
      const approval = approvals.find(a => a.id === selectedApprovalId);
      if (approval) {
        setSelectedApproval(approval);
        setQaRemarks(approval.remarks || '');
        setSignaturePin('');
        setCertified(false);
        setError('');
        setSuccess('');
      }
    } else {
      setSelectedApproval(null);
    }
  }, [selectedApprovalId, approvals]);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await testResultService.getPendingApprovals();
      setApprovals(data);
      if (data.length > 0) {
        if (!selectedApprovalId || !data.some(a => a.id === selectedApprovalId)) {
          setSelectedApprovalId(data[0].id || null);
        }
      } else {
        setSelectedApprovalId(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending approvals.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApprovalId) return;
    if (!certified) {
      setError('Please certify that you have reviewed the results before final sign-off.');
      return;
    }
    if (!signaturePin) {
      setError('E-Signature PIN is required to complete final sign-off.');
      return;
    }
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      await testResultService.approveResult(selectedApprovalId, qaRemarks);
      setSuccess('Test result approved and locked successfully!');
      setTimeout(() => {
        fetchPendingApprovals();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to approve result.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnToQa = async () => {
    if (!selectedApprovalId) return;
    if (!qaRemarks.trim()) {
      setError('Remarks are required to reject and return to QA.');
      return;
    }
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      await testResultService.rejectResult(selectedApprovalId, qaRemarks);
      setSuccess('Test result rejected and returned to QA queue.');
      setTimeout(() => {
        fetchPendingApprovals();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to return result.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(a => 
    a.sampleCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.testName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">Final Sign-off / Approvals</h2>
          <p className="text-sm text-gray-500 mt-1">Provide final authorization and digitally sign off on QA-verified tests to prepare client reports.</p>
        </div>

        {(error || success) && (
          <div className="space-y-2">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg flex items-center space-x-3 text-sm font-medium">
                <Check className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Pending Approvals List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 space-y-3 bg-gray-50/50 rounded-t-lg">
              <h3 className="font-bold text-gray-800 text-sm">Pending Final Sign-off ({approvals.length})</h3>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Sample or Test ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 text-xs"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600 mb-2" />
                  Loading pending approvals...
                </div>
              ) : filteredApprovals.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs italic">
                  No pending approvals found.
                </div>
              ) : (
                filteredApprovals.map((approval) => (
                  <div 
                    key={approval.id}
                    onClick={() => setSelectedApprovalId(approval.id!)}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedApprovalId === approval.id 
                        ? 'border-green-500 bg-green-50/30 shadow-sm' 
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-800 text-xs">{approval.testName}</span>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                        {approval.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">Sample: {approval.sampleCode}</p>
                    <p className="text-[10px] text-gray-400 mt-1">QA Verified by: {approval.testedByName || 'QA Auditor'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Approval Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[500px]">
            {selectedApproval ? (
              <>
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 rounded-t-lg gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Finalizing: {selectedApproval.sampleCode}</h3>
                    <p className="text-xs text-gray-500">{selectedApproval.testName} (Specification: {selectedApproval.specOperator} {selectedApproval.specValue} {selectedApproval.unit})</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      disabled={actionLoading}
                      onClick={handleReturnToQa}
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md font-semibold text-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>RETURN TO QA / REJECT</span>
                    </button>
                    <button 
                      disabled={actionLoading}
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-semibold text-xs flex items-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>AUTHORIZE & LOCK</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                  {/* QA Sign-off Details */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Check className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider">QA Verification Remarks</h4>
                    </div>
                    <p className="text-xs text-purple-800 bg-white p-3 rounded border border-purple-100 font-medium">
                      {selectedApproval.remarks || "Observations checked and found fully compliant with standards limits."}
                    </p>
                  </div>

                  {/* Result Summary */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">Final Result Summary</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Tested By</p>
                        <p className="font-semibold text-gray-800 mt-0.5">{selectedApproval.testedByName || 'Technician'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Spec Limit</p>
                        <p className="font-semibold text-gray-800 mt-0.5">{selectedApproval.specOperator} {selectedApproval.specValue} {selectedApproval.unit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Final Result</p>
                        <p className="font-extrabold text-blue-600 mt-0.5 text-sm">{selectedApproval.finalResult} {selectedApproval.unit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Verdict Check</p>
                        <p className="mt-0.5">
                          {selectedApproval.passFail === 'PASS' ? (
                            <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded text-[10px] tracking-wider">PASS</span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded text-[10px] tracking-wider">FAIL</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Digital Signature */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">Authorization Signature</h4>
                    
                    <div className="flex flex-col space-y-3">
                      <label className="flex items-start space-x-3 bg-white p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={certified}
                          onChange={(e) => setCertified(e.target.checked)}
                          className="w-4.5 h-4.5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-0.5 bg-white" 
                        />
                        <div>
                          <p className="text-xs font-semibold text-gray-900">I certify that these results have been audited, compared with specifications, and are verified correct.</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Applying this signature locks the test record, transitions status to APPROVED, and schedules PDF reports release.</p>
                        </div>
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Approver Name</label>
                          <input
                            type="text"
                            value={user.name || ''}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">E-Signature PIN</label>
                          <input
                            type="password"
                            placeholder="Type 1234 or your PIN..."
                            value={signaturePin}
                            onChange={(e) => setSignaturePin(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-xs text-gray-800 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <ShieldCheck className="w-12 h-12 text-green-200 mb-4" />
                <h3 className="text-sm font-bold text-gray-700">No Approval Selected</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Select a QA-verified test from the pending queue on the left to begin final authorization sign-off.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
