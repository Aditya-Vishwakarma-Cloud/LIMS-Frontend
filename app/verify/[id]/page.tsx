"use client";

import { ShieldCheck, CheckCircle, FileText, Calendar, Building, MapPin } from 'lucide-react';

export default function VerificationPage({ params }: { params: { id: string } }) {
  const reportId = params.id || 'RPT-2026-0001';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Company Branding */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">WeMurz Lab</h1>
        <p className="text-sm text-gray-500 mt-1">Official Document Verification Portal</p>
      </div>

      {/* Verification Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* Status Header */}
        <div className="bg-green-600 px-6 py-8 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-inner">
              <ShieldCheck className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Document Authenticity Verified</h2>
          <p className="mt-2 text-green-100 font-medium">This report was issued by WeMurz Lab and has not been tampered with.</p>
        </div>

        {/* Report Metadata */}
        <div className="px-6 py-6 border-b border-gray-100">
          <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider mb-4">Report Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Report No.</p>
                <p className="text-sm font-bold text-gray-900">{reportId}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Issue Date</p>
                <p className="text-sm font-medium text-gray-900">2026-05-28 14:30 UTC</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Building className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Client Name</p>
                <p className="text-sm font-medium text-gray-900">Apex Construction Corp</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Project</p>
                <p className="text-sm font-medium text-gray-900">Metro Line 3 Phase A</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Results Snapshot */}
        <div className="px-6 py-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider mb-4">Results Snapshot</h3>
          <p className="text-xs text-gray-500 mb-4">The following is an immutable cryptographic snapshot of the core results. If these differ from the physical paper, the paper is fraudulent.</p>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2">Test Parameter</th>
                  <th className="px-4 py-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">Compressive Strength (7 Days)</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">32.02 N/mm² (PASS)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">Slump</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">110 mm (PASS)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Digital Chain of Custody */}
        <div className="px-6 py-6">
          <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider mb-4">Chain of Custody & Signatures</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Tested By: John Doe</p>
                <p className="text-xs text-blue-700">Cryptographically signed on 2026-05-28 11:15</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-semibold text-purple-900">QA Approved By: Sarah QA</p>
                <p className="text-xs text-purple-700">Cryptographically signed on 2026-05-28 13:40</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-900">Final Authorization: Dr. Alan LabManager</p>
                <p className="text-xs text-green-700">Cryptographically signed on 2026-05-28 14:30</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-800 text-center py-4">
          <p className="text-xs text-gray-400">Powered by WeMurz LIMS Digital Trust Infrastructure.</p>
        </div>

      </div>
    </div>
  );
}
