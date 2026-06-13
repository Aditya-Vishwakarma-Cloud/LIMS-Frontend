"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Printer, Download, CheckCircle, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function GenerateReportPage({ params }: { params: { id: string } }) {
  // Mock data for the report
  const sampleId = params.id || 'SMP-2026-0001';

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gray-100 min-h-[calc(100vh-4rem)]">
        {/* Top Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Link href="/reports" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Report Preview</h2>
              <p className="text-xs text-gray-500">Review layout and data before generating the final immutable PDF.</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
              <Printer className="w-4 h-4" />
              <span>Print Draft</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors shadow-sm">
              <CheckCircle className="w-4 h-4" />
              <span>PUBLISH & GENERATE PDF</span>
            </button>
          </div>
        </div>

        {/* PDF Preview Container */}
        <div className="flex justify-center overflow-x-auto pb-12">
          {/* A4 Paper Simulation (approximate aspect ratio 1:1.414) */}
          <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] px-[20mm] py-[20mm] relative">
            
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">WeMurz Lab</h1>
                <p className="text-sm text-gray-600 mt-1">Material Testing & Quality Assurance</p>
                <p className="text-xs text-gray-500">123 Industrial Estate, Sector 4, Cityville</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex space-x-2 mb-2">
                  <span className="border border-gray-300 px-2 py-1 text-xs font-bold text-gray-700 rounded">ISO 9001:2015</span>
                  <span className="border border-gray-300 px-2 py-1 text-xs font-bold text-gray-700 rounded">NABL Accredited</span>
                </div>
                <p className="text-sm font-semibold">Test Report</p>
                <p className="text-xs text-gray-600">Report No: RPT-2026-{Math.floor(Math.random() * 1000).toString().padStart(4, '0')}</p>
                <p className="text-xs text-gray-600">Issue Date: 2026-05-28</p>
              </div>
            </div>

            {/* General Information */}
            <h2 className="text-lg font-bold text-gray-800 mb-3 uppercase border-b border-gray-200 pb-1">1. General Information</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-8">
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Client Name:</span> <span className="text-gray-900">Apex Construction Corp</span></div>
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Project:</span> <span className="text-gray-900">Metro Line 3 Phase A</span></div>
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Sample ID:</span> <span className="text-gray-900 font-bold">{sampleId}</span></div>
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Material:</span> <span className="text-gray-900">Concrete (M30 Grade)</span></div>
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Date Collected:</span> <span className="text-gray-900">2026-05-20</span></div>
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Date Tested:</span> <span className="text-gray-900">2026-05-28</span></div>
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Site Location:</span> <span className="text-gray-900">Pillar 44, Block B</span></div>
              <div className="flex"><span className="w-32 font-semibold text-gray-700">Specification:</span> <span className="text-gray-900">IS 456</span></div>
            </div>

            {/* Test Results */}
            <h2 className="text-lg font-bold text-gray-800 mb-3 uppercase border-b border-gray-200 pb-1">2. Test Results</h2>
            <table className="w-full text-sm border-collapse border border-gray-800 mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-800 px-3 py-2 text-left font-semibold">Test Parameter</th>
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">UOM</th>
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">Observed Value</th>
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">Spec Limit</th>
                  <th className="border border-gray-800 px-3 py-2 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-800 px-3 py-2">Compressive Strength (7 Days)</td>
                  <td className="border border-gray-800 px-3 py-2 text-center">N/mm²</td>
                  <td className="border border-gray-800 px-3 py-2 text-center font-medium">32.02</td>
                  <td className="border border-gray-800 px-3 py-2 text-center">Min 30.00</td>
                  <td className="border border-gray-800 px-3 py-2 text-center font-bold">PASS</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 px-3 py-2">Slump</td>
                  <td className="border border-gray-800 px-3 py-2 text-center">mm</td>
                  <td className="border border-gray-800 px-3 py-2 text-center font-medium">110</td>
                  <td className="border border-gray-800 px-3 py-2 text-center">100 - 120</td>
                  <td className="border border-gray-800 px-3 py-2 text-center font-bold">PASS</td>
                </tr>
              </tbody>
            </table>

            {/* Remarks */}
            <h2 className="text-lg font-bold text-gray-800 mb-3 uppercase border-b border-gray-200 pb-1">3. Remarks</h2>
            <p className="text-sm text-gray-700 mb-8 border border-gray-300 p-3 rounded">
              The tested sample conforms to the requirements of IS 456 for M30 grade concrete with respect to the tests carried out. Failure pattern observed during compressive testing was normal.
            </p>

            {/* Footer / Signatures - Pushed to bottom of page theoretically */}
            <div className="absolute bottom-[20mm] left-[20mm] right-[20mm]">
              <div className="border-t border-gray-800 pt-6 flex justify-between items-end">
                
                {/* QR Code Block */}
                <div className="flex flex-col items-center border-2 border-gray-800 p-2 rounded bg-gray-50">
                  <QrCode className="w-16 h-16 text-gray-900" />
                  <p className="text-[10px] font-bold mt-1 text-center">SCAN TO VERIFY<br/>AUTHENTICITY</p>
                </div>

                {/* Signatures */}
                <div className="flex space-x-12">
                  <div className="text-center">
                    <div className="h-12 flex items-end justify-center mb-1">
                      <span className="font-script text-xl text-blue-800 italic">John Doe</span>
                    </div>
                    <div className="border-t border-gray-400 w-32"></div>
                    <p className="text-xs font-semibold mt-1">Tested By</p>
                    <p className="text-[10px] text-gray-500">John Doe (Tech)</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-12 flex items-end justify-center mb-1 relative">
                      {/* E-Signature representation */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <span className="font-script text-xl text-purple-800 italic relative z-10">Dr. A. Manager</span>
                    </div>
                    <div className="border-t border-gray-400 w-40"></div>
                    <p className="text-xs font-semibold mt-1">Authorized Signatory</p>
                    <p className="text-[10px] text-gray-500">Dr. Alan LabManager</p>
                    <p className="text-[9px] text-gray-400 mt-1">Digitally Signed: 28-05-2026 14:30</p>
                  </div>
                </div>

              </div>
              <p className="text-center text-[10px] text-gray-500 mt-6">
                *** End of Report ***<br/>
                This report relates only to the sample tested. It shall not be reproduced except in full, without written approval of the laboratory.
              </p>
            </div>
            
          </div>
        </div>

      </div>
    </Layout>
  );
}
