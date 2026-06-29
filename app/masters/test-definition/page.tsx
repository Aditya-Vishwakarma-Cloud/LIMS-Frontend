"use client";

import Layout from '@/app/components/Layout';
import { Plus, Edit2, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { testDefinitionService, TestDefinition } from '@/services/testDefinitionService';
import { materialService, Material } from '@/services/materialService';
import MaterialSelector from '@/app/components/shared/MaterialSelector';
import ConfirmationDialog from '@/app/components/shared/ConfirmationDialog';

export default function TestDefinitionList() {
  const [tests, setTests] = useState<TestDefinition[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter Material
  const [filterMaterialId, setFilterMaterialId] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestDefinition | null>(null);
  const [formData, setFormData] = useState({
    materialId: '',
    testName: '',
    unit: '',
    specification: '',
    method: '',
    active: true
  });

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
    fetchTests();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await materialService.getAllMaterials();
      setMaterials(data.filter(m => m.active));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await testDefinitionService.getAllTestDefinitions();
      setTests(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch test definitions.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingTest(null);
    setFormData({
      materialId: filterMaterialId || '',
      testName: '',
      unit: '',
      specification: '',
      method: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (test: TestDefinition) => {
    setEditingTest(test);
    setFormData({
      materialId: test.materialId,
      testName: test.testName,
      unit: test.unit || '',
      specification: test.specification || '',
      method: test.method || '',
      active: test.active
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialId || !formData.testName) {
      setError('Material and Test Name are required.');
      return;
    }

    try {
      if (editingTest && editingTest.id) {
        await testDefinitionService.updateTestDefinition(editingTest.id, formData);
      } else {
        await testDefinitionService.createTestDefinition(formData);
      }
      setIsModalOpen(false);
      fetchTests();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save test definition.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await testDefinitionService.deleteTestDefinition(deleteId);
      setDeleteId(null);
      fetchTests();
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete test definition.');
      setDeleteId(null);
    }
  };

  const filteredTests = filterMaterialId
    ? tests.filter(t => t.materialId === filterMaterialId)
    : tests;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Test Definition Master</h2>
            <p className="text-sm text-gray-500 mt-1">Define tests, testing specifications, and units per material type.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-56">
              <select
                value={filterMaterialId}
                onChange={(e) => setFilterMaterialId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
              >
                <option value="">Filter by Material (All)</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.materialName} ({m.materialCode})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleOpenAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-all duration-300 shadow-sm text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Test</span>
            </button>
          </div>
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
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Material</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Test Name</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Testing Unit</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Specification</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Method Reference</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Status</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Loading tests...
                    </td>
                  </tr>
                ) : filteredTests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      No test definitions configured.
                    </td>
                  </tr>
                ) : (
                  filteredTests.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-gray-200">{t.materialName} ({t.materialCode})</td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-r border-gray-200">{t.testName}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-700 border-r border-gray-200">{t.unit || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">{t.specification || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{t.method || '-'}</td>
                      <td className="px-6 py-4 text-sm border-r border-gray-200">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          t.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {t.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right space-x-3">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="text-blue-600 hover:text-blue-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteId(t.id || null)}
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
                <h3 className="text-lg font-bold">{editingTest ? 'Edit Test' : 'Add Test'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-blue-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <MaterialSelector
                  value={formData.materialId}
                  onChange={(val) => setFormData({ ...formData, materialId: val })}
                  required
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Test Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.testName}
                    onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                    placeholder="e.g. Compression 7 Days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Testing Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. N/mm² or mm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Specification</label>
                  <input
                    type="text"
                    value={formData.specification}
                    onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                    placeholder="e.g. IS:516 or ASTM C39"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Method Reference</label>
                  <input
                    type="text"
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    placeholder="e.g. UTM Compression Method"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="test-active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white"
                  />
                  <label htmlFor="test-active" className="ml-2 block text-sm font-semibold text-gray-700">
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
                    {editingTest ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmationDialog
          isOpen={!!deleteId}
          title="Delete Test Definition"
          message="Are you sure you want to delete this test definition? This action is permanent."
          confirmText="Delete"
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
}
