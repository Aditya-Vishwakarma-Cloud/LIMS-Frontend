"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Save, Plus, Trash2, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateInvoicePage() {
  const [items, setItems] = useState([
    { id: 1, description: 'Compressive Strength Test (Concrete M30)', qty: 3, price: 1500 },
    { id: 2, description: '', qty: 1, price: 0 }
  ]);

  const addItem = () => setItems([...items, { id: Date.now(), description: '', qty: 1, price: 0 }]);
  
  const removeItem = (id: number) => setItems(items.filter(item => item.id !== id));

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const gst = subtotal * 0.18; // 18% standard GST
  const total = subtotal + gst;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-4">
              <Link href="/invoice" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Create New Invoice</h2>
                <p className="text-sm text-gray-500 mt-1">Draft a new tax invoice for testing services.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex items-center justify-center">
                SAVE DRAFT
              </button>
              <Link href={`/invoice/preview/DRAFT-${Date.now()}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>GENERATE PREVIEW</span>
              </Link>
            </div>
          </div>

          <form className="space-y-8">
            
            {/* Invoice Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bill To (Client)</label>
                <div className="relative">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                    <option value="">Select Client</option>
                    <option value="c1">Apex Construction Corp</option>
                    <option value="c2">Global Builders Ltd</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
                  <p className="font-medium text-gray-700">Billing Address will auto-populate:</p>
                  <p>123 Corporate Blvd, Tech Park, Cityville 40001</p>
                  <p>GSTIN: 27AADCB2230M1Z2</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Date</label>
                <input
                  type="date"
                  defaultValue="2026-05-28"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  defaultValue="2026-06-12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Line Items</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase w-3/5">Description / Test Name</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-center w-1/12">Qty</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right w-1/6">Rate (₹)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right w-1/6">Amount (₹)</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-2 py-3">
                          <input
                            type="text"
                            value={item.description}
                            placeholder="Enter test name or service..."
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                              const newItems = items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i);
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            value={item.qty}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                              const newItems = items.map(i => i.id === item.id ? { ...i, qty: parseInt(e.target.value) || 0 } : i);
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            type="number"
                            value={item.price}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-right focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                              const newItems = items.map(i => i.id === item.id ? { ...i, price: parseInt(e.target.value) || 0 } : i);
                              setItems(newItems);
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          {(item.qty * item.price).toLocaleString('en-IN')}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <button 
                            type="button" 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                <button 
                  type="button" 
                  onClick={addItem}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            {/* Totals & Notes */}
            <div className="flex flex-col md:flex-row justify-between gap-8 pt-6 border-t border-gray-200">
              <div className="w-full md:w-1/2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notes / Payment Terms</label>
                  <textarea
                    rows={4}
                    defaultValue="Payment is due within 15 days of invoice date. Please include invoice number on your check or bank transfer."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  ></textarea>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-gray-900">₹ {gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                  <span className="font-bold text-blue-700 text-xl">₹ {total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}
