"use client";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = (s: string) => {
    switch (s.toUpperCase()) {
      // Work Order Statuses
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'COMPLETED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-700 border-gray-300';

      // Sample Statuses
      case 'REGISTERED':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'RECEIVED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'ASSIGNED':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'TESTING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REVIEW':
        return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REPORT_GENERATED':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'DELIVERED':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'ARCHIVED':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const formattedStatus = status.replace('_', ' ');

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getColors(status)} uppercase tracking-wider transition-all duration-300 hover:brightness-95 hover:shadow-xs inline-block`}>
      {formattedStatus}
    </span>
  );
}
