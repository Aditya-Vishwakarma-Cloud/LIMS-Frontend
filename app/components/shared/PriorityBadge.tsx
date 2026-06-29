"use client";

interface PriorityBadgeProps {
  priority: string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getColors = (p: string) => {
    switch (p.toUpperCase()) {
      case 'URGENT':
        return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${getColors(priority)} uppercase tracking-wider inline-block`}>
      {priority}
    </span>
  );
}
