'use client';

import { Customer } from 'lib/shopify/types';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCustomerProfile } from '@/lib/shopify/queries/account';
// import { updateCustomer } from '@/lib/shopify'; // Uncommented since we'll use it

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
}

export default function ProfileForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      acceptsMarketing: customer.acceptsMarketing || false,
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Assuming updateCustomer returns a similar structure to updateCustomerAddress
      const result = await updateCustomerProfile(data);

      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        router.refresh(); // Refresh the page to reflect changes
      } else {
        setErrorMessage(result.errors?.[0]?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          disabled
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="acceptsMarketing"
          {...register('acceptsMarketing')}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <Label htmlFor="acceptsMarketing" className="text-sm">
          Subscribe to marketing updates
        </Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}