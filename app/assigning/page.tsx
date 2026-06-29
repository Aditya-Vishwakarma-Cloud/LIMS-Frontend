"use client";

import Layout from '@/app/components/Layout';
import { Search as SearchIcon, Filter, Save, ChevronDown, FileText, CheckCircle, Clock, AlertCircle, Loader2, Play, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sampleTestService, SampleTest, SingleTestAssignment } from '@/services/sampleTestService';
import { testDefinitionService, TestDefinition } from '@/services/testDefinitionService';
import { usersService, UserResponse } from '@/services/users.service';
import { sampleService, Sample } from '@/services/sampleService';
import StatusBadge from '../components/shared/StatusBadge';
import PriorityBadge from '../components/shared/PriorityBadge';
import ConfirmationDialog from '../components/shared/ConfirmationDialog';
import { useAuthStore } from '@/store/auth.store';

export default function AssigningPage() {
  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isLabManager = roles.includes('ROLE_LAB_MANAGER');

  const isTechnician = roles.includes('ROLE_TECHNICIAN');

  const canAssign = isSuperAdmin || isAdmin || isLabManager || isTechnician;

  const [pendingSamples, setPendingSamples] = useState<Sample[]>([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected Sample for Assignment
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [testDefinitions, setTestDefinitions] = useState<TestDefinition[]>([]);
  const [technicians, setTechnicians] = useState<UserResponse[]>([]);
  const [loadingWorkbench, setLoadingWorkbench] = useState(false);

  // Mode Selection
  const [assignmentMode, setAssignmentMode] = useState<'INITIAL' | 'ADDITIONAL' | 'REASSIGN'>('INITIAL');

  // Selected Test Specifications in Workbench
  const [assignments, setAssignments] = useState<{
    [testDefinitionId: string]: {
      checked: boolean;
      technicianId: string;
      scheduledDate: string;
      dueDate: string;
      sequenceNumber: number;
      remarks: string;
    };
  }>({});

  // Bulk Selection State
  const [checkedSampleIds, setCheckedSampleIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState({
    technicianId: '',
    scheduledDate: '',
    dueDate: '',
    remarks: ''
  });

  useEffect(() => {
    fetchPendingSamples();
    fetchTechnicians();
  }, []);

  const fetchPendingSamples = async () => {
    try {
      setLoadingSamples(true);
      const data = await sampleTestService.getPendingSamples();
      setPendingSamples(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load pending samples.');
    } finally {
      setLoadingSamples(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const techs = await usersService.getActiveTechnicians();
      setTechnicians(techs);
    } catch (err) {
      console.error('Failed to load technicians', err);
    }
  };

  const handleSelectSample = async (sample: Sample) => {
    setSelectedSample(sample);
    setError('');
    setSuccess('');
    
    try {
      setLoadingWorkbench(true);
      // Fetch definitions for this material
      const defs = await testDefinitionService.getTestDefinitionsByMaterialId(sample.materialId);
      setTestDefinitions(defs.filter(d => d.active));

      // Fetch existing assignments to pre-populate or choose mode
      const existing = await sampleTestService.getSampleTests(sample.id!);
      
      // Auto-set mode to ADDITIONAL if tests already exist
      if (existing.length > 0) {
        setAssignmentMode('ADDITIONAL');
      } else {
        setAssignmentMode('INITIAL');
      }

      // Initial assignments state mapping
      const initialMap: typeof assignments = {};
      defs.forEach((d, idx) => {
        const existItem = existing.find(e => e.testDefinitionId === d.id);
        initialMap[d.id!] = {
          checked: !!existItem || !!d.isMandatory,
          technicianId: existItem?.technicianId || '',
          scheduledDate: existItem?.scheduledDate || new Date().toISOString().split('T')[0],
          dueDate: existItem?.dueDate || '',
          sequenceNumber: existItem?.sequenceNumber || idx + 1,
          remarks: existItem?.remarks || ''
        };
      });
      setAssignments(initialMap);

    } catch (err) {
      console.error(err);
      setError('Failed to load material test definitions.');
    } finally {
      setLoadingWorkbench(false);
    }
  };

  const handleCheckboxChange = (defId: string, checked: boolean) => {
    setAssignments(prev => ({
      ...prev,
      [defId]: {
        ...prev[defId],
        checked
      }
    }));
  };

  const handleAssignmentChange = (defId: string, field: string, value: any) => {
    setAssignments(prev => ({
      ...prev,
      [defId]: {
        ...prev[defId],
        [field]: value
      }
    }));
  };

  const handleSaveAssignments = async () => {
    if (!selectedSample) return;

    // Build payload
    const selectedList: SingleTestAssignment[] = [];
    
    // Check mandatory validation in frontend
    let missingMandatoryName = '';
    testDefinitions.forEach(d => {
      const state = assignments[d.id!];
      if (d.isMandatory && (!state || !state.checked)) {
        missingMandatoryName = d.testName;
      }
      if (state && state.checked) {
        selectedList.push({
          testDefinitionId: d.id!,
          technicianId: state.technicianId || undefined,
          scheduledDate: state.scheduledDate || undefined,
          dueDate: state.dueDate || undefined,
          sequenceNumber: Number(state.sequenceNumber),
          remarks: state.remarks || undefined
        });
      }
    });

    if (missingMandatoryName) {
      setError(`Cannot save. Mandatory test "${missingMandatoryName}" must be checked.`);
      return;
    }

    if (selectedList.length === 0) {
      setError('At least one test definition must be selected.');
      return;
    }

    try {
      setLoadingWorkbench(true);
      setError('');
      await sampleTestService.assignTests(selectedSample.id!, {
        mode: assignmentMode,
        assignments: selectedList
      });
      setSuccess('Test assignments saved successfully!');
      setSelectedSample(null);
      setCheckedSampleIds([]);
      fetchPendingSamples();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to record test assignments.');
    } finally {
      setLoadingWorkbench(false);
    }
  };

  // Bulk assignments
  const handleToggleSampleCheck = (id: string) => {
    setCheckedSampleIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkedSampleIds.length === 0) return;

    try {
      setLoadingSamples(true);
      setError('');
      // Loop through each checked sample, find its definitions, and apply bulk assignment
      for (const sampleId of checkedSampleIds) {
        const sampleObj = pendingSamples.find(s => s.id === sampleId);
        if (!sampleObj) continue;

        // Fetch definitions for this material
        const defs = await testDefinitionService.getTestDefinitionsByMaterialId(sampleObj.materialId);
        const existing = await sampleTestService.getSampleTests(sampleId);
        const mode = existing.length > 0 ? 'ADDITIONAL' : 'INITIAL';

        // Apply bulk values to all active test definitions for this material
        const list: SingleTestAssignment[] = defs
          .filter(d => d.active)
          .map((d, idx) => ({
            testDefinitionId: d.id!,
            technicianId: bulkForm.technicianId || undefined,
            scheduledDate: bulkForm.scheduledDate || undefined,
            dueDate: bulkForm.dueDate || undefined,
            sequenceNumber: idx + 1,
            remarks: bulkForm.remarks || undefined
          }));

        if (list.length > 0) {
          await sampleTestService.assignTests(sampleId, {
            mode,
            assignments: list
          });
        }
      }
      setSuccess('Bulk test assignments processed successfully!');
      setIsBulkModalOpen(false);
      setCheckedSampleIds([]);
      fetchPendingSamples();
    } catch (err: any) {
      console.error(err);
      setError('Failed during bulk assignment execution.');
    } finally {
      setLoadingSamples(false);
    }
  };

  const filteredSamples = pendingSamples.filter(s =>
    s.sampleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.materialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Test Assignment Workbench</h2>
            <p className="text-sm text-gray-500 mt-1">Assign test specifications and allocate technicians to received samples.</p>
          </div>
          {checkedSampleIds.length > 0 && canAssign && (
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2 transition-all duration-300 shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Bulk Assign ({checkedSampleIds.length} Samples)</span>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left List Pane: Pending Samples */}
          <div className="xl:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-14rem)] overflow-hidden">
            <div className="p-4 border-b border-gray-200 space-y-3">
              <h3 className="font-bold text-gray-800">Pending Assignment</h3>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Pending Samples..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 text-sm"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
              {loadingSamples ? (
                <div className="text-center py-12 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                  Loading pending list...
                </div>
              ) : filteredSamples.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm italic">
                  No samples pending test assignment.
                </div>
              ) : (
                filteredSamples.map((sample) => (
                  <div 
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 relative ${
                      selectedSample?.id === sample.id 
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checkedSampleIds.includes(sample.id!)}
                          onChange={() => handleToggleSampleCheck(sample.id!)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 bg-white"
                        />
                        <span className="font-semibold text-blue-600 text-sm">{sample.sampleId}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border">
                        {sample.materialName}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p className="font-semibold text-gray-800 truncate">{sample.projectName}</p>
                      <p className="truncate text-gray-500">{sample.customerName}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t flex justify-between items-center text-[10px] text-gray-400">
                      <span>Rcvd: {sample.collectionDate || 'N/A'}</span>
                      <StatusBadge status={sample.status || 'RECEIVED'} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Allocation Pane: Assignment Workbench */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[500px]">
            {selectedSample ? (
              <>
                {/* Workbench Header */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-blue-50/55 gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Allocation Workbench</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Assign definitions, schedule target dates, and select lab tech for {selectedSample.sampleId}.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white px-2 py-1 border rounded shadow-sm text-xs">
                      <span className="font-bold text-gray-600">Mode:</span>
                      <select
                        value={assignmentMode}
                        disabled={!canAssign}
                        onChange={(e) => setAssignmentMode(e.target.value as any)}
                        className="bg-transparent border-none text-blue-600 font-bold focus:outline-none"
                      >
                        <option value="INITIAL">Initial</option>
                        <option value="ADDITIONAL">Additional</option>
                        <option value="REASSIGN">Reassign</option>
                      </select>
                    </div>
                    {canAssign && (
                      <button
                        onClick={handleSaveAssignments}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center space-x-2 transition-all duration-300 shadow-sm"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Assignments</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Workbench Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  
                  {/* Sample Metadata Card */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Sample ID</span>
                      <p className="text-sm font-bold text-gray-800">{selectedSample.sampleId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Material Type</span>
                      <p className="text-sm font-bold text-gray-800">{selectedSample.materialName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Customer</span>
                      <p className="text-sm font-bold text-gray-800 truncate">{selectedSample.customerName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400">Priority</span>
                      <div className="mt-0.5"><PriorityBadge priority={selectedSample.priority || 'Normal'} /></div>
                    </div>
                  </div>

                  {/* Active Test Definitions Grid */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-sm border-b pb-2">Material Standard Testing Procedures</h4>

                    {loadingWorkbench ? (
                      <div className="text-center py-12 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                        Fetching test definitions...
                      </div>
                    ) : testDefinitions.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No active test definitions configured for this material type.</p>
                    ) : (
                      <div className="space-y-4">
                        {testDefinitions.map((d) => {
                          const state = assignments[d.id!] || {
                            checked: !!d.isMandatory,
                            technicianId: '',
                            scheduledDate: '',
                            dueDate: '',
                            sequenceNumber: 1,
                            remarks: ''
                          };

                            return (
                            <div 
                              key={d.id} 
                              className={`p-4 border rounded-lg transition-all duration-200 ${
                                state.checked ? 'border-indigo-200 bg-indigo-50/10' : 'border-gray-200 opacity-60'
                              }`}
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Left checkbox & info */}
                                <div className="flex items-start space-x-3 md:w-1/3">
                                  <input
                                    type="checkbox"
                                    id={`check-${d.id}`}
                                    checked={state.checked}
                                    disabled={!!d.isMandatory || !canAssign}
                                    onChange={(e) => handleCheckboxChange(d.id!, e.target.checked)}
                                    className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 bg-white"
                                  />
                                  <label htmlFor={`check-${d.id}`} className="cursor-pointer">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-bold text-gray-800 text-sm">{d.testName}</span>
                                      {!!d.isMandatory && (
                                        <span className="text-[9px] uppercase font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1 rounded">
                                          Mandatory
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                                      Method: {d.method || 'Standard'} | Spec: {d.specification || 'N/A'}
                                    </span>
                                  </label>
                                </div>

                                {/* Allocation controls */}
                                {state.checked && (
                                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Tech select */}
                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Technician</label>
                                      <select
                                        value={state.technicianId}
                                        disabled={!canAssign}
                                        onChange={(e) => handleAssignmentChange(d.id!, 'technicianId', e.target.value)}
                                        className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded bg-white text-gray-800"
                                      >
                                        <option value="">Select Technician</option>
                                        {technicians.map((t) => (
                                          <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    
                                    {/* Scheduled Date */}
                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Scheduled Date</label>
                                      <input
                                        type="date"
                                        value={state.scheduledDate}
                                        disabled={!canAssign}
                                        onChange={(e) => handleAssignmentChange(d.id!, 'scheduledDate', e.target.value)}
                                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-800"
                                      />
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Due Date</label>
                                      <input
                                        type="date"
                                        value={state.dueDate}
                                        disabled={!canAssign}
                                        onChange={(e) => handleAssignmentChange(d.id!, 'dueDate', e.target.value)}
                                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-800"
                                      />
                                    </div>

                                    {/* Sequence Number */}
                                    <div className="sm:col-span-1">
                                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Seq No</label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={state.sequenceNumber}
                                        disabled={!canAssign}
                                        onChange={(e) => handleAssignmentChange(d.id!, 'sequenceNumber', Number(e.target.value))}
                                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-800"
                                      />
                                    </div>

                                    {/* Remarks */}
                                    <div className="sm:col-span-2">
                                      <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">Remarks</label>
                                      <input
                                        type="text"
                                        placeholder="Special test note..."
                                        value={state.remarks}
                                        disabled={!canAssign}
                                        onChange={(e) => handleAssignmentChange(d.id!, 'remarks', e.target.value)}
                                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-800"
                                      />
                                    </div>

                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Sample Selected</h3>
                <p className="mt-1 text-sm text-gray-400">Select a pending sample from the list to begin allocations.</p>
              </div>
            )}
          </div>

        </div>

        {/* Bulk Assignment Modal */}
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                <h3 className="text-lg font-bold">Bulk Test Assignment</h3>
                <button onClick={() => setIsBulkModalOpen(false)} className="text-white hover:text-indigo-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleBulkAssignSubmit} className="p-6 space-y-4">
                <div className="bg-indigo-50 text-indigo-700 p-3.5 rounded text-xs border border-indigo-100">
                  This will apply the selected parameters to **all standard tests** for the {checkedSampleIds.length} selected samples.
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Technician *</label>
                  <select
                    required
                    value={bulkForm.technicianId}
                    onChange={(e) => setBulkForm({ ...bulkForm, technicianId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    <option value="">Select Technician</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={bulkForm.scheduledDate}
                    onChange={(e) => setBulkForm({ ...bulkForm, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={bulkForm.dueDate}
                    onChange={(e) => setBulkForm({ ...bulkForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label>
                  <textarea
                    rows={2}
                    value={bulkForm.remarks}
                    onChange={(e) => setBulkForm({ ...bulkForm, remarks: e.target.value })}
                    placeholder="Enter instructions for tech..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsBulkModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold shadow-sm"
                  >
                    Apply Bulk Allocations
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

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
