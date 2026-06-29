"use client";

import { useEffect, useState } from 'react';
import { materialService, Material } from '@/services/materialService';
import { ChevronDown, Loader2 } from 'lucide-react';

interface MaterialSelectorProps {
  value: string;
  onChange: (materialId: string) => void;
  error?: string;
  required?: boolean;
}

export default function MaterialSelector({ value, onChange, error, required = false }: MaterialSelectorProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    materialService.getAllMaterials()
      .then(data => {
        setMaterials(data.filter(m => m.active));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load materials', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Material Type {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {loading ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin mr-2 text-blue-500" />
            Loading materials...
          </div>
        ) : (
          <>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-800 ${
                error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'
              }`}
            >
              <option value="">Select Material Type</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.materialName} ({m.materialCode})
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
