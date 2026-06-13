"use client";

import { useState } from 'react';
import Layout from '@/app/components/Layout';
import { ChevronDown, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddSample() {
  const [sampleId, setSampleId] = useState('SMP-2026-0001');

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/sample" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Register Sample</h2>
                <p className="text-sm text-gray-500 mt-1">Enter details for a new construction material sample.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex-1 sm:flex-none">
                CANCEL
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex-1 sm:flex-none flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>SAVE & NEW</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex-1 sm:flex-none flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>SAVE & LIST</span>
              </button>
            </div>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Primary Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Primary Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sample ID
                      </label>
                      <input
                        type="text"
                        value={sampleId}
                        onChange={(e) => setSampleId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-generated ID. You may modify this if a manual ID is required.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project
                      </label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                          <option value="">Select Project</option>
                          <option value="p1">Metro Line 3 Phase A</option>
                          <option value="p2">Highway Expansion NH-44</option>
                          <option value="p3">Commercial Complex Delta</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material Type
                      </label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                          <option value="">Select Material Type</option>
                          <option value="concrete">Concrete</option>
                          <option value="soil">Soil</option>
                          <option value="aggregate">Aggregate</option>
                          <option value="steel">Steel</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <select 
                          defaultValue="Collected"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                        >
                          <option value="Collected">Collected</option>
                          <option value="Received">Received</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Collection & Tracking Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Collection & Tracking
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Collection Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collected By
                      </label>
                      <input
                        type="text"
                        placeholder="Name of technician or engineer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Location
                      </label>
                      <input
                        type="text"
                        placeholder="Specific location at site (e.g., Pillar 44, Block B)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Number / Reference
                      </label>
                      <input
                        type="text"
                        placeholder="Supplier batch number or mix design reference"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes / Remarks
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Any specific instructions or condition of sample upon collection..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      ></textarea>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
