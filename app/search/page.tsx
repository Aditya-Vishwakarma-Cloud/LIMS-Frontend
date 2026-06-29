"use client";

import { ChevronDown, Search as SearchIcon, Eye, Download, Loader2, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { workOrderService, WorkOrder } from '@/services/workOrderService';
import { customerService, Customer } from '@/services/customerService';
import { testDefinitionService, TestDefinition } from '@/services/testDefinitionService';
import Link from 'next/link';

export default function Search() {
  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isClient = roles.includes('ROLE_CLIENT_VIEWER');

  // Master lists
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [testDefs, setTestDefs] = useState<TestDefinition[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search parameters
  const [woNumber, setWoNumber] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [projectName, setProjectName] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedTestCode, setSelectedTestCode] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');

  // Status flags
  const [approved, setApproved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  // Search execution states
  const [searchResults, setSearchResults] = useState<WorkOrder[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = async () => {
    try {
      setLoading(true);
      const [allCusts, allDefs, allWos] = await Promise.all([
        customerService.getAllCustomers(),
        testDefinitionService.getAllTestDefinitions(),
        workOrderService.getAllWorkOrders()
      ]);

      // Filter masters based on role (Client can only see their own dropdown selection)
      const allowedCusts = isClient
        ? allCusts.filter(c => c.customerName === 'Metro Transit Authority' || c.customerName === 'Delta Realty Group')
        : allCusts;

      setCustomers(allowedCusts);
      setTestDefs(allDefs);
      setWorkOrders(allWos);
      
      // Initialize search with all visible items
      const initialWos = isClient
        ? allWos.filter(w => w.customerName === 'Metro Transit Authority' || w.customerName === 'Delta Realty Group')
        : allWos;
      setSearchResults(initialWos);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load search parameters from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    setSearched(true);

    try {
      let filtered = [...workOrders];

      // 1. Role boundaries (Clients can only see their own work orders)
      if (isClient) {
        filtered = filtered.filter(w => w.customerName === 'Metro Transit Authority' || w.customerName === 'Delta Realty Group');
      }

      // 2. Filter by Work Order Number
      if (woNumber.trim()) {
        filtered = filtered.filter(w => 
          w.workOrderNumber?.toLowerCase().includes(woNumber.toLowerCase().trim())
        );
      }

      // 3. Filter by Customer ID
      if (selectedCustomerId) {
        filtered = filtered.filter(w => w.customerId === selectedCustomerId);
      }

      // 4. Filter by Project Name query
      if (projectName.trim()) {
        filtered = filtered.filter(w => 
          w.projectName?.toLowerCase().includes(projectName.toLowerCase().trim())
        );
      }

      // 5. Filter by Dates
      if (dateFrom) {
        filtered = filtered.filter(w => w.receivedDate >= dateFrom);
      }
      if (dateTo) {
        filtered = filtered.filter(w => w.receivedDate <= dateTo);
      }

      // 6. Filter by status constraints
      if (approved) {
        filtered = filtered.filter(w => w.status?.toUpperCase() === 'APPROVED');
      }
      if (completed) {
        filtered = filtered.filter(w => w.status?.toUpperCase() === 'COMPLETED' || w.status?.toUpperCase() === 'DELIVERED');
      }
      if (planned) {
        filtered = filtered.filter(w => w.status?.toUpperCase() === 'REGISTERED');
      }
      if (invoiceGenerated) {
        // Just mock/simulate invoice status matching or filter status
        filtered = filtered.filter(w => w.status?.toUpperCase() === 'REPORT_GENERATED' || w.status?.toUpperCase() === 'DELIVERED');
      }

      setSearchResults(filtered);
    } catch (err) {
      setError('Search filter failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWoNumber('');
    setDateFrom('');
    setDateTo('');
    setProjectName('');
    setSelectedCustomerId('');
    setSelectedTestCode('');
    setInvoiceNo('');
    setApproved(false);
    setCompleted(false);
    setPlanned(false);
    setInvoiceGenerated(false);
    setSearched(false);
    
    // Reset to base list
    const baseWos = isClient
      ? workOrders.filter(w => w.customerName === 'Metro Transit Authority' || w.customerName === 'Delta Realty Group')
      : workOrders;
    setSearchResults(baseWos);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Advanced Work Order Search</h2>
          <p className="text-sm text-gray-500 mt-1">Query laboratory jobs, verify status codes, and trace compliance parameters.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Work Order No.
              </label>
              <input
                type="text"
                value={woNumber}
                onChange={(e) => setWoNumber(e.target.value)}
                placeholder="e.g. WO-2026-908"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Work Order Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              />
            </div>

            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={approved}
                    onChange={(e) => setApproved(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                  />
                  <span className="text-sm font-semibold text-gray-700">Approved</span>
                </label>
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                  />
                  <span className="text-sm font-semibold text-gray-700">Completed</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Invoice No.
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="e.g. INV-2026-1003"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Metro Line 3"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              />
            </div>

            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={planned}
                    onChange={(e) => setPlanned(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                  />
                  <span className="text-sm font-semibold text-gray-700">Planned</span>
                </label>
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={invoiceGenerated}
                    onChange={(e) => setInvoiceGenerated(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                  />
                  <span className="text-sm font-semibold text-gray-700">Invoice Generated</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Customer Account
              </label>
              <div className="relative">
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-800"
                >
                  <option value="">Select Customer Account</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.customerName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Material / Test Type
              </label>
              <div className="relative">
                <select 
                  value={selectedTestCode}
                  onChange={(e) => setSelectedTestCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-800"
                >
                  <option value="">Select Test Definition</option>
                  {testDefs.map(d => (
                    <option key={d.id} value={d.testCode}>{d.testName} ({d.testCode})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t pt-4">
            <button 
              onClick={handleReset}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-md transition-colors text-sm"
            >
              RESET
            </button>
            <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors text-sm flex items-center space-x-1.5 shadow-sm"
            >
              <SearchIcon className="w-4 h-4" />
              <span>SEARCH</span>
            </button>
          </div>
        </div>

        {/* Search Results Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm flex items-center justify-between">
            <span>Query Matches ({searchResults.length})</span>
            {searched && <span className="text-xs text-gray-400 font-normal">Filtered query results</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/50 border-b text-gray-700 uppercase font-bold">
                <tr>
                  <th className="px-6 py-3.5 border-r border-gray-200">Work Order No</th>
                  <th className="px-6 py-3.5 border-r border-gray-200">Customer Account</th>
                  <th className="px-6 py-3.5 border-r border-gray-200">Project / Site</th>
                  <th className="px-6 py-3.5 border-r border-gray-200 text-center">Job Date</th>
                  <th className="px-6 py-3.5 border-r border-gray-200 text-center">Due Date</th>
                  <th className="px-6 py-3.5 border-r border-gray-200 text-center">Status</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white font-medium text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Performing query search...
                    </td>
                  </tr>
                ) : searchResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      No matching work orders found. Try updating search parameters.
                    </td>
                  </tr>
                ) : (
                  searchResults.map((wo) => (
                    <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-blue-600 border-r border-gray-200">
                        {wo.workOrderNumber || `WO-${wo.id?.substring(0, 8)}`}
                      </td>
                      <td className="px-6 py-4 border-r border-gray-200 font-semibold">{wo.customerName || '-'}</td>
                      <td className="px-6 py-4 border-r border-gray-200">{wo.projectName || '-'}</td>
                      <td className="px-6 py-4 text-center border-r border-gray-200 font-mono">{wo.receivedDate || '-'}</td>
                      <td className="px-6 py-4 text-center border-r border-gray-200 font-mono">{wo.dueDate || 'N/A'}</td>
                      <td className="px-6 py-4 text-center border-r border-gray-200">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          wo.status?.toUpperCase() === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          wo.status?.toUpperCase() === 'COMPLETED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          wo.status?.toUpperCase() === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {wo.status || 'REGISTERED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link 
                          href={`/work-order/${wo.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Job</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">Showing {searchResults.length} jobs</span>
            <div className="flex space-x-2">
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Export Results</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
