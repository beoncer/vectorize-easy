
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// This is a placeholder for the admin analytics panel
// In a real implementation, we would check if the user has admin privileges
// and show charts and analytics data

const Analytics: React.FC = () => {
  const { isLoggedIn } = useAuth();

  // For demo purposes, we'll assume any logged in user can access this page
  // In a real app, we would check admin privileges
  if (!isLoggedIn) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Placeholder stats cards */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Vectorizations</h3>
          <p className="text-3xl font-bold">1,243</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Credits Used</h3>
          <p className="text-3xl font-bold">3,456</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">$8,790</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Users</h3>
          <p className="text-3xl font-bold">321</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Placeholder chart areas */}
        <div className="bg-white rounded-xl shadow-md p-6 min-h-96">
          <h3 className="text-lg font-medium mb-4">Vectorization Trends</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart would be displayed here
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 min-h-96">
          <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart would be displayed here
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Placeholder data rows */}
              {[1, 2, 3, 4, 5].map((index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">User {index}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25 Credits</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$24.99</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-{10 + index}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
