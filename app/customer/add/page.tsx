"use client";

import Layout from '@/app/components/Layout';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { customerService, Customer } from '@/services/customerService';
import { useRouter } from 'next/navigation';

export default function AddCustomer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    alternateAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    if (!formData.customerName.trim()) {
      alert("Customer Name is required.");
      return false;
    }
    return true;
  };

  const handleSave = async (action: 'save' | 'savenew' | 'savelist') => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await customerService.createCustomer(formData);
      alert('Customer saved successfully!'); // Use proper toast in real app
      
      if (action === 'savelist') {
        router.push('/customer/list');
      } else if (action === 'savenew') {
        // Reset form
        setFormData({
            customerName: '', aliasName: '', address: '', country: '', state: '', city: '', currency: '',
            area: '', pinCode: '', customerType: '', block: '', blockReason: '', salutations: '', contactPerson: '',
            description: '', emailId: '', mobileNumber: '', telephoneNumber: '', vendorCode: '', tallyLedgerName: '',
            gstNo: '', discount: '', gstNotApplicable: false, sez: false, serviceTaxNote: '', panNo: '', sacNo: '',
            salesManager: '', dispatchMode: '', industry: '', alternateEmailId: '', alternateMobileNo: '',
            alternateTelephoneNo: '', faxNo: '', alternateAddress: ''
        });
      } else {
        // Just save, stay on page (could redirect to edit page, but for now stay)
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header with title and action buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Customer Master</h2>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={(e) => { e.preventDefault(); handleSave('savenew'); }}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex-1 sm:flex-none disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                SAVE & NEW
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); handleSave('savelist'); }}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex-1 sm:flex-none disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                SAVE & LIST
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); handleSave('save'); }}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-md font-medium transition-colors text-sm md:text-base flex-1 sm:flex-none disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                SAVE
              </button>
            </div>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-8">
                {/* Customer Detail Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center border-b border-gray-300 pb-2">
                    Customer Detail
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        rows={4}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex space-x-6">
                        <label className="flex items-center">
                          <input type="radio" name="customerType" value="Premium" checked={formData.customerType === 'Premium'} onChange={handleChange} className="mr-2" />
                          <span className="text-sm text-gray-700">Premium Customer</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="customerType" value="Monthly" checked={formData.customerType === 'Monthly'} onChange={handleChange} className="mr-2" />
                          <span className="text-sm text-gray-700">Monthly Customer</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="customerType" value="Disable" checked={formData.customerType === 'Disable'} onChange={handleChange} className="mr-2" />
                          <span className="text-sm text-gray-700">Disable Customer</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Block
                        </label>
                        <input
                          type="text"
                          name="block"
                          value={formData.block}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center border-b border-gray-300 pb-2">
                    Contact Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salutations
                      </label>
                      <input
                        type="text"
                        name="salutations"
                        value={formData.salutations}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email ID
                      </label>
                      <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telephone Number
                      </label>
                      <input
                        type="tel"
                        name="telephoneNumber"
                        value={formData.telephoneNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Additional Detail Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center border-b border-gray-300 pb-2">
                    Additional Detail
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendor Code
                      </label>
                      <input
                        type="text"
                        name="vendorCode"
                        value={formData.vendorCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tally Ledger Name
                      </label>
                      <div className="relative">
                        <select 
                          name="tallyLedgerName"
                          value={formData.tallyLedgerName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="">Select Tally Ledger</option>
                          <option value="Ledger 1">Ledger 1</option>
                          <option value="Ledger 2">Ledger 2</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount
                        </label>
                        <input
                          type="text"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input type="checkbox" name="gstNotApplicable" checked={formData.gstNotApplicable} onChange={handleChange} className="mr-2" />
                        <span className="text-sm text-gray-700">GST Not Applicable</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" name="sez" checked={formData.sez} onChange={handleChange} className="mr-2" />
                        <span className="text-sm text-gray-700">SEZ</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Tax Note
                      </label>
                      <textarea
                        rows={3}
                        name="serviceTaxNote"
                        value={formData.serviceTaxNote}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN No
                        </label>
                        <input
                          type="text"
                          name="panNo"
                          value={formData.panNo}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SAC No
                        </label>
                        <input
                          type="text"
                          name="sacNo"
                          value={formData.sacNo}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sales Manager
                      </label>
                      <input
                        type="text"
                        name="salesManager"
                        value={formData.salesManager}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dispatch Mode
                      </label>
                      <input
                        type="text"
                        name="dispatchMode"
                        value={formData.dispatchMode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Alternate Contact Info Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center border-b border-gray-300 pb-2">
                    Alternate Contact Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Email ID
                      </label>
                      <input
                        type="email"
                        name="alternateEmailId"
                        value={formData.alternateEmailId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Mobile No.
                      </label>
                      <input
                        type="tel"
                        name="alternateMobileNo"
                        value={formData.alternateMobileNo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Telephone No
                      </label>
                      <input
                        type="tel"
                        name="alternateTelephoneNo"
                        value={formData.alternateTelephoneNo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fax No
                      </label>
                      <input
                        type="text"
                        name="faxNo"
                        value={formData.faxNo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Address
                      </label>
                      <textarea
                        rows={4}
                        name="alternateAddress"
                        value={formData.alternateAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
