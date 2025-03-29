import React from 'react';
import { MonitoringDashboard } from '../components/MonitoringDashboard';
import { useAuth } from '../contexts/AuthContext';

export default function Monitoring() {
  const { user } = useAuth();

  // Only allow admin users to access monitoring
  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access the monitoring dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">System Monitoring</h1>
      <MonitoringDashboard />
    </div>
  );
} 