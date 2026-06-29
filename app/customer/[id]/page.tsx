"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Loader2, Mail, Phone, MapPin, ClipboardList, Layers, Beaker, Plus, Star } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { customerService, Customer } from '@/services/customerService';
import { projectService, Project } from '@/services/projectService';
import Link from 'next/link';

interface CustomerDetailsProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetails({ params }: CustomerDetailsProps) {
  const { id } = use(params);
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const custData = await customerService.getCustomerById(id);
      setCustomer(custData);

      const projData = await projectService.getProjectsByCustomerId(id);
      setProjects(projData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          Loading customer details...
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return (
      <Layout>
        <div className="p-6 text-center text-red-500 font-semibold">
          Customer not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Back and Title */}
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/customer/list" className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-white border">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{customer.customerCode}</span>
            <h2 className="text-2xl font-bold text-gray-800">{customer.customerName}</h2>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Summary Cards */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Projects</p>
              <h4 className="text-2xl font-bold text-gray-800 mt-1">{customer.totalProjects || 0}</h4>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Work Orders</p>
              <h4 className="text-2xl font-bold text-gray-800 mt-1">{customer.totalWorkOrders || 0}</h4>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
              <Beaker className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Samples Tested</p>
              <h4 className="text-2xl font-bold text-gray-800 mt-1">{customer.totalSamples || 0}</h4>
            </div>
          </div>

        </div>

        {/* Main Details and Contacts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Details Card */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Corporate profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">GSTIN / Tax ID</span>
                  <span className="font-semibold text-gray-800">{customer.gstNo || 'GST Not Applicable'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">PAN Number</span>
                  <span className="font-semibold text-gray-800">{customer.panNo || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Industry</span>
                  <span className="font-semibold text-gray-800">{customer.industry || 'General construction'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Customer Type</span>
                  <span className="font-semibold text-gray-800">{customer.customerType || 'Regular'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Tally Ledger Reference</span>
                  <span className="font-semibold text-gray-800">{customer.tallyLedgerName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Sales Manager</span>
                  <span className="font-semibold text-gray-800">{customer.salesManager || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Addresses</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">Billing Office Address</span>
                    <p className="text-gray-800 font-medium mt-0.5">{customer.address || 'No billing address specified.'}</p>
                    <p className="text-gray-500 mt-0.5">{customer.city}, {customer.state} - {customer.pinCode}, {customer.country}</p>
                  </div>
                </div>
                {customer.alternateAddress && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-gray-400 font-bold block">Site / Delivery Office Address</span>
                      <p className="text-gray-800 font-medium mt-0.5">{customer.alternateAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Persons list */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Contact Persons</h3>
              <div className="space-y-4">
                {customer.contactPersons?.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center italic py-4">No contact persons configured.</p>
                ) : (
                  customer.contactPersons?.map((c) => (
                    <div key={c.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col space-y-1.5 relative">
                      {customer.primaryContactId === c.id && (
                        <span className="absolute top-2 right-2 text-yellow-500 flex items-center space-x-0.5 text-xs font-semibold bg-yellow-50 border border-yellow-200 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-yellow-500" />
                          <span>Primary</span>
                        </span>
                      )}
                      <p className="text-sm font-bold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{c.designation || 'Contact Representative'}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{c.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{c.email || 'No email'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Associated Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Projects Configured</h3>
            <Link href={`/project/add?customerId=${customer.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Configure New Project</span>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-white">
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Project Code</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Site Location</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Completion</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                      No Projects configured under this Customer.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        <Link href={`/project/${p.id}`} className="hover:underline">
                          {p.projectCode}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{p.projectName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.location || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.expectedCompletion || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          p.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        <Link href={`/project/${p.id}`} className="text-blue-600 hover:text-blue-900">
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
