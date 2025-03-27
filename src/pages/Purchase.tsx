
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Credit package options
const creditPackages = [
  { id: 'credits-10', name: '10 Credits', price: 12.99, description: 'Perfect for occasional use' },
  { id: 'credits-25', name: '25 Credits', price: 24.99, description: 'Best value for most users', popular: true },
  { id: 'credits-50', name: '50 Credits', price: 39.99, description: 'For professionals and teams' }
];

const Purchase: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState(creditPackages[1].id);
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [vatAddress, setVatAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { userId, refreshCredits } = useAuth();

  const handleCreditPurchase = async () => {
    // For demo purposes we'll just show a toast
    // In a real app, this would integrate with Stripe
    setIsProcessing(true);
    
    try {
      // Mock successful purchase
      setTimeout(() => {
        toast({
          title: "Credits purchased successfully!",
          description: "Your credits have been added to your account.",
        });
        
        // Refresh user credits (this would happen after Stripe webhook in real app)
        refreshCredits();
        
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const selectedPackageDetails = creditPackages.find(pkg => pkg.id === selectedPackage);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Purchase Credits</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {creditPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 
                ${selectedPackage === pkg.id 
                  ? 'border-tovector-red shadow-md' 
                  : 'border-gray-200 hover:border-tovector-red/50'
                }
                ${pkg.popular ? 'relative' : ''}
              `}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 bg-tovector-red text-black text-xs font-medium py-1 px-2 rounded-full text-center w-max mx-auto">
                  Most Popular
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center
                  ${selectedPackage === pkg.id ? 'border-tovector-red bg-tovector-red' : 'border-gray-300'}
                `}>
                  {selectedPackage === pkg.id && <Check size={14} className="text-white" />}
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">${pkg.price}</div>
              <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <Check size={16} className="text-tovector-red mr-2" />
                  All export formats
                </li>
                <li className="flex items-center text-sm">
                  <Check size={16} className="text-tovector-red mr-2" />
                  Credits never expire
                </li>
                <li className="flex items-center text-sm">
                  <Check size={16} className="text-tovector-red mr-2" />
                  Commercial usage rights
                </li>
              </ul>
            </div>
          ))}
        </div>
        
        {/* Billing details form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Billing Details (Optional)</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name"
              />
            </div>
            
            <div>
              <Label htmlFor="vat-number">VAT Number (for EU businesses)</Label>
              <Input 
                id="vat-number" 
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="e.g. GB123456789"
              />
            </div>
            
            <div>
              <Label htmlFor="vat-address">VAT Address</Label>
              <Input 
                id="vat-address" 
                value={vatAddress}
                onChange={(e) => setVatAddress(e.target.value)}
                placeholder="Company address for VAT purposes"
              />
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{selectedPackageDetails?.name}</span>
              <span>${selectedPackageDetails?.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-gray-500">
              <span>VAT (if applicable)</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${selectedPackageDetails?.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-tovector-red text-black hover:bg-tovector-red/90 px-12 py-6 text-lg"
            onClick={handleCreditPurchase}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${selectedPackageDetails?.price.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
