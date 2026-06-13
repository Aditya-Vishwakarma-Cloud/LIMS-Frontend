"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, ShieldCheck, FileCheck, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function ApprovalsPage() {
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);

  const mockApprovals = [
    { id: 'APP-501', testId: 'TST-001', sampleId: 'SMP-2026-0001', testName: 'Compressive Strength', reviewedBy: 'Sarah QA', date: '2026-05-28' },
    { id: 'APP-502', testId: 'TST-002', sampleId: 'SMP-2026-0002', testName: 'Slump Test', reviewedBy: 'Sarah QA', date: '2026-05-28' },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Final Approvals</h2>
          <p className="text-sm text-gray-500 mt-1">Provide final sign-off on QA-reviewed tests for report generation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Pending Approvals List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 space-y-3">
              <h3 className="font-semibold text-gray-800">Pending Final Sign-off</h3>
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
              {mockApprovals.map((approval) => (
                <div 
                  key={approval.id}
                  onClick={() => setSelectedApproval(approval.id)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedApproval === approval.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{approval.testName}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{approval.testId}</span>
                  </div>
                  <p className="text-xs text-green-700 font-medium truncate">Sample: {approval.sampleId}</p>
                  <p className="text-xs text-gray-500 mt-1">QA By: {approval.reviewedBy} on {approval.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Approval Interface */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {selectedApproval ? (
              <>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Finalizing: {selectedApproval}</h3>
                    <p className="text-sm text-gray-500">Compressive Strength Test (Test ID: TST-001)</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
                      <AlertTriangle className="w-4 h-4" />
                      <span>RETURN TO QA</span>
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
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
                      <h4 className="font-semibold text-purple-900">QA Approved by Sarah QA</h4>
                    </div>
                    <p className="text-sm text-purple-800 bg-white p-3 rounded border border-purple-100">
                      "Results are well within the IS 456 M30 specifications. Failure pattern observed in photos is typical for this mix design. Approved for final sign-off."
                    </p>
                  </div>

                  {/* Result Summary */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Final Result Summary</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Test Date</p>
                        <p className="font-medium text-gray-800">2026-05-28</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Technician</p>
                        <p className="font-medium text-gray-800">John Doe</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Spec limit</p>
                        <p className="font-medium text-gray-800">Min 30.00 N/mm²</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Final Result</p>
                        <p className="font-bold text-blue-700 text-lg">32.02 N/mm²</p>
                      </div>
                    </div>
                  </div>

                  {/* Digital Signature */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Authorization Signature</h4>
                    
                    <div className="flex flex-col space-y-3">
                      <label className="flex items-center space-x-3 bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                        <input type="checkbox" className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">I certify that these results have been reviewed and are accurate.</p>
                          <p className="text-xs text-gray-500">Applying this signature will lock the test record and make it available for Client Reporting.</p>
                        </div>
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Approver Name</label>
                          <input
                            type="text"
                            defaultValue="Dr. Alan LabManager"
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">E-Signature PIN</label>
                          <input
                            type="password"
                            placeholder="****"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <ShieldCheck className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Approval Selected</h3>
                <p className="mt-1">Select a QA-reviewed test from the list to finalize.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
