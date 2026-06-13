"use client";

import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import RouteGuard from '../../components/RouteGuard';
import { 
  usersService, 
  UserResponse, 
  UserCreateRequest, 
  UserUpdateRequest 
} from '@/services/users.service';
import { 
  Search, 
  Plus, 
  Edit2, 
  Key, 
  Trash2, 
  Shield, 
  X, 
  Check, 
  Loader2, 
  Lock, 
  RefreshCw,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected / Active User data for modals
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<UserCreateRequest>({
    name: '',
    email: '',
    password: '',
    status: 'ACTIVE',
    roles: ['ROLE_CLIENT_VIEWER']
  });

  const [editForm, setEditForm] = useState<UserUpdateRequest>({
    name: '',
    status: 'ACTIVE',
    roles: []
  });

  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Users
  const fetchUsers = useCallback(async (query: string = '') => {
    setIsLoading(true);
    setError(null);
    try {
      let data: UserResponse[];
      if (query.trim()) {
        data = await usersService.searchUsers(query);
      } else {
        data = await usersService.getAllUsers();
      }
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const triggerSearch = () => {
    fetchUsers(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  // Toast helper
  const showToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  // Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.createUser(createForm);
      showToast('User created successfully.');
      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        status: 'ACTIVE',
        roles: ['ROLE_CLIENT_VIEWER']
      });
      fetchUsers(searchQuery);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit User
  const openEditModal = (user: UserResponse) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      status: user.status,
      roles: [...user.roles]
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.updateUser(selectedUser.id, editForm);
      showToast('User updated successfully.');
      setIsEditModalOpen(false);
      fetchUsers(searchQuery);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Password
  const openPasswordModal = (user: UserResponse) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.updatePassword(selectedUser.id, newPassword);
      showToast(`Password updated for user: ${selectedUser.email}`);
      setIsPasswordModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete User
  const openDeleteModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await usersService.deleteUser(selectedUser.id);
      showToast('User deleted successfully.');
      setIsDeleteModalOpen(false);
      fetchUsers(searchQuery);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Role style mapping
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ROLE_ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ROLE_LAB_MANAGER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ROLE_QUALITY_ENGINEER':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'ROLE_TECHNICIAN':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRoleDisplayName = (role: string) => {
    return role.replace('ROLE_', '').replace('_', ' ');
  };

  const toggleRoleSelection = (role: string, isEdit: boolean = false) => {
    if (isEdit) {
      setEditForm(prev => {
        const roles = prev.roles.includes(role)
          ? prev.roles.filter(r => r !== role)
          : [...prev.roles, role];
        return { ...prev, roles };
      });
    } else {
      setCreateForm(prev => {
        const roles = prev.roles.includes(role)
          ? prev.roles.filter(r => r !== role)
          : [...prev.roles, role];
        return { ...prev, roles };
      });
    }
  };

  const availableRoles = [
    'ROLE_ADMIN',
    'ROLE_LAB_MANAGER',
    'ROLE_QUALITY_ENGINEER',
    'ROLE_TECHNICIAN',
    'ROLE_CLIENT_VIEWER'
  ];

  return (
    <RouteGuard>
      <Layout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
              <p className="text-sm text-slate-500 mt-1">Admin Panel: Control system access, manage roles, and reset credentials.</p>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Success & Error alerts */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-sm animate-fade-in shadow-sm">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-800 text-sm animate-fade-in shadow-sm">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="font-semibold">{error}</div>
            </div>
          )}

          {/* Search bar & Controls */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200/80 rounded-xl text-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              onClick={triggerSearch}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
            >
              Search
            </button>
            <button
              onClick={() => { setSearchQuery(''); fetchUsers(''); }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all"
              title="Refresh users"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Users Table Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Roles</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-500">
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                          <span>Loading accounts...</span>
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400 font-medium">
                        No user accounts found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 text-sm">{user.name}</div>
                              <div className="text-slate-400 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <span 
                                key={role}
                                className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${getRoleBadgeClass(role)}`}
                              >
                                {getRoleDisplayName(role)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.status === 'ACTIVE' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                              title="Edit user details"
                            >
                              <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => openPasswordModal(user)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Override user password"
                            >
                              <Key className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete account"
                              disabled={user.roles.includes('ROLE_SUPER_ADMIN')}
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CREATE MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-200/60">
                <h3 className="font-extrabold text-slate-800 text-lg">Create New User Account</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Initial Password</label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Account Status</label>
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({...createForm, status: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Assign Roles</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableRoles.map((role) => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleRoleSelection(role, false)}
                        className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold rounded-xl transition-all ${
                          createForm.roles.includes(role) 
                            ? 'bg-blue-50 border-blue-400 text-blue-600' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>{getRoleDisplayName(role)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-200/60">
                <h3 className="font-extrabold text-slate-800 text-lg">Edit User Details</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Assign Roles</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableRoles.map((role) => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggleRoleSelection(role, true)}
                        className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold rounded-xl transition-all ${
                          editForm.roles.includes(role) 
                            ? 'bg-blue-50 border-blue-400 text-blue-600' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>{getRoleDisplayName(role)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PASSWORD RESET MODAL */}
        {isPasswordModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-800 text-lg">Reset Password</h3>
                </div>
                <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-blue-800 text-xs leading-relaxed">
                  You are overriding the password for <strong className="font-bold">{selectedUser.name}</strong> ({selectedUser.email}). Please communicate the new password securely after update.
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newPassword}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM MODAL */}
        {isDeleteModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-6 py-4 bg-rose-50 border-b border-rose-100">
                <div className="flex items-center gap-2 text-rose-800">
                  <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
                  <h3 className="font-extrabold text-lg">Deactivate Account</h3>
                </div>
                <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Are you sure you want to deactivate <strong className="font-bold">{selectedUser.name}</strong> ({selectedUser.email})?
                  The user will be soft-deleted and will lose all access to the system.
                </p>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Deactivating...' : 'Confirm Deactivation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </RouteGuard>
  );
}
