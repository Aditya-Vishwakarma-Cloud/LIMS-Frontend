"use client";

import Layout from '@/app/components/Layout';
import { Plus, Edit2, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { materialService, Material } from '@/services/materialService';
import ConfirmationDialog from '@/app/components/shared/ConfirmationDialog';

export default function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    materialCode: '',
    materialName: '',
    samplePrefix: '',
    description: '',
    active: true
  });

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await materialService.getAllMaterials();
      setMaterials(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch materials.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setFormData({
      materialCode: '',
      materialName: '',
      samplePrefix: '',
      description: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      materialCode: material.materialCode,
      materialName: material.materialName,
      samplePrefix: material.samplePrefix,
      description: material.description || '',
      active: material.active
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialCode || !formData.materialName || !formData.samplePrefix) {
      setError('Code, Name, and Sample Prefix are required.');
      return;
    }

    try {
      if (editingMaterial && editingMaterial.id) {
        await materialService.updateMaterial(editingMaterial.id, formData);
      } else {
        await materialService.createMaterial(formData);
      }
      setIsModalOpen(false);
      fetchMaterials();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save material.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await materialService.deleteMaterial(deleteId);
      setDeleteId(null);
      fetchMaterials();
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete material. It might be referenced by samples.');
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Material Master</h2>
            <p className="text-sm text-gray-500 mt-1">Configure and manage material types for sample testing.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-all duration-300 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Material</span>
          </button>
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

        {/* Table list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Material Code</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Material Name</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Sample ID Prefix</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Description</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Status</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Loading materials...
                    </td>
                  </tr>
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No materials found. Configure a material to get started.
                    </td>
                  </tr>
                ) : (
                  materials.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-gray-200">{m.materialCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-r border-gray-200">{m.materialName}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-700 border-r border-gray-200">{m.samplePrefix}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200 max-w-xs truncate">{m.description || '-'}</td>
                      <td className="px-6 py-4 text-sm border-r border-gray-200">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          m.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {m.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right space-x-3">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="text-blue-600 hover:text-blue-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteId(m.id || null)}
                          className="text-rose-600 hover:text-rose-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <h3 className="text-lg font-bold">{editingMaterial ? 'Edit Material' : 'Add Material'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-blue-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Material Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingMaterial}
                    value={formData.materialCode}
                    onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}
                    placeholder="e.g. CON"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.materialName}
                    onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                    placeholder="e.g. Concrete"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sample ID Prefix *</label>
                  <input
                    type="text"
                    required
                    value={formData.samplePrefix}
                    onChange={(e) => setFormData({ ...formData, samplePrefix: e.target.value })}
                    placeholder="e.g. CON"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description of the material type..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="material-active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white"
                  />
                  <label htmlFor="material-active" className="ml-2 block text-sm font-semibold text-gray-700">
                    Active
                  </label>
                </div>

                <div className="pt-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-sm"
                  >
                    {editingMaterial ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmationDialog
          isOpen={!!deleteId}
          title="Delete Material"
          message="Are you sure you want to delete this material? This action is permanent and cannot be undone."
          confirmText="Delete"
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
}
