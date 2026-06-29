"use client";

import { Bell, User, Menu, ChevronDown, Calendar, Key, LogOut, X, Lock, Loader2, Check, AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { notificationService, NotificationDto } from '@/services/notificationService';

interface HeaderProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({ toggleSidebar }: HeaderProps = {}) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [loginTime, setLoginTime] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  
  const user = useAuthStore(state => state.user);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const storedUsername = user?.name || localStorage.getItem('username') || 'User';
    const storedLoginTime = localStorage.getItem('loginTime');
    setUsername(storedUsername);
    
    if (storedLoginTime) {
      const loginDate = new Date(storedLoginTime);
      setLoginTime(loginDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      if (user?.id) {
        const data = await notificationService.getUnreadNotifications(user.id);
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      const timer = setInterval(fetchNotifications, 10000); // Poll every 10 seconds for real-time notifications
      return () => clearInterval(timer);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (user?.id) {
        await notificationService.markAllAsRead(user.id);
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    router.push('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [cpError, setCpError] = useState<string | null>(null);
  const [cpSuccess, setCpSuccess] = useState(false);
  const [isCpSubmitting, setIsCpSubmitting] = useState(false);

  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    setIsChangePasswordOpen(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setIsOtpSent(false);
    setCpError(null);
    setCpSuccess(false);
  };

  const handleSendOtp = async () => {
    if (!currentPassword) {
      setCpError("Please enter your current password to request an OTP.");
      return;
    }
    setIsSendingOtp(true);
    setCpError(null);
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.requestOtp(currentPassword);
      setIsOtpSent(true);
      setCpError(null);
    } catch (err: any) {
      setCpError(err.response?.data?.message || 'Failed to send OTP. Please verify your current password.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      setCpError("Please request and enter the OTP sent to your email first.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setCpError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setCpError("New password must be at least 6 characters.");
      return;
    }
    setIsCpSubmitting(true);
    setCpError(null);
    try {
      const { authService } = await import('@/services/auth.service');
      await authService.changePassword(currentPassword, newPassword, otp);
      setCpSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setIsOtpSent(false);
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setCpSuccess(false);
      }, 2000);
    } catch (err: any) {
      setCpError(err.response?.data?.message || 'Failed to change password. Please verify OTP and try again.');
    } finally {
      setIsCpSubmitting(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-800">Welcome Back, {username}!</h1>
              <p className="text-sm text-gray-500">{currentDate}</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[150px]">Hi, {username}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell with Dropdown Popover */}
            <div className="relative" ref={notifDropdownRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center border border-white animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden text-slate-800">
                  <div className="px-4 py-3 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Notifications ({notifications.length})</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[10px] font-extrabold text-blue-600 hover:underline uppercase"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        let priorityColor = "text-slate-400 bg-slate-50";
                        let PriorityIcon = Info;
                        if (notif.priority === 'CRITICAL') {
                          priorityColor = "text-rose-600 bg-rose-50";
                          PriorityIcon = AlertOctagon;
                        } else if (notif.priority === 'HIGH') {
                          priorityColor = "text-orange-500 bg-orange-50";
                          PriorityIcon = AlertTriangle;
                        } else if (notif.priority === 'MEDIUM') {
                          priorityColor = "text-blue-600 bg-blue-50";
                          PriorityIcon = Info;
                        }

                        return (
                          <div key={notif.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                            <div className={`p-2 rounded-lg shrink-0 ${priorityColor}`}>
                              <PriorityIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                              <h4 className="text-xs font-bold text-slate-800 truncate w-full">{notif.title}</h4>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-left w-full whitespace-normal break-words">{notif.message}</p>
                              <span className="text-[9px] text-gray-400 mt-2 block font-mono">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 shrink-0 self-start"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-gray-800 leading-tight">{username}</span>
                <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">
                  {user?.roles?.map(role => role.replace('ROLE_', '').replace('_', ' ')).join(', ')}
                </span>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center space-x-1 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={toggleDropdown}
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{username}</span>
                      </div>
                      {loginTime && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">Logged in: {loginTime}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={handleChangePassword}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        <span>Change Password</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-none">Change Password</h3>
                  <p className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase mt-1">Security Settings</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChangePasswordOpen(false)} 
                className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
              {cpSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Password changed successfully! Redirecting...
                </div>
              )}

              {cpError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  {cpError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  disabled={isOtpSent || isSendingOtp}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl text-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 transition-all shadow-sm"
                />
              </div>

              {!isOtpSent ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !currentPassword}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      'Send Verification OTP'
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-blue-800 text-xs leading-relaxed font-medium">
                    A 6-digit verification code was emailed to your registered address. Please check your inbox.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Verification OTP</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl text-sm transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl text-sm transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl text-sm transition-all shadow-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCpSubmitting || !isOtpSent}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCpSubmitting ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
