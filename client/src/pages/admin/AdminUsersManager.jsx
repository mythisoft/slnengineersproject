import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  KeyRound,
  Shield,
  ShieldCheck,
  Edit2,
  Trash2,
  Search,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Mail,
  User,
  Clock,
  RefreshCw,
  Check,
} from 'lucide-react';
import { fetchApi } from '../../utils/api';

export default function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Currently logged-in super admin (from localStorage or api)
  const [currentAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sln_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Toast notification
  const [toast, setToast] = useState({ text: '', type: '' });
  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 4000);
  };

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    isActive: true,
  });
  const [createShowPassword, setCreateShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Edit Form State
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    role: 'admin',
    isActive: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Load all users from backend API
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/admin/users');
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        showToast(res.message || 'Failed to load users', 'error');
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
      showToast(err.message || 'Error loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: users.length,
      superAdmins: users.filter((u) => u.role === 'superadmin').length,
      admins: users.filter((u) => u.role === 'admin').length,
      active: users.filter((u) => u.isActive).length,
    };
  }, [users]);

  // ==================== CREATE USER ====================
  const handleOpenCreateModal = () => {
    setCreateForm({
      username: '',
      email: '',
      password: '',
      role: 'admin',
      isActive: true,
    });
    setCreateShowPassword(false);
    setCreateError('');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!createForm.username.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setCreateError('Username, email, and initial password are all required.');
      return;
    }

    if (createForm.password.length < 6) {
      setCreateError('Password must be at least 6 characters long.');
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetchApi('/admin/users', {
        method: 'POST',
        body: JSON.stringify(createForm),
      });

      if (res.success && res.data) {
        showToast(`Administrator "${res.data.username}" created successfully!`);
        setShowCreateModal(false);
        await loadUsers();
      } else {
        setCreateError(res.message || 'Failed to create user.');
      }
    } catch (err) {
      setCreateError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsCreating(false);
    }
  };

  // ==================== EDIT USER ====================
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'admin',
      isActive: user.isActive !== false,
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditError('');

    setIsUpdating(true);
    try {
      const res = await fetchApi(`/admin/users/${selectedUser._id || selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });

      if (res.success) {
        showToast(`User "${editForm.username}" updated successfully!`);
        setShowEditModal(false);
        await loadUsers();
      } else {
        setEditError(res.message || 'Failed to update user.');
      }
    } catch (err) {
      setEditError(err.message || 'Error updating user.');
    } finally {
      setIsUpdating(false);
    }
  };

  // ==================== CHANGE PASSWORD (KEY ACTION) ====================
  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordForm({
      newPassword: '',
      confirmPassword: '',
    });
    setShowNewPassword(false);
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setPasswordError('');

    const { newPassword, confirmPassword } = passwordForm;

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetchApi(`/admin/users/${selectedUser._id || selectedUser.id}/password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword }),
      });

      if (res.success) {
        showToast(`Password for "${selectedUser.username}" was updated successfully!`);
        setShowPasswordModal(false);
      } else {
        setPasswordError(res.message || 'Failed to update password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ==================== DELETE USER ====================
  const handleDeleteUser = async (user) => {
    const isCurrent =
      currentAdminUser &&
      (user._id === currentAdminUser.id || user.username === currentAdminUser.username);

    if (isCurrent) {
      alert('You cannot delete your own currently logged-in account.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete administrator "${user.username}" (${user.email})?\n\nThis will permanently revoke all access for this user.`
      )
    ) {
      return;
    }

    try {
      const res = await fetchApi(`/admin/users/${user._id || user.id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        showToast(`Administrator "${user.username}" deleted successfully.`);
        await loadUsers();
      } else {
        showToast(res.message || 'Failed to delete user.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting user.', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toast.text && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white transition-all ${
            toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <KeyRound size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Admin Accounts & Passwords</h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                  Super Admin Exclusive
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Manage administrative access, create staff credentials, and instantly change or reset passwords for any administrator.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={loadUsers}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Refresh users"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors"
            >
              <UserPlus size={16} />
              <span>Create New Admin</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Accounts</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
          </div>
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Super Admins</div>
            <div className="text-2xl font-black text-purple-900 mt-1">{stats.superAdmins}</div>
          </div>
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Standard Admins</div>
            <div className="text-2xl font-black text-blue-900 mt-1">{stats.admins}</div>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Active Status</div>
            <div className="text-2xl font-black text-emerald-900 mt-1">{stats.active}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:outline-hidden focus:border-purple-500"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Standard Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Admin User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
                    Loading administrator accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No administrators found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent =
                    currentAdminUser &&
                    (user._id === currentAdminUser.id || user.username === currentAdminUser.username);

                  return (
                    <tr key={user._id || user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Username + Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 uppercase ${
                              user.role === 'superadmin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {user.username?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{user.username}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-black uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Added {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {user.email}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        {user.role === 'superadmin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            <ShieldCheck size={12} />
                            Super Admin
                          </span>
                        ) : user.role === 'staff' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Staff
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <Shield size={12} />
                            Admin
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {user.lastLogin ? (
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {new Date(user.lastLogin).toLocaleString(undefined, {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Never</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Change Password Button */}
                          <button
                            onClick={() => handleOpenPasswordModal(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                            title="Change this administrator's password"
                          >
                            <KeyRound size={13} />
                            <span>Change Password</span>
                          </button>

                          {/* Edit User Button */}
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit details & role"
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Delete Button (disabled for self) */}
                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={isCurrent}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isCurrent
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                            }`}
                            title={isCurrent ? 'Cannot delete yourself' : 'Delete user'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== MODAL: CHANGE PASSWORD ==================== */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-purple-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-800 flex items-center justify-center">
                  <KeyRound size={20} className="text-purple-200" />
                </div>
                <div>
                  <h3 className="text-base font-black">Change Administrator Password</h3>
                  <p className="text-xs text-purple-200">
                    Set a new password for <span className="font-bold underline">{selectedUser.username}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 text-purple-200 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="text-slate-500">Target Account:</div>
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{selectedUser.username} ({selectedUser.email})</span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password (min. 6 characters)"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <span className="font-bold text-amber-800">Note: </span>
                As Super Admin, you can set this password directly. The administrator can immediately log in with this new password.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  <KeyRound size={15} />
                  <span>{isChangingPassword ? 'Updating Password...' : 'Save & Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: CREATE ADMIN USER ==================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                  <UserPlus size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">Create Administrator Account</h3>
                  <p className="text-xs text-slate-400">Add a new staff member or super admin</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {createError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. joshua_admin"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. admin@slnengineers.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Initial Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={createShowPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setCreateShowPassword(!createShowPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {createShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600"
                  >
                    <option value="admin">Admin (Standard)</option>
                    <option value="superadmin">Super Admin (Full Access)</option>
                    <option value="staff">Staff Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Status</label>
                  <select
                    value={createForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.value === 'true' })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:border-purple-600"
                  >
                    <option value="true">Active (Can Login)</option>
                    <option value="false">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  <UserPlus size={15} />
                  <span>{isCreating ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT USER ==================== */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Edit2 size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">Edit Administrator</h3>
                  <p className="text-xs text-slate-400">Update username, email, role, and active status</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-blue-600 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-blue-600 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:border-blue-600"
                  >
                    <option value="admin">Admin (Standard)</option>
                    <option value="superadmin">Super Admin (Full Access)</option>
                    <option value="staff">Staff Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Status</label>
                  <select
                    value={editForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:border-blue-600"
                  >
                    <option value="true">Active (Can Login)</option>
                    <option value="false">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  <Check size={15} />
                  <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
