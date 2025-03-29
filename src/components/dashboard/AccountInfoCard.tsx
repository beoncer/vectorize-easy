import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseClient } from '@/lib/supabase';

interface Profile {
  user_id: string;
  company_name: string;
  billing_address: string;
  vat_id: string;
  country: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  company_name: string;
  billing_address: string;
  vat_id: string;
  country: string;
}

const AccountInfoCard: React.FC<{ userId: string }> = ({ userId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    billing_address: '',
    vat_id: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const client = getSupabaseClient(userId);
        const { data, error } = await client
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
            updated_at: new Date().toISOString()
          };
          
          const { error: insertError } = await client
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

  const handleSave = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const client = getSupabaseClient(userId);
      const { error } = await client
        .from('user_profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Could not update your profile",
          variant: "destructive",
        });
        return;
      }

      setProfile(prev => prev ? { ...prev, ...formData } : null);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Could not update your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Loading your profile information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Manage your account details and billing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="billing_address">Billing Address</Label>
          <Input
            id="billing_address"
            value={formData.billing_address}
            onChange={(e) => setFormData(prev => ({ ...prev, billing_address: e.target.value }))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vat_id">VAT ID</Label>
          <Input
            id="vat_id"
            value={formData.vat_id}
            onChange={(e) => setFormData(prev => ({ ...prev, vat_id: e.target.value }))}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            disabled={!isEditing}
          />
        </div>
        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInfoCard;
