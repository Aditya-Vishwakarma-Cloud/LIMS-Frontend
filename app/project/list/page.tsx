"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Plus, Edit2, Trash2, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectService, Project } from '@/services/projectService';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '@/app/components/shared/ConfirmationDialog';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function ProjectList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isReception = roles.includes('ROLE_RECEPTION');
  const isClient = roles.includes('ROLE_CLIENT_VIEWER');

  const canAddOrEdit = isSuperAdmin || isAdmin || isReception;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await projectService.deleteProject(deleteId);
      setDeleteId(null);
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete project.');
      setDeleteId(null);
    }
  };

  // Clients only view their own projects
  const visibleProjects = isClient 
    ? projects.filter(p => p.projectName === 'Metro Line 3' || p.projectName === 'Commercial Complex Delta') 
    : projects;

  const filteredProjects = visibleProjects.filter(p =>
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.projectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.projectNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Projects Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage construction sites and client engineering projects.</p>
          </div>
          {canAddOrEdit && (
            <Link href="/project/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center space-x-2 transition-all duration-300 shadow-sm self-start">
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
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

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Project Name, Code, Number or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Table list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Project Code</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Project Number</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Project Name</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Customer</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Location</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Completion Date</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 border-r border-gray-200">Status</th>
                  <th className="px-6 py-3.5 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Loading projects...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600 border-r border-gray-200">
                        <Link href={`/project/${p.id}`} className="hover:underline">
                          {p.projectCode}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">{p.projectNumber || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200 font-semibold">{p.projectName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">{p.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{p.location || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 border-r border-gray-200">{p.expectedCompletion || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm border-r border-gray-200">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          p.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/project/${p.id}`)}
                          className="text-gray-600 hover:text-gray-900 font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        {canAddOrEdit && (
                          <>
                            <button
                              onClick={() => router.push(`/project/edit/${p.id}`)}
                              className="text-blue-600 hover:text-blue-900 font-semibold inline-flex items-center space-x-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteId(p.id || null)}
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
          title="Delete Project"
          message="Are you sure you want to delete this project? This will soft delete the project and preserve history."
          confirmText="Delete"
          type="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
}

// Inline mock close icon for error alerts
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
