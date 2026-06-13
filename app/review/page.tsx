"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ReviewPage() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const mockReviews = [
    { id: 'REV-101', testId: 'TST-001', sampleId: 'SMP-2026-0001', testName: 'Compressive Strength', submittedBy: 'John Doe', date: '2026-05-28' },
    { id: 'REV-102', testId: 'TST-002', sampleId: 'SMP-2026-0002', testName: 'Slump Test', submittedBy: 'Jane Smith', date: '2026-05-28' },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">QA Review</h2>
          <p className="text-sm text-gray-500 mt-1">Review submitted test results against specifications and mark for approval or retest.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Pending Reviews List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 space-y-3">
              <h3 className="font-semibold text-gray-800">Pending QA Reviews</h3>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Sample or Test ID..."
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {mockReviews.map((review) => (
                <div 
                  key={review.id}
                  onClick={() => setSelectedReview(review.id)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedReview === review.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{review.testName}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{review.testId}</span>
                  </div>
                  <p className="text-xs text-purple-700 font-medium truncate">Sample: {review.sampleId}</p>
                  <p className="text-xs text-gray-500 mt-1">By: {review.submittedBy} on {review.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Review Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {selectedReview ? (
              <>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Reviewing: {selectedReview}</h3>
                    <p className="text-sm text-gray-500">Compressive Strength Test (Test ID: TST-001)</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-white border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
                      <XCircle className="w-4 h-4" />
                      <span>REJECT / RETEST</span>
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      <span>APPROVE RESULT</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                  {/* Result vs Specification View */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-2">
                      <h4 className="font-medium text-gray-800">Result Verification</h4>
                      <span className="text-xs text-gray-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Specification: IS 456 (M30 Grade)</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border border-gray-200 rounded-md overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-xs font-medium text-gray-600">Parameter</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-600">Submitted Result</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-600">Spec Limits</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-600 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                          <tr>
                            <td className="px-4 py-3 font-medium text-gray-800">Load at Failure (kN)</td>
                            <td className="px-4 py-3 text-gray-600">720.5</td>
                            <td className="px-4 py-3 text-gray-500">-</td>
                            <td className="px-4 py-3 text-center">-</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium text-gray-800">Cross-Sectional Area (mm²)</td>
                            <td className="px-4 py-3 text-gray-600">22500</td>
                            <td className="px-4 py-3 text-gray-500">22500 ± 5%</td>
                            <td className="px-4 py-3 text-center"><span className="text-green-600 font-bold">✓</span></td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td className="px-4 py-3 font-semibold text-blue-900">Compressive Strength (N/mm²)</td>
                            <td className="px-4 py-3 font-bold text-blue-900">32.02</td>
                            <td className="px-4 py-3 text-gray-600">Min 30.00</td>
                            <td className="px-4 py-3 text-center"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">PASS</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Submitted Attachments */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Evidence & Attachments</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-md p-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="bg-gray-100 p-2 rounded">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">CTM_Output_720kN.pdf</p>
                          <p className="text-xs text-gray-500">1.2 MB • Uploaded by John Doe</p>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-md p-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="bg-gray-100 p-2 rounded">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Failed_Cube_Photo.jpg</p>
                          <p className="text-xs text-gray-500">3.4 MB • Uploaded by John Doe</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QA Remarks */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">QA Evaluation</h4>
                    <textarea
                      rows={4}
                      placeholder="Enter quality assurance remarks, reasons for rejection, or general observations..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    ></textarea>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <CheckCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Review Selected</h3>
                <p className="mt-1">Select a submitted test from the list to begin QA review.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
