"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, CheckCircle, XCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { testResultService, TestResult } from '@/services/testResultService';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  
  const [reviews, setReviews] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<TestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [qaRemarks, setQaRemarks] = useState('');
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
        const canReview = roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_ADMIN') || roles.includes('ROLE_QUALITY_ENGINEER');
        if (!canReview) {
          router.push('/dashboard?error=unauthorized');
        }
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchPendingReviews();
    }
  }, [user]);

  useEffect(() => {
    if (selectedReviewId) {
      const review = reviews.find(r => r.id === selectedReviewId);
      if (review) {
        setSelectedReview(review);
        setQaRemarks(review.remarks || '');
        setError('');
        setSuccess('');
      }
    } else {
      setSelectedReview(null);
    }
  }, [selectedReviewId, reviews]);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await testResultService.getPendingReview();
      setReviews(data);
      if (data.length > 0) {
        // Auto-select first if none selected
        if (!selectedReviewId || !data.some(r => r.id === selectedReviewId)) {
          setSelectedReviewId(data[0].id || null);
        }
      } else {
        setSelectedReviewId(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedReviewId) return;
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      await testResultService.verifyResult(selectedReviewId, qaRemarks);
      setSuccess('Test result verified successfully!');
      setTimeout(() => {
        fetchPendingReviews();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to verify result.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReviewId) return;
    if (!qaRemarks.trim()) {
      setError('QA remarks are required to reject a test result.');
      return;
    }
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      await testResultService.rejectResult(selectedReviewId, qaRemarks);
      setSuccess('Test result rejected and returned for correction.');
      setTimeout(() => {
        fetchPendingReviews();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reject result.');
    } finally {
      setActionLoading(false);
    }
  };

  // Parsing Helpers
  const parseJsonMap = (jsonStr?: string) => {
    if (!jsonStr) return {};
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return {};
    }
  };

  const parseJsonArray = (jsonStr?: string): string[] => {
    if (!jsonStr) return [];
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return [];
    }
  };

  const observations = parseJsonMap(selectedReview?.observations);
  const calculations = parseJsonMap(selectedReview?.calculations);
  const attachments = parseJsonArray(selectedReview?.attachments);

  const filteredReviews = reviews.filter(r => 
    r.sampleCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.testName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">QA Review Workbench</h2>
          <p className="text-sm text-gray-500 mt-1">Review submitted test results, check attachments against standards, and verify observations.</p>
        </div>

        {(error || success) && (
          <div className="space-y-2">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg flex items-center space-x-3 text-sm font-medium">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Pending Reviews List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 space-y-3 bg-gray-50/50 rounded-t-lg">
              <h3 className="font-bold text-gray-800 text-sm">Pending QA Reviews ({reviews.length})</h3>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Sample or Test ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 text-xs"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
                  Loading pending reviews...
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs italic">
                  No pending reviews found.
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div 
                    key={review.id}
                    onClick={() => setSelectedReviewId(review.id!)}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedReviewId === review.id 
                        ? 'border-purple-500 bg-purple-50/30 shadow-sm' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-800 text-xs">{review.testName}</span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                        {review.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">Sample: {review.sampleCode}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Submitted by: {review.testedByName || 'Technician'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Review Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[500px]">
            {selectedReview ? (
              <>
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 rounded-t-lg gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Reviewing: {selectedReview.sampleCode}</h3>
                    <p className="text-xs text-gray-500">{selectedReview.testName} (Specification: {selectedReview.specOperator} {selectedReview.specValue} {selectedReview.unit})</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      disabled={actionLoading}
                      onClick={handleReject}
                      className="bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-md font-semibold text-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT / RETEST</span>
                    </button>
                    <button 
                      disabled={actionLoading}
                      onClick={handleVerify}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md font-semibold text-xs flex items-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>VERIFY & COMPLETE</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                  {/* Result vs Specification View */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-2">
                      <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Result Verification</h4>
                      <span className="text-[10px] text-gray-500 font-semibold flex items-center bg-gray-100 border px-2 py-0.5 rounded">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 text-gray-400"/> Std Specs Check
                      </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Parameter / Observation</th>
                            <th className="px-4 py-3 font-semibold">Submitted Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-700 bg-white">
                          {Object.keys(observations).map((key) => (
                            <tr key={key}>
                              <td className="px-4 py-2.5 font-medium text-gray-800">{key}</td>
                              <td className="px-4 py-2.5 font-mono text-gray-600">{observations[key]}</td>
                            </tr>
                          ))}
                          
                          {/* Calculations */}
                          {Object.keys(calculations).map((key) => (
                            <tr key={key} className="bg-indigo-50/20">
                              <td className="px-4 py-2.5 font-medium text-indigo-900">{key} (Calculated)</td>
                              <td className="px-4 py-2.5 font-mono font-semibold text-indigo-700">{calculations[key]}</td>
                            </tr>
                          ))}

                          <tr className="bg-blue-50 border-t border-blue-200">
                            <td className="px-4 py-3 font-bold text-blue-900">Overall Final Value ({selectedReview.unit})</td>
                            <td className="px-4 py-3 font-bold text-blue-900 font-mono text-sm">{selectedReview.finalResult}</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-700">Specification Limit</td>
                            <td className="px-4 py-3 font-semibold text-gray-700 font-mono">{selectedReview.specOperator} {selectedReview.specValue}</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-700">Verdict</td>
                            <td className="px-4 py-3">
                              {selectedReview.passFail === 'PASS' ? (
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-3 py-1 rounded text-[10px] tracking-widest shadow-sm">
                                  PASS
                                </span>
                              ) : selectedReview.passFail === 'FAIL' ? (
                                <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold px-3 py-1 rounded text-[10px] tracking-widest shadow-sm">
                                  FAIL
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-600 border border-gray-300 font-semibold px-3 py-1 rounded text-[10px]">
                                  {selectedReview.passFail || 'NONE'}
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Submitted Attachments */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">Evidence & Attachments</h4>
                    {attachments.length === 0 ? (
                      <p className="text-gray-400 text-xs italic">No evidence attachments uploaded by technician.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {attachments.map((file, i) => (
                          <div key={i} className="border border-gray-200 rounded-md p-3 flex items-start space-x-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <div className="bg-blue-50 p-2 rounded border border-blue-100">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-semibold text-gray-800 truncate" title={file}>{file}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">Reference Link</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* QA Remarks */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-200 pb-2">QA Evaluation & Remarks</h4>
                    <textarea
                      rows={4}
                      value={qaRemarks}
                      onChange={(e) => setQaRemarks(e.target.value)}
                      placeholder="Enter quality assurance review observations, evaluation notes, or reasons for rejection/retest..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-xs text-gray-800"
                    ></textarea>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 text-purple-200 mb-4" />
                <h3 className="text-sm font-bold text-gray-700">No Review Selected</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Select a submitted test result from the pending queue on the left to begin quality evaluation.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
