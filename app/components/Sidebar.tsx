"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Users,
  TestTube,
  FileText,
  CheckSquare,
  FileSpreadsheet,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Briefcase,
  FileCog,
  Database,
  UserPlus,
  FileCheck,
  ClipboardCheck,
  ClipboardList
} from 'lucide-react';

import { useAuthStore } from '@/store/auth.store';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'search', label: 'Search', icon: Search, path: '/search' },
  {
    id: 'customer',
    label: 'Customer',
    icon: Users,
    path: '/customer',
    hasSubmenu: true,
    submenu: [
      { label: 'Customer list', path: '/customer/list' },
      { label: 'Add Customer', path: '/customer/add' },
      // { label: 'Country', path: '/customer/country' },
      // { label: 'State', path: '/customer/state' },
      // { label: 'City', path: '/customer/city' },
      // { label: 'Currency', path: '/customer/currency' },
      // { label: 'Area', path: '/customer/area' }
    ]
  },
  {
    id: 'project',
    label: 'Project',
    icon: Briefcase,
    path: '/project',
    hasSubmenu: true,
    submenu: [
      { label: 'Project List', path: '/project/list' },
      { label: 'Add Project', path: '/project/add' }
    ]
  },
  {
    id: 'work-order',
    label: 'Work Order',
    icon: FileCog,
    path: '/work-order',
    hasSubmenu: true,
    submenu: [
      { label: 'Work Order List', path: '/work-order/list' },
      { label: 'Add Work Order', path: '/work-order/add' }
    ]
  },
  {
    id: 'masters',
    label: 'Masters',
    icon: Database,
    path: '/masters',
    hasSubmenu: true,
    submenu: [
      { label: 'Material Master', path: '/masters/material' },
      { label: 'Test Definitions', path: '/masters/test-definition' }
    ]
  },
  {
    id: 'sample',
    label: 'Sample',
    icon: TestTube,
    path: '/sample',
    hasSubmenu: true,
    submenu: [
      { label: 'Sample List', path: '/sample' },
      { label: 'Add Sample', path: '/sample/add' }
    ]
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: FileText,
    path: '/plan',
    hasSubmenu: true,
    submenu: [
      { label: 'Plan List', path: '/plan' },
      { label: 'Add Test Plan', path: '/plan/test-plan/add' },
      { label: 'Add Sampling Plan', path: '/plan/sampling-plan/add' }
    ]
  },
  { id: 'assigning', label: 'Assigning', icon: UserPlus, path: '/assigning', hasSubmenu: false },
  { id: 'results', label: 'Results', icon: FileCheck, path: '/results', hasSubmenu: false },
  { id: 'review', label: 'Review', icon: ClipboardCheck, path: '/review', hasSubmenu: false },
  { id: 'approvals', label: 'Approvals', icon: CheckSquare, path: '/approvals', hasSubmenu: false },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports', hasSubmenu: false },
  { id: 'invoice', label: 'Invoice', icon: FileSpreadsheet, path: '/invoice', hasSubmenu: false },
  // { id: 'specifications', label: 'Specifications', icon: FileText, path: '/specifications', hasSubmenu: false }
];

const bottomItems = [
  { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isLabManager = roles.includes('ROLE_LAB_MANAGER');
  const isQualityEngineer = roles.includes('ROLE_QUALITY_ENGINEER');
  const isTechnician = roles.includes('ROLE_TECHNICIAN');
  const isClient = roles.includes('ROLE_CLIENT_VIEWER');
  const isReception = roles.includes('ROLE_RECEPTION');

  const activeMenuItems = menuItems.filter(item => {
    if (item.id === 'dashboard') return true;
    if (item.id === 'search') return !isClient || !isTechnician;
    if (item.id === 'customer') return isSuperAdmin || isAdmin || isLabManager || isClient || isReception || isQualityEngineer;
    if (item.id === 'project') return isSuperAdmin || isAdmin || isLabManager || isClient || isReception || isQualityEngineer;
    if (item.id === 'work-order') return isSuperAdmin || isAdmin || isLabManager || isClient || isReception || isQualityEngineer;
    if (item.id === 'masters') return isSuperAdmin || isAdmin || isLabManager || isQualityEngineer || isReception;
    if (item.id === 'sample') return true;
    if (item.id === 'plan') return isSuperAdmin || isAdmin || isLabManager || isTechnician;
    if (item.id === 'assigning') return isSuperAdmin || isAdmin || isLabManager || isQualityEngineer || isTechnician;
    if (item.id === 'results') return isSuperAdmin || isAdmin || isLabManager || isQualityEngineer || isTechnician;
    if (item.id === 'review') return isSuperAdmin || isAdmin || isLabManager || isQualityEngineer;
    if (item.id === 'approvals') return isSuperAdmin || isAdmin || isQualityEngineer;
    if (item.id === 'reports') return isSuperAdmin || isAdmin || isLabManager || isQualityEngineer || isClient || isReception;
    if (item.id === 'invoice') return isSuperAdmin || isAdmin || isLabManager || isClient || isReception;
    return true;
  });

  if (isSuperAdmin || isAdmin) {
    activeMenuItems.push({
      id: 'users',
      label: 'User Management',
      icon: Users,
      path: '/dashboard/users',
      hasSubmenu: false,
      submenu: undefined
    });
  }

  const processedMenuItems = activeMenuItems.map(item => {
    let label = item.label;
    if (item.id === 'assigning' && isTechnician) {
      label = 'My Tests';
    }

    if (!item.submenu) return { ...item, label };

    let filteredSubmenu = [...item.submenu];

    const canAddCustomer = isSuperAdmin || isAdmin || isReception;
    const canAddProject = isSuperAdmin || isAdmin || isReception;
    const canAddWorkOrder = isSuperAdmin || isAdmin || isReception;
    const canAddSample = isSuperAdmin || isAdmin || isLabManager || isReception;
    const canAddPlan = isSuperAdmin || isAdmin || isLabManager;

    if (item.id === 'customer' && !canAddCustomer) {
      filteredSubmenu = filteredSubmenu.filter(sub => sub.path !== '/customer/add');
    }
    if (item.id === 'project' && !canAddProject) {
      filteredSubmenu = filteredSubmenu.filter(sub => sub.path !== '/project/add');
    }
    if (item.id === 'work-order' && !canAddWorkOrder) {
      filteredSubmenu = filteredSubmenu.filter(sub => sub.path !== '/work-order/add');
    }
    if (item.id === 'sample' && !canAddSample) {
      filteredSubmenu = filteredSubmenu.filter(sub => sub.path !== '/sample/add');
    }
    if (item.id === 'plan' && !canAddPlan) {
      filteredSubmenu = filteredSubmenu.filter(sub => sub.path !== '/plan/test-plan/add' && sub.path !== '/plan/sampling-plan/add');
    }

    return { ...item, submenu: filteredSubmenu };
  });

  const activeBottomItems = bottomItems.filter(item => {
    if (item.id === 'settings') return isSuperAdmin || isAdmin;
    return true;
  });

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => pathname === path;
  const isParentActive = (item: any) => {
    if (isActive(item.path)) return true;
    if (item.submenu) {
      return item.submenu.some((sub: any) => isActive(sub.path));
    }
    return false;
  };

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    const expanded = expandedItems.includes(item.id);
    const active = isParentActive(item);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-colors ${active ? 'bg-white text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          onClick={() => {
            if (item.hasSubmenu) {
              toggleExpanded(item.id);
            } else {
              router.push(item.path);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          {item.hasSubmenu && (
            expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </div>

        {item.hasSubmenu && expanded && item.submenu && (
          <div className="bg-gray-50">
            {item.submenu.map((subItem: any) => (
              <div
                key={subItem.path}
                className={`pl-14 pr-6 py-2 cursor-pointer transition-colors ${isActive(subItem.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => router.push(subItem.path)}
              >
                {subItem.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64  flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">LIMS</h1>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          {processedMenuItems.map(renderMenuItem)}
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="border-t border-gray-200">
        {activeBottomItems.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors ${isActive(item.path) ? 'bg-white text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              onClick={() => router.push(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
