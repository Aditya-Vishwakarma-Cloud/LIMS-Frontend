"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Printer, Send, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function PreviewInvoicePage({ params }: { params: { id: string } }) {
  const invoiceId = params.id || 'INV-2026-1001';

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gray-100 min-h-[calc(100vh-4rem)]">
        {/* Top Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Link href="/invoice" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Invoice Preview</h2>
              <p className="text-xs text-gray-500">Review layout before sending to the client.</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors shadow-sm">
              <CreditCard className="w-4 h-4" />
              <span>MARK AS PAID</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors shadow-sm">
              <Send className="w-4 h-4" />
              <span>SEND TO CLIENT</span>
            </button>
          </div>
        </div>

        {/* PDF Preview Container */}
        <div className="flex justify-center overflow-x-auto pb-12">
          {/* A4 Paper Simulation */}
          <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] px-[20mm] py-[20mm] relative">
            
            {/* Header */}
            <div className="border-b-2 border-gray-200 pb-6 mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">WeMurz Lab</h1>
                <p className="text-sm text-gray-600 mt-1">Material Testing & Quality Assurance</p>
                <p className="text-xs text-gray-500 mt-2">123 Industrial Estate, Sector 4<br/>Cityville, State 40001<br/>GSTIN: 27AABCV1234F1Z5</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <h2 className="text-3xl font-light text-gray-400 mb-2 uppercase tracking-widest">Tax Invoice</h2>
                <div className="grid grid-cols-2 gap-x-4 text-sm mt-2 text-left">
                  <div className="font-semibold text-gray-600">Invoice No:</div>
                  <div className="text-gray-900 font-bold">{invoiceId}</div>
                  <div className="font-semibold text-gray-600">Date:</div>
                  <div className="text-gray-900">28 May 2026</div>
                  <div className="font-semibold text-gray-600">Due Date:</div>
                  <div className="text-gray-900">12 Jun 2026</div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Billed To</h3>
              <p className="text-base font-bold text-gray-900">Apex Construction Corp</p>
              <p className="text-sm text-gray-700 mt-1">123 Corporate Blvd, Tech Park</p>
              <p className="text-sm text-gray-700">Cityville 40001</p>
              <p className="text-sm text-gray-700 mt-2"><span className="font-semibold">GSTIN:</span> 27AADCB2230M1Z2</p>
            </div>

            {/* Line Items */}
            <table className="w-full text-sm border-collapse mb-8">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Description / Service</th>
                  <th className="px-4 py-3 text-center font-semibold w-24">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold w-32">Rate (₹)</th>
                  <th className="px-4 py-3 text-right font-semibold w-32">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-b border-gray-200">
                <tr>
                  <td className="px-4 py-4 text-gray-800">Compressive Strength Test (Concrete M30)<br/><span className="text-xs text-gray-500">Ref Report: RPT-2026-0001</span></td>
                  <td className="px-4 py-4 text-center text-gray-800">3</td>
                  <td className="px-4 py-4 text-right text-gray-800">1,500.00</td>
                  <td className="px-4 py-4 text-right text-gray-900 font-medium">4,500.00</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-gray-800">Slump Test (On-site)</td>
                  <td className="px-4 py-4 text-center text-gray-800">1</td>
                  <td className="px-4 py-4 text-right text-gray-800">800.00</td>
                  <td className="px-4 py-4 text-right text-gray-900 font-medium">800.00</td>
                </tr>
              </tbody>
            </table>

            {/* Totals Calculation */}
            <div className="flex justify-end mb-12">
              <div className="w-1/2 md:w-1/3">
                <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-medium">₹ 5,300.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                  <span className="text-gray-600 font-medium">GST (18%)</span>
                  <span className="text-gray-900 font-medium">₹ 954.00</span>
                </div>
                <div className="flex justify-between py-3 border-b-2 border-gray-800">
                  <span className="text-gray-900 font-bold text-lg">Total Amount</span>
                  <span className="text-blue-900 font-bold text-lg">₹ 6,254.00</span>
                </div>
              </div>
            </div>

            {/* Payment Details & Footer */}
            <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t border-gray-200 pt-6 flex justify-between">
              
              <div className="w-1/2 pr-4">
                <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Payment Instructions</h4>
                <p className="text-xs text-gray-700 font-semibold mb-1">Bank Transfer Details:</p>
                <p className="text-xs text-gray-600">Bank: State Bank of India</p>
                <p className="text-xs text-gray-600">A/C Name: WeMurz Lab</p>
                <p className="text-xs text-gray-600">A/C No: 334455667788</p>
                <p className="text-xs text-gray-600">IFSC: SBIN0001234</p>
                <p className="text-[10px] text-gray-500 mt-3 italic">Please include the invoice number in your transfer reference.</p>
              </div>

              <div className="w-1/2 text-right">
                <div className="h-16 flex items-end justify-end mb-2">
                  <span className="font-script text-2xl text-blue-800 italic pr-4">Authorized Signatory</span>
                </div>
                <div className="border-t border-gray-800 w-48 ml-auto"></div>
                <p className="text-xs font-bold text-gray-900 mt-1">For WeMurz Lab</p>
                <p className="text-[10px] text-gray-500 mt-8">Thank you for your business!</p>
              </div>

            </div>
            
          </div>
        </div>

      </div>
    </Layout>
  );
}
