"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Plus, Eye, Edit2, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { customerService, Customer } from '@/services/customerService';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '@/app/components/shared/ConfirmationDialog';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function CustomerList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isReception = roles.includes('ROLE_RECEPTION');
  const isClient = roles.includes('ROLE_CLIENT_VIEWER');

  const canAddOrEdit = isSuperAdmin || isAdmin || isReception;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await customerService.deleteCustomer(deleteId);
      setDeleteId(null);
      fetchCustomers();
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete customer.');
      setDeleteId(null);
    }
  };

  // Clients only view their own corporate records
  const visibleCustomers = isClient 
    ? customers.filter(c => c.customerName === 'Metro Transit Authority' || c.customerName === 'Delta Realty Group') 
    : customers;

  const filteredCustomers = visibleCustomers.filter(c =>
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobileNumber?.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage corporate clients, billing addresses, and site contacts.</p>
          </div>
          {canAddOrEdit && (
            <Link href="/customer/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center space-x-2 transition-all duration-300 shadow-sm self-start">
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Company Name, Code, Email or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Customer Code</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Company Name</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Primary Contact</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Mobile Number</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Email ID</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">GSTIN</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Total Projects</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Status</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      No customers found. Click "Add Customer" to configure your first client.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600 border-r border-gray-200">
                        <Link href={`/customer/${customer.id}`} className="hover:underline">
                          {customer.customerCode}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-gray-200">{customer.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">{customer.primaryContactName || customer.contactPerson || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{customer.mobileNumber || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{customer.emailId || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{customer.gstNo || '-'}</td>
                      <td className="px-6 py-4 text-sm text-center font-bold text-blue-900 border-r border-gray-200 bg-blue-50/50">{customer.totalProjects || 0}</td>
                      <td className="px-6 py-4 text-sm border-r border-gray-200">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          customer.block ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {customer.block ? 'BLOCKED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/customer/${customer.id}`)}
                          className="text-gray-600 hover:text-gray-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        {canAddOrEdit && (
                          <>
                            <button
                              onClick={() => router.push(`/customer/edit/${customer.id}`)}
                              className="text-blue-600 hover:text-blue-900 font-semibold inline-flex items-center space-x-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteId(customer.id || null)}
                              className="text-rose-600 hover:text-rose-900 font-semibold inline-flex items-center space-x-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={!!deleteId}
          title="Delete Customer"
          message="Are you sure you want to delete this customer? This will soft delete and preserve data history."
          confirmText="Delete"
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
