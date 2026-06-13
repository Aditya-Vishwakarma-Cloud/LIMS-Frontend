"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Save, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function AddTestPlan() {
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
                <h2 className="text-2xl font-semibold text-gray-800">Create Test Plan</h2>
                <p className="text-sm text-gray-500 mt-1">Define which tests to perform on specific materials.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/plan" className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex items-center justify-center">
                CANCEL
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>SAVE TEST PLAN</span>
              </button>
            </div>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Plan Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Standard Concrete M30 Test Suite"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specification Standard
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. IS 456, ASTM C39"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remarks
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Additional details regarding this test plan..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 h-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Tests to Perform
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">Select the tests that are included in this plan.</p>
                    
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-sm font-medium text-gray-700">Compressive Strength</span>
                      </label>
                      
                      <label className="flex items-center p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-sm font-medium text-gray-700">Slump Test</span>
                      </label>
                      
                      <label className="flex items-center p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-sm font-medium text-gray-700">Water Absorption</span>
                      </label>

                      <label className="flex items-center p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-sm font-medium text-gray-700">Sieve Analysis</span>
                      </label>
                      
                      <label className="flex items-center p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <span className="ml-3 text-sm font-medium text-gray-700">Tensile Strength</span>
                      </label>
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
