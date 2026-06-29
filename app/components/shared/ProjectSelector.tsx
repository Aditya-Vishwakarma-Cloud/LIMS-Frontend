"use client";

import { useEffect, useState } from 'react';
import { projectService, Project } from '@/services/projectService';
import { ChevronDown, Loader2 } from 'lucide-react';

interface ProjectSelectorProps {
  customerId?: string;
  value: string;
  onChange: (projectId: string) => void;
  error?: string;
  required?: boolean;
}

export default function ProjectSelector({ customerId, value, onChange, error, required = false }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customerId) {
      setProjects([]);
      onChange('');
      return;
    }

    setLoading(true);
    projectService.getProjectsByCustomerId(customerId)
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects for customer', err);
        setLoading(false);
      });
  }, [customerId]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Project {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {loading ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin mr-2 text-blue-500" />
            Loading projects...
          </div>
        ) : (
          <>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={!customerId}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 ${
                error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
              }`}
            >
              <option value="">{customerId ? 'Select Project' : 'Select Customer First'}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName} {p.projectCode ? `(${p.projectCode})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
