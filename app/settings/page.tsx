"use client";

import Layout from '@/app/components/Layout';
import { useState } from 'react';
import { Building, Shield, Save, Upload } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">System Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage laboratory profile, users, and system preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'general' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>General Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'security' ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Security & Roles</span>
              </button>
            </div>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
            
            {/* General Profile Tab */}
            {activeTab === 'general' && (
              <div className="p-6">
                <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Laboratory Profile</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center space-x-2 transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
                
                <div className="space-y-6 max-w-3xl">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Laboratory Logo (Used in Reports & Invoices)</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Building className="w-8 h-8 text-gray-400" />
                      </div>
                      <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload New Logo</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Name</label>
                      <input type="text" defaultValue="WeMurz Lab" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration / GSTIN Number</label>
                      <input type="text" defaultValue="27AABCV1234F1Z5" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registered Address</label>
                      <textarea rows={3} defaultValue="123 Industrial Estate, Sector 4, Cityville, State 40001" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                      <input type="email" defaultValue="lab@wemurz.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <input type="text" defaultValue="+91 98765 43210" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Security & Access Control</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage E-Signatures and role-based permissions.</p>
                </div>
                
                <div className="space-y-8 max-w-2xl">
                  
                  {/* Password Reset */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 border-b border-gray-100 pb-2">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <input type="password" placeholder="Current Password" className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div>
                        <input type="password" placeholder="New Password" className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* E-Signature Config */}
                  <div className="space-y-3 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 border-b border-gray-100 pb-2">Digital E-Signature PIN</h4>
                    <p className="text-sm text-gray-500 mb-4">Set the 4-digit PIN used to authorize reports and lock test results.</p>
                    <div className="flex space-x-4 items-center">
                      <input type="password" placeholder="****" maxLength={4} className="w-24 px-3 py-2 text-center tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold" />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
                        Set PIN
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
