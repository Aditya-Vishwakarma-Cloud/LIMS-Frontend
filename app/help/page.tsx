"use client";

import Layout from "../components/Layout";

export default function Help() {
  return (
    <Layout>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Help & Support</h2>
          <p className="text-gray-600">Help documentation and support information will be available here.</p>
        </div>
      </div>
    </Layout>
  );
}
