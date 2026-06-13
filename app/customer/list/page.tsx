"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, ChevronDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { customerService, Customer } from '@/services/customerService';
import { useRouter } from 'next/navigation';

export default function CustomerList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobileNumber?.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="text-sm font-medium text-gray-700">Customer Name</span>
                <div className="flex items-center mt-1">
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                  <button className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md hover:bg-gray-200">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center space-x-2">
                <SearchIcon className="w-4 h-4" />
                <span>SEARCH</span>
              </button>
              <button 
                onClick={() => router.push('/customer/add')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Customer Name</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Contact Person</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Tel Number</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Mobile Number</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">GSTIN</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Area</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Block Status</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">Email ID</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">City</th>
                  <th className="text-left text-sm font-medium text-gray-700 px-4 py-3 border-r border-gray-200">State</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center text-gray-500 py-12">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-gray-500 py-12">
                      No customers found. Click "Add New" to create your first customer.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200">{customer.customerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.contactPerson || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.telephoneNumber || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.mobileNumber || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.gstNo || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.area || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.block || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.emailId || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200">{customer.city || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{customer.state || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer with scroll indicator */}
          <div className="bg-gray-50 border-t border-gray-200">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gray-400 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
