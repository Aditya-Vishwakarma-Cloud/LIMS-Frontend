"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Plus, Filter, FileText, Download, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDashboard() {
  const mockInvoices = [
    { id: 'INV-2026-1001', client: 'Apex Construction Corp', date: '2026-05-25', due: '2026-06-10', amount: 45000, status: 'Sent' },
    { id: 'INV-2026-1002', client: 'Global Builders Ltd', date: '2026-05-15', due: '2026-05-30', amount: 12500, status: 'Paid' },
    { id: 'INV-2026-1003', client: 'City Metro Authority', date: '2026-04-20', due: '2026-05-05', amount: 89000, status: 'Overdue' },
    { id: 'INV-2026-1004', client: 'Sunrise Developments', date: '2026-05-28', due: '2026-06-12', amount: 6200, status: 'Draft' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /><span>Paid</span></span>;
      case 'Overdue': return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3" /><span>Overdue</span></span>;
      case 'Sent': return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3" /><span>Sent</span></span>;
      default: return <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><span>Draft</span></span>;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Invoices</h2>
            <p className="text-sm text-gray-500 mt-1">Manage billing, track payments, and generate professional tax invoices.</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <Link href="/invoice/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </Link>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Outstanding</p>
            <h3 className="text-2xl font-bold text-gray-900">₹1,40,200</h3>
            <p className="text-xs text-red-600 mt-2 font-medium flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> ₹89,000 is overdue</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Collected (This Month)</p>
            <h3 className="text-2xl font-bold text-gray-900">₹3,45,000</h3>
            <p className="text-xs text-green-600 mt-2 font-medium flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> +12% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Draft Invoices</p>
            <h3 className="text-2xl font-bold text-gray-900">4</h3>
            <p className="text-xs text-gray-500 mt-2">Awaiting final review</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-500 mb-1">Active Clients</p>
            <h3 className="text-2xl font-bold text-gray-900">28</h3>
            <p className="text-xs text-blue-600 mt-2">Currently being billed</p>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50">
            <div className="relative w-full sm:max-w-md">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search Invoice ID or Client..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <SearchIcon className="absolute left-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 bg-white rounded-md flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-50 text-sm font-medium">
              <Filter className="w-4 h-4" />
              <span>Filter Status</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice No.</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount (₹)</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span>{inv.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{inv.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.due}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">{inv.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/invoice/preview/${inv.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Preview</Link>
                      <button className="text-gray-600 hover:text-gray-900">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
