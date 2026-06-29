"use client";

import Layout from '@/app/components/Layout';
import { Save, Send, ChevronLeft, Loader2, AlertCircle, CheckCircle, FileText, Upload, Trash2, ShieldCheck, History } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import { sampleTestService, SampleTest } from '@/services/sampleTestService';
import { testResultService, TestResult } from '@/services/testResultService';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface PageProps {
  params: Promise<{ sampleTestId: string }>;
}

export default function ResultEntryPage({ params }: PageProps) {
  const router = useRouter();
  const { sampleTestId } = use(params);

  const [sampleTest, setSampleTest] = useState<SampleTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Result Form Fields
  const [resultId, setResultId] = useState<string | null>(null);
  const [status, setStatus] = useState('DRAFT');
  const [version, setVersion] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [attachmentList, setAttachmentList] = useState<string[]>([]);
  const [newAttachment, setNewAttachment] = useState('');

  // Structured Observations & Calculations State
  const [observations, setObservations] = useState<{ [key: string]: string }>({});
  const [calculations, setCalculations] = useState<{ [key: string]: string }>({});
  const [finalResult, setFinalResult] = useState('');

  useEffect(() => {
    fetchTestDetails();
  }, [sampleTestId]);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      const test = await sampleTestService.getSampleTestById(sampleTestId);
      setSampleTest(test);

      // Attempt to load existing result details
      try {
        const res = await testResultService.getResultForSampleTest(sampleTestId);
        setResultId(res.id || null);
        setStatus(res.status || 'DRAFT');
        setVersion(res.version || 1);
        setFinalResult(res.finalResult || '');
        setRemarks(res.remarks || '');
        
        if (res.observations) {
          setObservations(JSON.parse(res.observations));
        }
        if (res.calculations) {
          setCalculations(JSON.parse(res.calculations));
        }
        if (res.attachments) {
          setAttachmentList(JSON.parse(res.attachments));
        }
      } catch (err) {
        // Result record not saved yet (no draft exists)
        setStatus('DRAFT');
        setVersion(1);
        initializeEmptyObservations(test.testCode || '');
      }

    } catch (err) {
      console.error(err);
      setError('Failed to load test details.');
    } finally {
      setLoading(false);
    }
  };

  const initializeEmptyObservations = (testCode: string) => {
    const code = testCode.toUpperCase();
    if (code.includes('SIEVE')) {
      setObservations({
        "4.75mm": "",
        "2.36mm": "",
        "1.18mm": "",
        "600μm": "",
        "300μm": "",
        "150μm": ""
      });
    } else if (code.includes('SETTING') || code.includes('TIME')) {
      setObservations({
        "Initial Setting Time (mins)": "",
        "Final Setting Time (mins)": ""
      });
    } else if (code.includes('BITUMEN') || code.includes('TRIAL')) {
      setObservations({
        "Trial 1": "",
        "Trial 2": "",
        "Trial 3": ""
      });
      setCalculations({
        "Average": ""
      });
    } else {
      setObservations({
        "Observed Metric": ""
      });
    }
  };

  const handleObservationChange = (key: string, val: string) => {
    if (isReadOnly) return;
    const updatedObs = { ...observations, [key]: val };
    setObservations(updatedObs);

    // Dynamic Client-side Calculations & Automations
    const testCode = (sampleTest?.testCode || '').toUpperCase();
    if (testCode.includes('BITUMEN') || testCode.includes('TRIAL')) {
      const t1 = Number(updatedObs["Trial 1"] || 0);
      const t2 = Number(updatedObs["Trial 2"] || 0);
      const t3 = Number(updatedObs["Trial 3"] || 0);
      const count = [t1, t2, t3].filter(x => x > 0).length;
      const avg = count > 0 ? ((t1 + t2 + t3) / count).toFixed(2) : "";
      setCalculations({ "Average": avg });
      setFinalResult(avg);
    } else if (testCode.includes('SIEVE')) {
      // Aggregate pass/fail using average pass value or keep text summary
      setFinalResult(val); // Renders the last modified sieve
    } else {
      // Standard single metrics
      setFinalResult(val);
    }
  };

  const handleAddAttachment = () => {
    if (!newAttachment.trim() || isReadOnly) return;
    setAttachmentList(prev => [...prev, newAttachment.trim()]);
    setNewAttachment('');
  };

  const handleRemoveAttachment = (idx: number) => {
    if (isReadOnly) return;
    setAttachmentList(prev => prev.filter((_, i) => i !== idx));
  };

  const evaluatePassFailClient = (): 'PASS' | 'FAIL' | 'NONE' => {
    if (!sampleTest || !finalResult) return 'NONE';
    const op = (sampleTest.specOperator || '').trim().toUpperCase();
    const spec = (sampleTest.specValue || '').trim();
    const res = finalResult.trim();

    try {
      if (op === '>=' || op === 'GE') {
        return Number(res) >= Number(spec) ? 'PASS' : 'FAIL';
      }
      if (op === '<=' || op === 'LE') {
        return Number(res) <= Number(spec) ? 'PASS' : 'FAIL';
      }
      if (op === 'BETWEEN' || op === 'RANGE') {
        const parts = spec.split(/[-_]/);
        if (parts.length === 2) {
          const low = Number(parts[0].trim());
          const high = Number(parts[1].trim());
          const numRes = Number(res);
          return (numRes >= low && numRes <= high) ? 'PASS' : 'FAIL';
        }
      }
      if (op === '==' || op === 'EQUAL') {
        return res.toLowerCase() === spec.toLowerCase() ? 'PASS' : 'FAIL';
      }
    } catch (e) {
      // Ignore
    }
    return 'NONE';
  };

  const handleSave = async (isSubmit = false) => {
    setError('');
    setSuccess('');
    
    if (!finalResult) {
      setError('A final result value must be recorded before saving.');
      return;
    }

    try {
      setSaving(true);
      
      const payload: TestResult = {
        id: resultId || undefined,
        sampleTestId: sampleTestId,
        observations: JSON.stringify(observations),
        calculations: JSON.stringify(calculations),
        finalResult: finalResult,
        remarks: remarks,
        attachments: JSON.stringify(attachmentList)
      };

      let saved: TestResult;
      if (resultId) {
        saved = await testResultService.updateDraft(resultId, payload);
      } else {
        saved = await testResultService.saveDraft(payload);
        setResultId(saved.id || null);
      }

      if (isSubmit) {
        const submitted = await testResultService.submitResult(saved.id!);
        setStatus(submitted.status || 'SUBMITTED');
        setSuccess('Test result submitted successfully to supervisor!');
      } else {
        setStatus(saved.status || 'DRAFT');
        setSuccess('Draft metrics saved successfully.');
      }
      fetchTestDetails();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save test result entries.');
    } finally {
      setSaving(false);
    }
  };

  const { user } = useAuthStore();
  const roles = user?.roles || [];
  const isSuperAdmin = roles.includes('ROLE_SUPER_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isTechnician = roles.includes('ROLE_TECHNICIAN');
  const canEditResult = isSuperAdmin || isAdmin || isTechnician;

  const isReadOnly = status === 'SUBMITTED' || status === 'UNDER_REVIEW' || status === 'VERIFIED' || status === 'APPROVED' || !canEditResult;
  const clientPF = evaluatePassFailClient();

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
          <p className="text-gray-500 text-sm">Loading allocation details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        
        {/* Navigation & Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/results')}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Result Entry Sheet</h2>
              <p className="text-xs text-gray-500 mt-0.5">Physical observations entry and calculation check.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isReadOnly ? (
              <span className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-4 py-2 border border-emerald-200 rounded-md text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Submitted (Locked)</span>
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 border border-gray-300 rounded-md font-semibold text-xs flex items-center space-x-2 transition-all duration-300 shadow-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold text-xs flex items-center space-x-2 transition-all duration-300 shadow-sm"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Result</span>
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg flex items-center space-x-3 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg flex items-center space-x-3 text-xs">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: Test Parameters Details */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="font-bold text-gray-800 border-b pb-2 text-sm">Specification Standards</h3>
            
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Sample Reference</span>
                <p className="font-mono font-bold text-blue-600 mt-0.5">{sampleTest?.sampleCode}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Test Procedure</span>
                <p className="font-bold text-gray-800 mt-0.5">{sampleTest?.testName}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">Standard Code / Method</span>
                <p className="font-bold text-gray-800 mt-0.5">{sampleTest?.method || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Target Range</span>
                  <p className="font-bold text-gray-800 mt-0.5">
                    {sampleTest?.specOperator} {sampleTest?.specValue}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Measurement Unit</span>
                  <p className="font-bold text-gray-800 mt-0.5">{sampleTest?.unit}</p>
                </div>
              </div>
              <div className="pt-2 border-t flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Audit Version</span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <History className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-bold text-gray-700">v{version}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Workflow Status</span>
                  <div className="mt-0.5">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded border ${
                      status === 'REJECTED' 
                        ? 'bg-rose-50 border-rose-200 text-rose-700' 
                        : status === 'DRAFT'
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Data Entry Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="font-bold text-gray-800 border-b pb-2 text-sm">Physical Observations Log</h3>

            {/* Dynamic Template Forms */}
            <div className="space-y-4">
              {Object.keys(observations).map((key) => (
                <div key={key} className="grid grid-cols-3 items-center gap-4">
                  <label className="col-span-1 text-xs font-semibold text-gray-700">{key}</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={observations[key]}
                      onChange={(e) => handleObservationChange(key, e.target.value)}
                      placeholder="Enter value..."
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Calculations (If Bitumen average, sieve sums, etc.) */}
            {Object.keys(calculations).length > 0 && (
              <div className="pt-4 border-t space-y-4">
                <h4 className="font-bold text-gray-700 text-xs">Calculated Intermediates</h4>
                {Object.keys(calculations).map((key) => (
                  <div key={key} className="grid grid-cols-3 items-center gap-4">
                    <span className="col-span-1 text-xs font-semibold text-gray-500">{key}</span>
                    <span className="col-span-2 font-mono font-bold text-sm text-gray-800">{calculations[key] || 'Auto-computed'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Overall Final Result and Auto Pass/Fail visual check */}
            <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Overall Final Value ({sampleTest?.unit})</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={finalResult}
                  onChange={(e) => setFinalResult(e.target.value)}
                  placeholder="Record final test outcome..."
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded font-bold bg-white text-gray-800"
                />
              </div>

              <div className="flex flex-col justify-center items-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">Evaluated Verdict</span>
                {clientPF === 'PASS' ? (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold px-6 py-2 rounded text-sm shadow-sm tracking-widest animate-pulse">
                    PASS
                  </span>
                ) : clientPF === 'FAIL' ? (
                  <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold px-6 py-2 rounded text-sm shadow-sm tracking-widest animate-pulse">
                    FAIL
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 border border-gray-300 font-extrabold px-6 py-2 rounded text-sm tracking-widest">
                    NONE
                  </span>
                )}
              </div>
            </div>

            {/* Multiple File Attachments Uploader */}
            <div className="pt-6 border-t space-y-4">
              <h4 className="font-bold text-gray-800 text-xs">Test Output Attachments</h4>
              
              {!isReadOnly && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter filename or reference link (e.g. Machine_Output.pdf)..."
                      value={newAttachment}
                      onChange={(e) => setNewAttachment(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-xs font-semibold flex items-center space-x-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              )}

              {attachmentList.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No attachments linked to this result entry sheet.</p>
              ) : (
                <div className="space-y-2">
                  {attachmentList.map((file, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded border text-xs">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-700">{file}</span>
                      </div>
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Remarks */}
            <div className="pt-6 border-t">
              <label className="block text-xs font-bold text-gray-700 mb-1">Remarks & Observations Notes</label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Write any specific notes regarding temperature, calibrations, or testing defects..."
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded bg-white text-gray-800"
              />
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}
