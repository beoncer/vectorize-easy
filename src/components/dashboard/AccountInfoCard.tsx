
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserProfile {
  company_name?: string;
  billing_address?: string;
  vat_id?: string;
  country?: string;
  created_at: string;
}

const COUNTRIES = [
  { code: 'EE', name: 'Estonia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FI', name: 'Finland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'DK', name: 'Denmark' },
  { code: 'NO', name: 'Norway' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
];

const AccountInfoCard: React.FC<{ userId: string }> = ({ userId }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile>({
    company_name: '',
    billing_address: '',
    vat_id: '',
    country: '',
    created_at: new Date().toISOString(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Temporary local state for form inputs
  const [formData, setFormData] = useState({
    company_name: '',
    billing_address: '',
    vat_id: '',
    country: '',
  });

  // Fetch user profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Could not load your profile information",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setProfile(data);
          setFormData({
            company_name: data.company_name || '',
            billing_address: data.billing_address || '',
            vat_id: data.vat_id || '',
            country: data.country || '',
          });
        } else {
          // Create a new profile if none exists
          const newProfile = {
            user_id: userId,
            company_name: '',
            billing_address: '',
            vat_id: '',
            country: '',
            created_at: new Date().toISOString(),
          };
          
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert(newProfile);
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          } else {
            setProfile(newProfile);
            setFormData({
              company_name: '',
              billing_address: '',
              vat_id: '',
              country: '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({
        company_name: profile.company_name || '',
        billing_address: profile.billing_address || '',
        vat_id: profile.vat_id || '',
        country: profile.country || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          company_name: formData.company_name,
          billing_address: formData.billing_address,
          vat_id: formData.vat_id,
          country: formData.country,
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Could not save your profile information",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setProfile(prev => ({
        ...prev,
        ...formData
      }));

      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Could not save your profile information",
        variant: "destructive",
      });
    }
  };

  // Helper function to validate EU VAT ID (basic format check)
  const isValidVatId = (vatId: string): boolean => {
    if (!vatId) return true; // Empty is valid (not required)
    // Simple regex for basic EU VAT format
    const euVatRegex = /^[A-Z]{2}[0-9A-Z]{2,12}$/;
    return euVatRegex.test(vatId);
  };

  // Format date for display
  const formatMemberSince = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Your personal and billing details</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading account information...</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={user?.primaryEmailAddress?.emailAddress || ''}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>

            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing_address">Billing Address</Label>
                  <Input
                    id="billing_address"
                    name="billing_address"
                    value={formData.billing_address}
                    onChange={handleInputChange}
                    placeholder="Enter your billing address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat_id">
                    VAT ID 
                    <span className="text-sm text-gray-500 ml-1">(for EU businesses)</span>
                  </Label>
                  <Input
                    id="vat_id"
                    name="vat_id"
                    value={formData.vat_id}
                    onChange={handleInputChange}
                    placeholder="e.g. EE123456789"
                    className={
                      formData.vat_id && !isValidVatId(formData.vat_id) 
                        ? "border-red-500" 
                        : ""
                    }
                  />
                  {formData.vat_id && !isValidVatId(formData.vat_id) && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid EU VAT ID (e.g., EE123456789)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <Label className="text-sm text-gray-500">Company Name</Label>
                  <p className="font-medium">{profile.company_name || "Not specified"}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-gray-500">Billing Address</Label>
                  <p className="font-medium">{profile.billing_address || "Not specified"}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-gray-500">VAT ID</Label>
                  <p className="font-medium">{profile.vat_id || "Not specified"}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm text-gray-500">Country</Label>
                  <p className="font-medium">
                    {profile.country 
                      ? COUNTRIES.find(c => c.code === profile.country)?.name || profile.country
                      : "Not specified"}
                  </p>
                </div>
              </>
            )}

            <div className="space-y-1">
              <Label className="text-sm text-gray-500">Member Since</Label>
              <p className="font-medium">{formatMemberSince(profile.created_at)}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleEditToggle}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-tovector-red text-black hover:bg-tovector-red/90"
              disabled={formData.vat_id && !isValidVatId(formData.vat_id)}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            className="border-tovector-red hover:bg-tovector-red/10"
            onClick={handleEditToggle}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AccountInfoCard;
