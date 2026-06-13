"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Filter, Save, ChevronDown, FileText } from 'lucide-react';
import { useState } from 'react';

export default function AssigningPage() {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const mockSamples = [
    { id: 'SMP-2026-0001', material: 'Concrete', project: 'Metro Line 3 Phase A', date: '2026-05-28', status: 'Received' },
    { id: 'SMP-2026-0002', material: 'Soil', project: 'Highway Expansion NH-44', date: '2026-05-28', status: 'Received' },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Test Assignment</h2>
          <p className="text-sm text-gray-500 mt-1">Assign required tests and technicians to received samples.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Sample List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 space-y-3">
              <h3 className="font-semibold text-gray-800">Pending Assignment</h3>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Sample ID..."
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {mockSamples.map((sample) => (
                <div 
                  key={sample.id}
                  onClick={() => setSelectedSample(sample.id)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedSample === sample.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-blue-600 text-sm">{sample.id}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{sample.material}</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{sample.project}</p>
                  <p className="text-xs text-gray-400 mt-1">Received: {sample.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Assignment Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {selectedSample ? (
              <>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Assigning Tests for {selectedSample}</h3>
                    <p className="text-sm text-gray-500">Select standard test plans or individual tests to assign.</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
                    <Save className="w-4 h-4" />
                    <span>SAVE ASSIGNMENTS</span>
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                  {/* Select Predefined Plan */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Apply Test Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan Template</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                            <option value="">-- Custom Tests --</option>
                            <option value="tp1">Standard Concrete M30 Test Suite (IS 456)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Tests Selection */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Select Individual Tests</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <span className="ml-3 text-sm font-medium text-gray-700">Tensile Strength</span>
                      </label>
                    </div>
                  </div>

                  {/* Allocation */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Allocation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Technician</label>
                        <div className="relative">
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
                            <option value="">Select Technician</option>
                            <option value="t1">John Doe (Lab A)</option>
                            <option value="t2">Jane Smith (Lab B)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Completion Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions for Technician</label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Sample Selected</h3>
                <p className="mt-1">Select a sample from the list to assign tests.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
