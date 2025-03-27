
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CreditCard, Clock, Download } from 'lucide-react';

interface CreditLog {
  id: string;
  user_id: string;
  action_type: 'preview' | 'vectorize';
  credits_used: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { credits, userId } = useAuth();
  const [creditLogs, setCreditLogs] = useState<CreditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreditLogs = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('credit_logs')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching credit logs:', error);
        } else {
          setCreditLogs(data || []);
        }
      } catch (error) {
        console.error('Error fetching credit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditLogs();
  }, [userId]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>
      
      {/* Credit summary card */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Credits</h2>
            <CreditCard className="text-tovector-red" size={24} />
          </div>
          <div className="text-3xl font-bold text-tovector-red mb-4">{credits}</div>
          <Button 
            className="w-full bg-tovector-red text-black hover:bg-tovector-red/90"
            asChild
          >
            <Link to="/purchase">Buy More Credits</Link>
          </Button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Clock className="text-tovector-red" size={24} />
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading recent activity...</div>
          ) : creditLogs.length > 0 ? (
            <div className="divide-y">
              {creditLogs.map((log) => (
                <div key={log.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium capitalize">
                      {log.action_type === 'preview' ? 'Image Preview' : 'Image Vectorization'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-tovector-red font-medium">
                      -{log.credits_used} credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
