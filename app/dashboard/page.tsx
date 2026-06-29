"use client";

import Layout from "../components/Layout";
import RouteGuard from "../components/RouteGuard";
import { useAuthStore } from "@/store/auth.store";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { dashboardService, DashboardStats } from "../../services/dashboardService";
import {
  Users, Building, Briefcase, FileText, Beaker, CheckCircle, Clock,
  AlertCircle, Shield, Database, Activity, RefreshCw, BarChart2,
  Calendar as CalendarIcon, ArrowRight, UserPlus, FileCheck, XCircle,
  Trash2, Play, Download, Receipt, Award, Info, Bell, Plus, CheckSquare
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuthStore();
  const roles = user?.roles || [];

  const [stats, setStats] = useState<DashboardStats | null>(null);

  const isSuperAdmin = roles.includes("ROLE_SUPER_ADMIN");
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isReception = roles.includes("ROLE_RECEPTION");
  const isLabManager = roles.includes("ROLE_LAB_MANAGER");
  const isTechnician = roles.includes("ROLE_TECHNICIAN");
  const isQE = roles.includes("ROLE_QUALITY_ENGINEER");
  const isClient = roles.includes("ROLE_CLIENT_VIEWER");

  // Notifications state
  const [notifications, setNotifications] = useState<string[]>([]);

  // useEffect(() => {
  //   if (isSuperAdmin) {
  //     setNotifications([
  //       "SYSTEM ALERT: Automatic daily backup completed successfully at 01:00 AM.",
  //       "LICENSE EXPIRY: Platform subscription is active. Next renewal date: June 2027.",
  //       "SERVER HEALTH: PostgreSQL Database load is at 8% utilization. CPU temperature normal (42°C)."
  //     ]);
  //   } else if (isReception) {
  //     setNotifications([
  //       "TODAY'S SAMPLES: 3 new material core shipments registered and awaiting receipt verification.",
  //       "PENDING REGISTRATIONS: Apex Work Order WO-2026-908 has 2 samples with missing material grades."
  //     ]);
  //   } else if (isLabManager) {
  //     setNotifications([
  //       "SAMPLE PENDING ASSIGNMENT: 5 new concrete cube samples received and awaiting test definition scheduling.",
  //       "TESTS OVERDUE: 2 compressive strength testing cycles have passed their scheduled target date.",
  //       "REPORTS READY: 3 laboratory test results verified by QA and ready for final PDF generation."
  //     ]);
  //   } else if (isTechnician) {
  //     setNotifications([
  //       "TESTS ASSIGNED: 4 new concrete core compressive tests allocated to your workbench.",
  //       "DUE TODAY: 1 Slump Cone Test is due before laboratory closure at 06:00 PM."
  //     ]);
  //   } else if (isQE) {
  //     setNotifications([
  //       "RESULTS AWAITING REVIEW: 8 technician test records submitted and pending quality audit verification."
  //     ]);
  //   } else if (isClient) {
  //     setNotifications([
  //       "REPORT READY: Verified Testing Report for Metro Core Slab (ID: RP-9981) is ready for download.",
  //       "INVOICE GENERATED: Tax Invoice INV-2026-1003 has been issued for your active work orders.",
  //       "SAMPLE RECEIVED: 3 soil classification mix samples received by laboratory reception."
  //     ]);
  //   } else {
  //     setNotifications(["Welcome to WeMurz LIMS Platform. Check your active workspaces."]);
  //   }
  // }, [isSuperAdmin, isReception, isLabManager, isTechnician, isQE, isClient]);

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const data = await dashboardService.getStats();
          setStats(data);
        } catch (error) {
          console.error("Error fetching dashboard statistics:", error);
        }
      };
      fetchStats();
    }
  }, [user]);

  if (isLoading || !user) {
    return null;
  }

  // 1. Render Summary Cards based on Role/Permissions
  const renderSummaryCards = () => {
    if (isSuperAdmin) {
      const systemUsersVal = stats ? `${stats.totalSystemUsers} Active` : "Loading...";
      const activeCustomersVal = stats ? `${stats.activeCustomers} Clients` : "Loading...";
      const totalProjectsVal = stats ? `${stats.totalProjects} Active` : "Loading...";
      const registeredSamplesVal = stats ? stats.totalRegisteredSamples.toLocaleString() : "Loading...";
      const activeTestsVal = stats ? `${stats.todayActiveTests} Tests` : "Loading...";
      const pendingQAReviewsVal = stats ? `${stats.pendingQAReviews} Records` : "Loading...";
      const generatedReportsVal = stats ? `${stats.reportsReleasedToday} PDFs` : "Loading...";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardItem icon={Building} title="Total Laboratories" value="3 Active" desc="Platform Workspaces" color="blue" />
          <CardItem icon={Users} title="Total System Users" value={systemUsersVal} desc="All Seeded Roles" color="indigo" />
          <CardItem icon={Users} title="Active Customers" value={activeCustomersVal} desc="Engineering Corps" color="emerald" />
          <CardItem icon={Briefcase} title="Total Projects" value={totalProjectsVal} desc="Construction Sites" color="teal" />
          <CardItem icon={Beaker} title="Total Registered Samples" value={registeredSamplesVal} desc="Aggregate LIMS Store" color="purple" />
          <CardItem icon={Activity} title="Today's Active Tests" value={activeTestsVal} desc="In Lab Workbenches" color="amber" />
          <CardItem icon={Clock} title="Pending QA Reviews" value={pendingQAReviewsVal} desc="Awaiting Quality Verification" color="rose" />
          <CardItem icon={FileText} title="Generated Reports" value={generatedReportsVal} desc="Certified Releases" color="indigo" />
        </div>
      );
    }

    if (isAdmin) {
      const todaySamplesVal = stats ? `${stats.todaySamples} Received` : "Loading...";
      const pendingAssignmentsVal = stats ? `${stats.pendingAssignments} Samples` : "Loading...";
      const pendingQAReviewsVal = stats ? `${stats.pendingQAReviews} Results` : "Loading...";
      const pendingSignOffVal = stats ? `${stats.pendingSignOff} Reports` : "Loading...";
      const reportsReleasedVal = stats ? `${stats.reportsReleasedToday} PDFs` : "Loading...";
      const invoicesPendingVal = stats ? `${stats.invoicesPending} Invoices` : "Loading...";
      const activeCustomersVal = stats ? `${stats.activeCustomers} Corporate` : "Loading...";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardItem icon={Beaker} title="Today's Samples" value={todaySamplesVal} desc="Physical Intake Queue" color="blue" />
          <CardItem icon={Clock} title="Pending Assignments" value={pendingAssignmentsVal} desc="Requires Test Setup" color="amber" />
          <CardItem icon={Clock} title="Pending QA Reviews" value={pendingQAReviewsVal} desc="Verified under review" color="purple" />
          <CardItem icon={FileCheck} title="Pending Sign-off" value={pendingSignOffVal} desc="Requires Final Approval" color="emerald" />
          <CardItem icon={FileText} title="Reports Released Today" value={reportsReleasedVal} desc="Delivered to Clients" color="teal" />
          <CardItem icon={Receipt} title="Invoices Pending" value={invoicesPendingVal} desc="Awaiting Invoice Action" color="rose" />
          <CardItem icon={Users} title="Active Customers" value={activeCustomersVal} desc="Billing Accounts" color="indigo" />
        </div>
      );
    }

    if (isReception) {
      const todayCustomersVal = stats ? `${stats.activeCustomers} Corporate` : "Loading...";
      const todayWorkOrdersVal = stats ? `${stats.todayWorkOrders} Created` : "Loading...";
      const registeredTodayVal = stats ? `${stats.registeredToday} Samples` : "Loading...";
      const pendingPhysicalReceiptVal = stats ? `${stats.pendingPhysicalReceipt} Samples` : "Loading...";
      const pendingRegistrationsVal = stats ? `${stats.pendingRegistrations} Drafts` : "Loading...";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardItem icon={Users} title="Today's Customers" value={todayCustomersVal} desc="Active Client Base" color="blue" />
          <CardItem icon={FileText} title="Today's Work Orders" value={todayWorkOrdersVal} desc="Construction Ingests" color="indigo" />
          <CardItem icon={Beaker} title="Registered Today" value={registeredTodayVal} desc="Logged in system" color="emerald" />
          <CardItem icon={Clock} title="Pending Physical Receipt" value={pendingPhysicalReceiptVal} desc="Awaiting Core Store Intake" color="amber" />
          <CardItem icon={AlertCircle} title="Pending Registrations" value={pendingRegistrationsVal} desc="Requires Finalization" color="rose" />
        </div>
      );
    }

    if (isLabManager) {
      const awaitingAssignmentVal = stats ? `${stats.awaitingAssignment} Samples` : "Loading...";
      const testsInProgressVal = stats ? `${stats.testsInProgress} Current` : "Loading...";
      const testingCompleteVal = stats ? `${stats.testingComplete} Total` : "Loading...";
      const pendingQEReviewVal = stats ? `${stats.pendingQEReview} Results` : "Loading...";
      const overdueTestsVal = stats ? `${stats.overdueTests} Delayed` : "Loading...";
      const completedTodayVal = stats ? `${stats.completedToday} Tests` : "Loading...";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardItem icon={Clock} title="Awaiting Assignment" value={awaitingAssignmentVal} desc="Requires Technicians/Dates" color="amber" />
          <CardItem icon={Play} title="Tests In Progress" value={testsInProgressVal} desc="Active in lab floor" color="blue" />
          <CardItem icon={CheckCircle} title="Testing Complete" value={testingCompleteVal} desc="Observations submitted" color="purple" />
          <CardItem icon={Clock} title="Pending QE Review" value={pendingQEReviewVal} desc="Needs QA audit verification" color="indigo" />
          <CardItem icon={AlertCircle} title="Overdue Tests" value={overdueTestsVal} desc="Past scheduled timeline" color="rose" />
          <CardItem icon={FileCheck} title="Completed Today" value={completedTodayVal} desc="Awaiting report release" color="emerald" />
        </div>
      );
    }

    if (isTechnician) {
      const assignedTestsVal = stats ? `${stats.assignedTests} Pending` : "Loading...";
      const activeTestingVal = stats ? `${stats.activeTesting} In-Progress` : "Loading...";
      const draftResultsVal = stats ? `${stats.draftResults} Saved` : "Loading...";
      const completedTodayTechVal = stats ? `${stats.completedTodayTech} Submitted` : "Loading...";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardItem icon={Clock} title="Assigned Tests" value={assignedTestsVal} desc="Allocated to workbench" color="blue" />
          <CardItem icon={Play} title="Active Testing" value={activeTestingVal} desc="Started operations" color="amber" />
          <CardItem icon={CheckCircle} title="Draft Results" value={draftResultsVal} desc="Saved Observations Draft" color="indigo" />
          <CardItem icon={CheckCircle} title="Completed Today" value={completedTodayTechVal} desc="Sent to QE supervisor" color="emerald" />
        </div>
      );
    }

    if (isQE) {
      const qePendingReviewsVal = stats ? `${stats.qePendingReviews} Results` : "Loading...";
      const qeRejectedResultsVal = stats ? `${stats.qeRejectedResults} Retests` : "Loading...";
      const qeApprovedTodayVal = stats ? `${stats.qeApprovedToday} Results` : "Loading...";
      const qeReportsReadyVal = stats ? `${stats.qeReportsReady} PDFs` : "Loading...";
      const qeOverdueReviewsVal = stats ? `${stats.qeOverdueReviews} Pending` : "Loading...";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardItem icon={Clock} title="Pending QA Reviews" value={qePendingReviewsVal} desc="Requires observation verify" color="purple" />
          <CardItem icon={XCircle} title="Rejected Results" value={qeRejectedResultsVal} desc="Returned to tech workbench" color="rose" />
          <CardItem icon={CheckCircle} title="Approved Today" value={qeApprovedTodayVal} desc="Locked and verified" color="emerald" />
          <CardItem icon={FileText} title="Reports Ready" value={qeReportsReadyVal} desc="Awaiting final approval" color="teal" />
          <CardItem icon={AlertCircle} title="Overdue Reviews" value={qeOverdueReviewsVal} desc="Reviews timeline status" color="blue" />
        </div>
      );
    }

    if (isClient) {
      const clientProjectsCountVal = stats ? `${stats.clientProjectsCount} Sites` : "Loading...";
      const clientActiveWorkOrdersCountVal = stats ? `${stats.clientActiveWorkOrdersCount} Orders` : "Loading...";
      const clientSamplesSubmittedCountVal = stats ? `${stats.clientSamplesSubmittedCount} Mixes` : "Loading...";
      const clientReportsAvailableCountVal = stats ? `${stats.clientReportsAvailableCount} PDFs` : "Loading...";
      const clientInvoicesCountVal = stats ? `${stats.clientInvoicesCount} Tax Bills` : "Loading...";

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardItem icon={Briefcase} title="Registered Projects" value={clientProjectsCountVal} desc="Active Sites" color="blue" />
          <CardItem icon={FileText} title="Active Work Orders" value={clientActiveWorkOrdersCountVal} desc="Contract Testing Logs" color="indigo" />
          <CardItem icon={Beaker} title="Samples Submitted" value={clientSamplesSubmittedCountVal} desc="Undergoing laboratory sequences" color="purple" />
          <CardItem icon={FileCheck} title="Reports Available" value={clientReportsAvailableCountVal} desc="Downloadable Quality Certs" color="emerald" />
          <CardItem icon={Receipt} title="Total Invoices" value={clientInvoicesCountVal} desc="Billing statements" color="teal" />
        </div>
      );
    }

    return null;
  };

  // 2. Render Charts Section based on Role/Permissions
  const renderCharts = () => {
    if (isSuperAdmin || isAdmin || isLabManager) {
      const conCount = stats?.samplesByMaterial?.CON || 0;
      const soiCount = stats?.samplesByMaterial?.SOI || 0;
      const bitCount = stats?.samplesByMaterial?.BIT || 0;
      const stlCount = stats?.samplesByMaterial?.STL || 0;
      const totalMat = conCount + soiCount + bitCount + stlCount || 1; // avoid divide by zero

      const conPct = Math.round((conCount / totalMat) * 100);
      const soiPct = Math.round((soiCount / totalMat) * 100);
      const bitPct = Math.round((bitCount / totalMat) * 100);
      const stlPct = Math.round((stlCount / totalMat) * 100);

      const workflowCompleted = stats?.workflowProgression?.completed || 0;
      const workflowTesting = stats?.workflowProgression?.testing || 0;
      const workflowAwaiting = stats?.workflowProgression?.awaiting || 0;
      const totalWorkflow = workflowCompleted + workflowTesting + workflowAwaiting || 1;

      const completedPct = Math.round((workflowCompleted / totalWorkflow) * 100);
      const testingPct = Math.round((workflowTesting / totalWorkflow) * 100);
      const awaitingPct = Math.round((workflowAwaiting / totalWorkflow) * 100);

      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Samples by Material Class</h3>
            <div className="space-y-4">
              <ProgressItem label="Concrete Core Cubes (CON)" percent={conPct} color="blue" count={`${conCount} core samples`} />
              <ProgressItem label="Soil Classification Mixes (SOI)" percent={soiPct} color="indigo" count={`${soiCount} soil bags`} />
              <ProgressItem label="Bitumen Mix Trial Binder (BIT)" percent={bitPct} color="purple" count={`${bitCount} bitumen lots`} />
              <ProgressItem label="Steel Reinforcement Bars (STL)" percent={stlPct} color="teal" count={`${stlCount} steel rods`} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Laboratory Workflow Progression</h3>
            <div className="space-y-4">
              <ProgressItem label="Completed / Verified" percent={completedPct} color="emerald" count={`${workflowCompleted} tests completed`} />
              <ProgressItem label="Testing Underway" percent={testingPct} color="blue" count={`${workflowTesting} core tests active`} />
              <ProgressItem label="Awaiting Assignment" percent={awaitingPct} color="amber" count={`${workflowAwaiting} samples scheduled`} />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 3. Render Tables / Detailed Queues based on Role/Permissions
  const renderTables = () => {
    if (isReception) {
      const queue = stats?.receptionIncomingQueue || [];
      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm flex items-center">
            <Clock className="w-4 h-4 mr-2 text-indigo-500" />
            <span>Today's Incoming Sample Ingest Queue</span>
          </div>
          <div className="divide-y divide-gray-100">
            {queue.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-xs font-semibold">No work orders registered today.</div>
            ) : (
              queue.map((item, idx) => (
                <QueueRow
                  key={idx}
                  client={item.client}
                  project={item.project}
                  status={item.status}
                  due={item.due}
                />
              ))
            )}
          </div>
        </div>
      );
    }

    if (isLabManager) {
      const pendingSamples = stats?.pendingSamplesList || [];
      const workloads = stats?.technicianWorkloadList || [];

      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm flex items-center justify-between">
              <span>Samples Awaiting Test Assignment</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-extrabold">{pendingSamples.length} Pending</span>
            </div>
            <div className="p-4 divide-y">
              {pendingSamples.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs font-semibold">No samples awaiting assignment.</div>
              ) : (
                pendingSamples.map((sample) => (
                  <SampleAssignmentRow
                    key={sample.id}
                    code={sample.sampleId || ""}
                    material={sample.materialName || ""}
                    project={sample.projectName || ""}
                    age={sample.collectionDate ? new Date(sample.collectionDate).toLocaleDateString("en-IN") : "unknown date"}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm">
              <span>Technician Workload Metrics</span>
            </div>
            <div className="p-4 space-y-4">
              {workloads.length === 0 ? (
                <div className="text-center text-gray-500 text-xs font-semibold">No technicians online.</div>
              ) : (
                workloads.map((tech, idx) => (
                  <TechWorkloadRow
                    key={idx}
                    name={tech.name}
                    assigned={tech.assigned}
                    active={tech.active}
                    completed={tech.completed}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    if (isTechnician) {
      const activeTests = stats?.technicianActiveTestsList || [];

      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm flex items-center justify-between">
            <span>My Active Laboratory Workbench</span>
            <Link href="/results" className="text-blue-600 hover:underline text-xs">View All Assigned</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 border-b text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Sample Code</th>
                  <th className="px-6 py-3">Test Specification</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Target Due</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {activeTests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-semibold">
                      No active test assignments on your workbench.
                    </td>
                  </tr>
                ) : (
                  activeTests.map((t) => (
                    <tr key={t.sampleTestId}>
                      <td className="px-6 py-4 font-mono font-bold text-blue-600">{t.sampleCode}</td>
                      <td className="px-6 py-4">{t.testName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${t.priority === 'HIGH' || t.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono">{t.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href="/results" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-semibold text-xs transition-all inline-block shadow-sm">
                          Enter Result
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (isQE) {
      const qePending = stats?.qePendingReviewsList || [];

      return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm flex items-center justify-between">
            <span>QA Results Awaiting Verification</span>
            <Link href="/review" className="text-purple-600 hover:underline text-xs">Review Queue</Link>
          </div>
          <div className="p-4 divide-y">
            {qePending.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-xs font-semibold">No results pending quality verification.</div>
            ) : (
              qePending.map((item) => (
                <PendingReviewRow
                  key={item.testResultId}
                  code={item.sampleCode}
                  test={item.testName}
                  tech={item.technicianName}
                  date={item.submittedDate}
                />
              ))
            )}
          </div>
        </div>
      );
    }

    if (isClient) {
      const clientSamples = stats?.clientRecentSamplesList || [];
      const clientDownloads = stats?.clientReportDownloadsList || [];

      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm flex items-center justify-between">
              <span>My Recent Sample Consignments</span>
              <Link href="/sample" className="text-blue-600 hover:underline text-xs">Track All Samples</Link>
            </div>
            <div className="p-4 divide-y">
              {clientSamples.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs font-semibold">No samples submitted yet.</div>
              ) : (
                clientSamples.map((sample) => (
                  <ClientSampleRow
                    key={sample.id}
                    id={sample.id}
                    material={sample.materialName}
                    project={sample.projectName}
                    status={sample.status}
                    date={sample.date}
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-bold text-gray-800 text-sm">
              <span>Official Report Downloads</span>
            </div>
            <div className="p-4 space-y-3">
              {clientDownloads.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-xs font-semibold">No report PDFs available yet.</div>
              ) : (
                clientDownloads.map((dl) => (
                  <ClientDownloadRow
                    key={dl.id}
                    id={dl.id}
                    title={dl.title}
                    project={dl.projectName}
                    date={dl.date}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // 4. Render Quick Actions Grid based on Role/Permissions
  const renderQuickActions = () => {
    let actions: { label: string; icon: any; path: string; color: string }[] = [];

    if (isSuperAdmin) {
      actions = [
        { label: "Create Admin", icon: UserPlus, path: "/dashboard/users", color: "blue" },
        { label: "Create User", icon: UserPlus, path: "/dashboard/users", color: "indigo" },
        { label: "Manage Roles", icon: Shield, path: "/dashboard/users", color: "purple" },
        { label: "System Settings", icon: Database, path: "/settings", color: "teal" },
        { label: "Audit Logs", icon: Activity, path: "/dashboard", color: "slate" },
      ];
    } else if (isAdmin) {
      actions = [
        { label: "Add Customer", icon: UserPlus, path: "/customer/add", color: "blue" },
        { label: "Create Project", icon: Briefcase, path: "/project/add", color: "indigo" },
        { label: "Create Work Order", icon: FileText, path: "/work-order/add", color: "purple" },
        { label: "Register Sample", icon: Beaker, path: "/sample/add", color: "emerald" },
        { label: "Generate Invoice", icon: Receipt, path: "/invoice/create", color: "teal" },
      ];
    } else if (isReception) {
      actions = [
        { label: "Add Customer", icon: UserPlus, path: "/customer/add", color: "blue" },
        { label: "Add Project", icon: Briefcase, path: "/project/add", color: "indigo" },
        { label: "Create Work Order", icon: FileText, path: "/work-order/add", color: "purple" },
        { label: "Register Sample", icon: Beaker, path: "/sample/add", color: "emerald" },
      ];
    } else if (isLabManager) {
      actions = [
        { label: "Assign Tests", icon: Clock, path: "/assigning", color: "blue" },
        { label: "Assign Technician", icon: Users, path: "/assigning", color: "indigo" },
        { label: "View Testing Status", icon: Beaker, path: "/sample", color: "purple" },
        { label: "Release Reports", icon: FileCheck, path: "/reports", color: "emerald" },
      ];
    } else if (isTechnician) {
      actions = [
        { label: "My Test Queue", icon: Beaker, path: "/results", color: "blue" },
        { label: "Draft Results Log", icon: CheckSquare, path: "/results", color: "indigo" },
        { label: "Submit Result Logs", icon: CheckCircle, path: "/results", color: "emerald" },
      ];
    } else if (isQE) {
      actions = [
        { label: "Review Results", icon: Clock, path: "/review", color: "purple" },
        { label: "Approve Results", icon: FileCheck, path: "/approvals", color: "emerald" },
        { label: "Reject Results", icon: XCircle, path: "/review", color: "rose" },
        { label: "View Reports", icon: FileText, path: "/reports", color: "teal" },
      ];
    } else if (isClient) {
      actions = [
        { label: "Download Reports", icon: Download, path: "/reports", color: "emerald" },
        { label: "View Active Projects", icon: Briefcase, path: "/project/list", color: "blue" },
        { label: "Track Samples", icon: Beaker, path: "/sample", color: "purple" },
      ];
    }

    if (actions.length === 0) return null;

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Quick Actions Console</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {actions.map((act, index) => {
            const Icon = act.icon;
            let colorClasses = "bg-blue-50 text-blue-700 hover:bg-blue-100";
            if (act.color === "indigo") colorClasses = "bg-indigo-50 text-indigo-700 hover:bg-indigo-100";
            if (act.color === "purple") colorClasses = "bg-purple-50 text-purple-700 hover:bg-purple-100";
            if (act.color === "emerald") colorClasses = "bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
            if (act.color === "teal") colorClasses = "bg-teal-50 text-teal-700 hover:bg-teal-100";
            if (act.color === "rose") colorClasses = "bg-rose-50 text-rose-700 hover:bg-rose-100";
            if (act.color === "slate") colorClasses = "bg-slate-50 text-slate-700 hover:bg-slate-100";

            return (
              <Link
                key={index}
                href={act.path}
                className={`p-4 rounded-lg flex flex-col items-center text-center transition-all ${colorClasses} shadow-sm border border-transparent hover:border-gray-200`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold">{act.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <RouteGuard>
      <Layout>
        <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">

          {/* Welcome Banner */}
          {/* <div className="bg-gradient-to-r from-slate-800 to-indigo-950 rounded-xl p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Logged in as {roles[0]?.replace("ROLE_", "").replace("_", " ") || "USER"}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-3">LIMS Operational Hub</h2>
              <p className="text-slate-300 mt-2 text-sm max-w-xl">
                Unified testing and quality workspace for WeMurz Materials Laboratory. All statistics and action consoles are dynamically driven by role privileges.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs bg-slate-700/30 px-4 py-2.5 rounded-lg border border-slate-600/30">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">{new Date().toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div> */}

          {/* Summary Cards */}
          {renderSummaryCards()}

          {/* Charts Area */}
          {renderCharts()}

          {/* Table queues */}
          {renderTables()}

          {/* Console Actions */}
          {renderQuickActions()}

        </div>
      </Layout>
    </RouteGuard>
  );
}

// Sub-components & Helpers for Cards and Tables
interface CardItemProps {
  icon: any;
  title: string;
  value: string;
  desc: string;
  color: "blue" | "indigo" | "emerald" | "teal" | "purple" | "amber" | "rose" | "slate";
}
function CardItem({ icon: Icon, title, value, desc, color }: CardItemProps) {
  let colorClasses = "bg-blue-50 border-blue-200 text-blue-800";
  let iconBg = "bg-blue-100 text-blue-600";
  if (color === "indigo") {
    colorClasses = "bg-indigo-50 border-indigo-200 text-indigo-800";
    iconBg = "bg-indigo-100 text-indigo-600";
  }
  if (color === "emerald") {
    colorClasses = "bg-emerald-50 border-emerald-200 text-emerald-800";
    iconBg = "bg-emerald-100 text-emerald-600";
  }
  if (color === "teal") {
    colorClasses = "bg-teal-50 border-teal-200 text-teal-800";
    iconBg = "bg-teal-100 text-teal-600";
  }
  if (color === "purple") {
    colorClasses = "bg-purple-50 border-purple-200 text-purple-800";
    iconBg = "bg-purple-100 text-purple-600";
  }
  if (color === "amber") {
    colorClasses = "bg-amber-50 border-amber-200 text-amber-800";
    iconBg = "bg-amber-100 text-amber-600";
  }
  if (color === "rose") {
    colorClasses = "bg-rose-50 border-rose-200 text-rose-800";
    iconBg = "bg-rose-100 text-rose-600";
  }
  if (color === "slate") {
    colorClasses = "bg-slate-50 border-slate-200 text-slate-800";
    iconBg = "bg-slate-100 text-slate-600";
  }

  return (
    <div className={`p-5 rounded-lg ${colorClasses} shadow-sm flex items-center justify-between`}>
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold opacity-75">{title}</p>
        <h4 className="text-2xl font-extrabold mt-1">{value}</h4>
        <p className="text-[10px] opacity-60 mt-0.5">{desc}</p>
      </div>
      <div className={`p-3 rounded-full ${iconBg} shadow-inner`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}

interface ProgressItemProps {
  label: string;
  percent: number;
  color: "blue" | "indigo" | "purple" | "teal" | "emerald" | "amber";
  count: string;
}
function ProgressItem({ label, percent, color, count }: ProgressItemProps) {
  let barColor = "bg-blue-600";
  if (color === "indigo") barColor = "bg-indigo-600";
  if (color === "purple") barColor = "bg-purple-600";
  if (color === "teal") barColor = "bg-teal-600";
  if (color === "emerald") barColor = "bg-emerald-600";
  if (color === "amber") barColor = "bg-amber-600";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold text-gray-700">
        <span>{label}</span>
        <span className="text-gray-400 font-medium">{count} ({percent}%)</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div className={`${barColor} h-full rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

// Queue rows
interface QueueRowProps {
  client: string;
  project: string;
  status: string;
  due: string;
}
function QueueRow({ client, project, status, due }: QueueRowProps) {
  return (
    <div className="p-4 flex items-center justify-between text-xs">
      <div>
        <h4 className="font-bold text-gray-800">{client}</h4>
        <p className="text-[10px] text-gray-500 mt-0.5">Project: {project}</p>
      </div>
      <div className="flex items-center space-x-6 text-right">
        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded border border-indigo-100 font-semibold">{status}</span>
        <span className="text-[10px] text-gray-400 font-medium font-mono">{due}</span>
      </div>
    </div>
  );
}

// Sample assignment rows
interface SampleAssignmentRowProps {
  code: string;
  material: string;
  project: string;
  age: string;
}
function SampleAssignmentRow({ code, material, project, age }: SampleAssignmentRowProps) {
  return (
    <div className="py-3 flex items-center justify-between text-xs">
      <div>
        <span className="font-mono font-bold text-blue-600">{code}</span>
        <span className="text-gray-800 font-semibold ml-2">{material}</span>
        <p className="text-[10px] text-gray-400 mt-0.5">Project: {project}</p>
      </div>
      <span className="text-[10px] text-gray-400 font-mono">{age}</span>
    </div>
  );
}

// Tech workload row
interface TechWorkloadRowProps {
  name: string;
  assigned: number;
  active: number;
  completed: number;
}
function TechWorkloadRow({ name, assigned, active, completed }: TechWorkloadRowProps) {
  return (
    <div className="text-xs">
      <div className="flex justify-between font-semibold text-gray-800">
        <span>{name}</span>
        <span className="text-gray-400 font-medium">{completed}/{assigned} done</span>
      </div>
      <div className="flex space-x-2 mt-1.5">
        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px]">Assigned: {assigned}</span>
        <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[9px]">Active: {active}</span>
        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px]">Completed: {completed}</span>
      </div>
    </div>
  );
}

// Pending Review Row
interface PendingReviewRowProps {
  code: string;
  test: string;
  tech: string;
  date: string;
}
function PendingReviewRow({ code, test, tech, date }: PendingReviewRowProps) {
  return (
    <div className="py-3 flex items-center justify-between text-xs">
      <div>
        <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{code}</span>
        <span className="text-gray-800 font-semibold ml-2">{test}</span>
        <p className="text-[10px] text-gray-400 mt-1">Submitted by: {tech}</p>
      </div>
      <span className="text-[10px] text-gray-400 font-mono">{date}</span>
    </div>
  );
}

// Client rows
interface ClientSampleRowProps {
  id: string;
  material: string;
  project: string;
  status: string;
  date: string;
}
function ClientSampleRow({ id, material, project, status, date }: ClientSampleRowProps) {
  return (
    <div className="py-3 flex items-center justify-between text-xs">
      <div>
        <span className="font-mono font-bold text-blue-600">{id}</span>
        <span className="text-gray-800 font-semibold ml-2">{material}</span>
        <p className="text-[10px] text-gray-400 mt-0.5">Project: {project}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          status === 'REVIEW' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>{status}</span>
        <span className="text-[10px] text-gray-400 font-mono">{date}</span>
      </div>
    </div>
  );
}

interface ClientDownloadRowProps {
  id: string;
  title: string;
  project: string;
  date: string;
}
function ClientDownloadRow({ id, title, project, date }: ClientDownloadRowProps) {
  return (
    <div className="p-3 bg-gray-50 border rounded-lg flex items-center justify-between text-xs">
      <div>
        <h4 className="font-bold text-gray-800 truncate max-w-[150px]" title={title}>{title}</h4>
        <p className="text-[10px] text-gray-400 mt-0.5">Project: {project}</p>
      </div>
      <Link href="/reports" className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded flex items-center justify-center transition-colors">
        <Download className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
