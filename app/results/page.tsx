"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Upload, CheckSquare, Save } from 'lucide-react';
import { useState } from 'react';

export default function ResultsPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const mockTasks = [
    { id: 'TST-001', sampleId: 'SMP-2026-0001', testName: 'Compressive Strength', dueDate: '2026-05-29' },
    { id: 'TST-002', sampleId: 'SMP-2026-0002', testName: 'Slump Test', dueDate: '2026-05-28' },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Test Results Entry</h2>
          <p className="text-sm text-gray-500 mt-1">Enter results and upload attachments for assigned tests.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Assigned Tasks List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-12rem)]">
            <div className="p-4 border-b border-gray-200 space-y-3">
              <h3 className="font-semibold text-gray-800">My Assigned Tests</h3>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Test ID or Sample..."
                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {mockTasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedTask === task.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{task.testName}</span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{task.id}</span>
                  </div>
                  <p className="text-xs text-blue-600 truncate font-medium">Sample: {task.sampleId}</p>
                  <p className="text-xs text-gray-400 mt-1">Due: {task.dueDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Result Entry Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            {selectedTask ? (
              <>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">Result Entry: {selectedTask}</h3>
                    <p className="text-sm text-gray-500">Compressive Strength Test</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                      SAVE DRAFT
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
                      <CheckSquare className="w-4 h-4" />
                      <span>SUBMIT FOR QA</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-8">
                  {/* Results Data Grid */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Observation Data</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Testing</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Used</label>
                        <input
                          type="text"
                          defaultValue="Compression Testing Machine (CTM-01)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Load at Failure (kN)</label>
                        <input
                          type="number"
                          placeholder="Enter load value"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cross-Sectional Area (mm²)</label>
                        <input
                          type="number"
                          defaultValue={22500}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Compressive Strength (N/mm²)</label>
                        <input
                          type="number"
                          placeholder="Auto-calculated"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-blue-50 text-blue-800 font-semibold"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Technician Remarks</h4>
                    <textarea
                      rows={3}
                      placeholder="Any observations regarding failure pattern or sample condition during testing..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    ></textarea>
                  </div>

                  {/* Attachments */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-800 border-b border-gray-200 pb-2">Attachments</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">Upload photos of tested samples, raw equipment output, or calculations (PNG, JPG, PDF)</p>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <CheckSquare className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Test Selected</h3>
                <p className="mt-1">Select an assigned test from the list to enter results.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
