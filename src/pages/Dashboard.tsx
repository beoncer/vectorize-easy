
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart, Download, Edit, FileType, Clock, CreditCard, Receipt, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AccountInfoCard from '@/components/dashboard/AccountInfoCard';
import { cn } from '@/lib/utils';

interface CreditLog {
  id: string;
  user_id: string;
  action_type: 'preview' | 'vectorize';
  credits_used: number;
  timestamp: string;
  file_name?: string;
  download_url?: string;
  expiration_time?: string;
}

interface Transaction {
  id: string;
  user_id: string;
  pack_name: string;
  credits_added: number;
  previews_added: number;
  amount_paid: number;
  currency: string;
  status: 'completed' | 'failed';
  timestamp: string;
  invoice_url?: string;
}

const Dashboard: React.FC = () => {
  const { credits, userId, refreshCredits } = useAuth();
  const [creditLogs, setCreditLogs] = useState<CreditLog[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const { toast } = useToast();
  const [freePreviews, setFreePreviews] = useState(0);

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
          toast({
            title: "Error",
            description: "Could not load your vectorization history",
            variant: "destructive",
          });
        } else {
          // Transform the data to match our interface
          const transformedData = data?.map(log => ({
            ...log,
            // Add mock data for demonstration if real data is missing
            file_name: log.file_name || `image-${Math.floor(Math.random() * 1000)}.jpg`,
            download_url: log.download_url || (Math.random() > 0.3 ? '#' : undefined),
            expiration_time: log.expiration_time || new Date(new Date(log.timestamp).getTime() + 24 * 60 * 60 * 1000).toISOString()
          })) || [];
          
          setCreditLogs(transformedData);
        }
      } catch (error) {
        console.error('Error fetching credit logs:', error);
        toast({
          title: "Error",
          description: "Could not load your vectorization history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      if (!userId) return;

      try {
        setLoadingTransactions(true);
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Error fetching transactions:', error);
        } else {
          // For demonstration purposes - if no transactions, add mock data
          if (!data || data.length === 0) {
            setTransactions([
              {
                id: 'mock-1',
                user_id: userId,
                pack_name: 'Professional Pack',
                credits_added: 500,
                previews_added: 20,
                amount_paid: 39.99,
                currency: 'USD',
                status: 'completed',
                timestamp: new Date().toISOString(),
                invoice_url: '#'
              }
            ]);
          } else {
            setTransactions(data);
          }
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    // Fetch free previews from user_credits table
    const fetchFreePreviews = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('user_credits')
          .select('free_previews')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching free previews:', error);
        } else {
          setFreePreviews(data?.free_previews || 0);
        }
      } catch (error) {
        console.error('Error fetching free previews:', error);
      }
    };

    fetchCreditLogs();
    fetchTransactions();
    fetchFreePreviews();
  }, [userId, toast]);

  // Function to format time remaining
  const getTimeRemaining = (expirationTime: string) => {
    const now = new Date();
    const expiration = new Date(expirationTime);
    const diff = expiration.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Function to check if a download is expired
  const isExpired = (expirationTime: string) => {
    return new Date(expirationTime).getTime() < new Date().getTime();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (60%) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Credit summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Credits & Previews</CardTitle>
              <CardDescription>Your current balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-tovector-red" />
                    <span className="text-xl font-medium">
                      Credits: <span className={cn(credits < 5 ? "text-red-600 font-bold" : "")}>{credits}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileType className="h-5 w-5 text-tovector-red" />
                    <span className="text-xl font-medium">
                      Free Previews: <span className={cn(freePreviews < 2 ? "text-red-600 font-bold" : "")}>{freePreviews}</span>
                    </span>
                  </div>
                </div>
                
                {(credits < 5 || freePreviews < 2) && (
                  <div className="text-red-600 text-sm font-medium">
                    Low balance! Buy more credits.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                className="bg-tovector-red text-black hover:bg-tovector-red/90"
                asChild
              >
                <Link to="/purchase">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy More Credits
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-tovector-red text-black hover:bg-tovector-red/10"
                asChild
              >
                <Link to="/">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Image
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Vectorization History */}
          <Card>
            <CardHeader>
              <CardTitle>Vectorization History</CardTitle>
              <CardDescription>Your recent vectorization activities</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading vectorization history...</div>
              ) : creditLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Filename</TableHead>
                        <TableHead>Credits Used</TableHead>
                        <TableHead>Download</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                          <TableCell className="font-medium">{log.file_name}</TableCell>
                          <TableCell>{log.credits_used}</TableCell>
                          <TableCell>
                            {log.download_url && log.expiration_time ? (
                              isExpired(log.expiration_time) ? (
                                <span className="text-red-600">Expired</span>
                              ) : (
                                <div className="flex flex-col">
                                  <Link to={log.download_url} className="flex items-center text-tovector-red hover:underline">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Link>
                                  <span className="text-xs text-gray-500 flex items-center mt-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Expires in {getTimeRemaining(log.expiration_time)}
                                  </span>
                                </div>
                              )
                            ) : (
                              <span className="text-gray-400">No download</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No vectorization history to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information Card */}
          <AccountInfoCard userId={userId || ''} />
          
          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your credit pack purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTransactions ? (
                <div className="text-center py-8">Loading transactions...</div>
              ) : transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Pack</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Invoice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div>{transaction.pack_name}</div>
                            <div className="text-xs text-gray-500">{transaction.credits_added} credits, {transaction.previews_added} previews</div>
                          </TableCell>
                          <TableCell>
                            <div className={transaction.status === 'completed' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.currency === 'USD' ? '$' : '€'}{transaction.amount_paid.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">{transaction.status}</div>
                          </TableCell>
                          <TableCell>
                            {transaction.invoice_url ? (
                              <Link to={transaction.invoice_url} className="flex items-center text-tovector-red hover:underline">
                                <Receipt className="h-4 w-4 mr-1" />
                                PDF
                              </Link>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No transactions to display
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
