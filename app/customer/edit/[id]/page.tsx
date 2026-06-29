"use client";

import Layout from '@/app/components/Layout';
import { ArrowLeft, Save, Loader2, AlertCircle, Plus, Trash } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { customerService, Customer, ContactPerson } from '@/services/customerService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EditCustomerProps {
  params: Promise<{ id: string }>;
}

export default function EditCustomer({ params }: EditCustomerProps) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Customer>({
    customerName: '',
    aliasName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    currency: '',
    area: '',
    pinCode: '',
    customerType: '',
    block: '',
    blockReason: '',
    salutations: '',
    contactPerson: '',
    description: '',
    emailId: '',
    mobileNumber: '',
    telephoneNumber: '',
    vendorCode: '',
    tallyLedgerName: '',
    gstNo: '',
    discount: '',
    gstNotApplicable: false,
    sez: false,
    serviceTaxNote: '',
    panNo: '',
    sacNo: '',
    salesManager: '',
    dispatchMode: '',
    industry: '',
    alternateEmailId: '',
    alternateMobileNo: '',
    alternateTelephoneNo: '',
    faxNo: '',
    alternateAddress: '',
    primaryContactId: '',
    contactPersons: []
  });

  // Dynamic Contact Form
  const [newContact, setNewContact] = useState({
    name: '',
    designation: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      setFetching(true);
      const data = await customerService.getCustomerById(id);
      setFormData({
        ...data,
        contactPersons: data.contactPersons || [],
        primaryContactId: data.primaryContactId || ''
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load customer details.');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;
    const updatedContacts = [...(formData.contactPersons || []), { ...newContact }];
    setFormData(prev => ({ ...prev, contactPersons: updatedContacts }));
    setNewContact({ name: '', designation: '', phone: '', email: '' });
  };

  const handleRemoveContact = (index: number) => {
    const contacts = [...(formData.contactPersons || [])];
    const removed = contacts.splice(index, 1)[0];
    const update: Partial<Customer> = { contactPersons: contacts };
    if (removed.id === formData.primaryContactId) {
      update.primaryContactId = '';
    }
    setFormData(prev => ({ ...prev, ...update }));
  };

  const validate = () => {
    if (!formData.customerName.trim()) {
      setError("Customer Name is required.");
      return false;
    }
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await customerService.updateCustomer(id, formData);
      router.push('/customer/list');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <div className="p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          Loading customer...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/customer/list" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Edit Customer</h2>
              <p className="text-sm text-gray-500 mt-1">Modify billing details, address offices and contact persons.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Customer Detail
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alias / Legal Name
                      </label>
                      <input
                        type="text"
                        name="aliasName"
                        value={formData.aliasName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Currency
                        </label>
                        <input
                          type="text"
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Area
                        </label>
                        <input
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pin Code
                        </label>
                        <input
                          type="text"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Block Status
                        </label>
                        <select
                          name="block"
                          value={formData.block}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        >
                          <option value="Active">Active</option>
                          <option value="Blocked">Blocked</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Block Reason
                        </label>
                        <input
                          type="text"
                          name="blockReason"
                          value={formData.blockReason}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Additional Detail Section */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Additional Detail
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GST No
                        </label>
                        <input
                          type="text"
                          name="gstNo"
                          value={formData.gstNo}
                          onChange={handleChange}
                          disabled={formData.gstNotApplicable}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN No
                        </label>
                        <input
                          type="text"
                          name="panNo"
                          value={formData.panNo}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input type="checkbox" name="gstNotApplicable" checked={formData.gstNotApplicable} onChange={handleChange} className="mr-2" />
                        <span className="text-sm font-semibold text-gray-700">GST Not Applicable</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" name="sez" checked={formData.sez} onChange={handleChange} className="mr-2" />
                        <span className="text-sm font-semibold text-gray-700">SEZ</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Persons (Multi contact management) */}
              <div className="space-y-6">
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 space-y-6">
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                    Contact Persons
                  </h3>

                  {/* Contact persons selector for Primary contact */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Primary Contact Representative
                    </label>
                    <select
                      name="primaryContactId"
                      value={formData.primaryContactId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    >
                      <option value="">Select Primary Contact</option>
                      {formData.contactPersons?.map((c, idx) => (
                        <option key={c.id || idx} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add New Contact inline form */}
                  <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                    <h4 className="text-sm font-bold text-gray-700">Add New Contact</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-gray-500 mb-0.5">Name *</label>
                        <input
                          type="text"
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-0.5">Designation</label>
                        <input
                          type="text"
                          value={newContact.designation}
                          onChange={(e) => setNewContact({ ...newContact, designation: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-0.5">Phone</label>
                        <input
                          type="tel"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-0.5">Email</label>
                        <input
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-800"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddContact}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 py-1.5 rounded text-xs font-semibold flex items-center justify-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to list</span>
                    </button>
                  </div>

                  {/* List of contact persons */}
                  <div className="space-y-3">
                    {formData.contactPersons?.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-2">No contacts configured.</p>
                    ) : (
                      formData.contactPersons?.map((c, index) => (
                        <div key={c.id || index} className="p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                          <div className="text-xs space-y-1">
                            <p className="font-bold text-gray-800">{c.name} {formData.primaryContactId === c.id && <span className="text-yellow-600 font-semibold">(Primary)</span>}</p>
                            <p className="text-gray-400">{c.designation || 'Representative'}</p>
                            <p className="text-gray-500">{c.phone} | {c.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveContact(index)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded transition-colors"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                </div>

                {/* Billing details */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
                    Primary Office contact details (Simple Profile)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                      <input
                        type="email"
                        name="emailId"
                        value={formData.emailId || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Site address</label>
                      <textarea
                        rows={2}
                        name="alternateAddress"
                        value={formData.alternateAddress || ''}
                        onChange={handleChange}
                        placeholder="Multiple site addresses office notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <div className="pt-4 border-t flex justify-end space-x-3">
              <Link
                href="/customer/list"
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center bg-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-sm flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
