"use client";

import AnalyticsTables from "../components/AnalyticsTables";
import Calendar from "../components/Calendar";
import CustomerTables from "../components/CustomerTables";
import DashboardCards from "../components/DashboardCards";
import Layout from "../components/Layout";
import WorkStatus from "../components/WorkStatus";
import RouteGuard from "../components/RouteGuard";

export default function Dashboard() {
  return (
    <RouteGuard>
      <Layout>
      <div className="p-6 space-y-6">
        {/* Dashboard Cards */}
        <DashboardCards />
        
        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomerTables />
          </div>
          <div>
            <Calendar />
          </div>
        </div>

        {/* Analytics Section */}
        <AnalyticsTables />

        {/* Work Status */}
        <WorkStatus />
      </div>
      </Layout>
    </RouteGuard>
  );
}
