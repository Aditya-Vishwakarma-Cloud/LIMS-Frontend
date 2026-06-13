"use client";

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && (
        <>
          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
          {/* Sidebar */}
          <div className={`
            fixed lg:relative z-30 lg:z-0
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${!isSidebarOpen ? 'lg:w-0 lg:overflow-hidden' : ''}
          `}>
            <Sidebar />
          </div>
        </>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showSidebar && <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
