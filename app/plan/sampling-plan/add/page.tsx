"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Save, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function AddSamplingPlan() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/plan" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Create Sampling Plan</h2>
                <p className="text-sm text-gray-500 mt-1">Schedule when and where samples need to be collected.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/plan" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex items-center justify-center">
                CANCEL
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>SAVE SAMPLING PLAN</span>
              </button>
            </div>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    General Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Name / Reference
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Metro Pillar 44 Weekly Concrete Sampling"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
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
                        Site Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zone B, Sector 5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
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
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Schedule & Assignment
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Per_Batch">Per Batch / Delivery</option>
                          <option value="One_Time">One Time</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Technician
                      </label>
                      <div className="relative">
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                          <option value="">Select Technician</option>
                          <option value="t1">John Doe</option>
                          <option value="t2">Jane Smith</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions for Sampler
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Specific instructions on how or exactly where to take the sample..."
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
