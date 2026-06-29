"use client";

import { useEffect, useState, Suspense } from 'react';
import Layout from '@/app/components/Layout';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { sampleService } from '@/services/sampleService';
import { workOrderService, WorkOrder } from '@/services/workOrderService';
import { usersService, UserResponse } from '@/services/users.service';
import MaterialSelector from '@/app/components/shared/MaterialSelector';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RegisterSampleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryWorkOrderId = searchParams.get('workOrderId') || '';

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);

  const [formData, setFormData] = useState({
    workOrderId: queryWorkOrderId,
    materialId: '',
    quantity: 1,
    unit: 'Nos',
    collectionDate: new Date().toISOString().split('T')[0],
    collectionLocation: '',
    collectedById: '',
    priority: 'Normal',
    remarks: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setFetching(true);
      const [woData, usersData] = await Promise.all([
        workOrderService.getAllWorkOrders(),
        usersService.getAllUsers()
      ]);
      setWorkOrders(woData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch initialization data.');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workOrderId || !formData.materialId || !formData.quantity) {
      setError('Work Order, Material Type and Quantity are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await sampleService.createSample({
        ...formData,
        quantity: Number(formData.quantity)
      });
      router.push('/sample');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to register sample.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
        Loading registration forms...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/sample" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Register Sample</h2>
          <p className="text-sm text-gray-500 mt-1">Submit physical material samples for laboratory workflows.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Work Order Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Work Order *</label>
            <select
              value={formData.workOrderId}
              onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            >
              <option value="">Select Work Order</option>
              {workOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  {wo.workOrderNumber} ({wo.customerName} - {wo.projectName})
                </option>
              ))}
            </select>
          </div>

          {/* Material Selector */}
          <MaterialSelector
            value={formData.materialId}
            onChange={(val) => setFormData({ ...formData, materialId: val })}
            required
          />

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            >
              <option value="Nos">Nos</option>
              <option value="Cubes">Cubes</option>
              <option value="kg">kg</option>
              <option value="Cylinder">Cylinder</option>
              <option value="Litres">Litres</option>
            </select>
          </div>

          {/* Collection Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Collection Date</label>
            <input
              type="date"
              value={formData.collectionDate}
              onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

          {/* Collection Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Collection Location</label>
            <input
              type="text"
              placeholder="e.g. Pillar 44, Mix Design A"
              value={formData.collectionLocation}
              onChange={(e) => setFormData({ ...formData, collectionLocation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

          {/* Collected By (User Selector) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Collected By (Technician)</label>
            <select
              value={formData.collectedById}
              onChange={(e) => setFormData({ ...formData, collectedById: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            >
              <option value="">Select Technician</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes / Remarks</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Any other instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
          </div>

        </div>

        <div className="pt-4 border-t flex justify-end space-x-3">
          <Link
            href="/sample"
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center"
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
            <span>Register Sample</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddSample() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <Suspense fallback={
          <div className="p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
            Loading page...
          </div>
        }>
          <RegisterSampleForm />
        </Suspense>
      </div>
    </Layout>
  );
}
