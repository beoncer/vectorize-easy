import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemMetrics {
  status: string;
  timestamp: string;
  uptime: number;
  metrics: {
    requestCount: number;
    errorCount: number;
    averageResponseTime: number;
  };
}

interface PerformanceData {
  timestamp: string;
  responseTime: number;
  requestCount: number;
  errorCount: number;
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setMetrics(data);
        
        // Update performance data
        setPerformanceData(prev => [...prev, {
          timestamp: new Date().toISOString(),
          responseTime: data.metrics.averageResponseTime,
          requestCount: data.metrics.requestCount,
          errorCount: data.metrics.errorCount
        }].slice(-20)); // Keep last 20 data points
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up polling every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading metrics...</div>;
  }

  if (!metrics) {
    return <div>No metrics available</div>;
  }

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.status}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(metrics.timestamp).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(metrics.uptime)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.metrics.requestCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((metrics.metrics.errorCount / metrics.metrics.requestCount) * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#8884d8" 
                  name="Response Time (ms)"
                />
                <Line 
                  type="monotone" 
                  dataKey="requestCount" 
                  stroke="#82ca9d" 
                  name="Request Count"
                />
                <Line 
                  type="monotone" 
                  dataKey="errorCount" 
                  stroke="#ff7300" 
                  name="Error Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 