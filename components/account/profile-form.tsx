'use client';

import { Customer } from 'lib/shopify/types';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCustomerProfile } from '@/lib/shopify/queries/account';
import { CheckCircle, AlertCircle, User, Mail, Phone, Bell, Loader2 } from 'lucide-react';

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
    reset,
    formState: { errors, isDirty } 
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
      const result = await updateCustomerProfile(data);

      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        // Reset form dirty state with current values
        reset(data);
        router.refresh();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
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
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>First Name</span>
            </Label>
            <Input
              id="firstName"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              placeholder="Enter your first name"
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.firstName.message}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Last Name</span>
            </Label>
            <Input
              id="lastName"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              placeholder="Enter your last name"
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.lastName.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email Address</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              disabled
              className="h-12 border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed rounded-lg pl-4"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded">
                Cannot be changed
              </div>
            </div>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Phone Number <span className="text-gray-500 font-normal">(Optional)</span></span>
          </Label>
          <Input
            id="phone"
            type="tel"
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            placeholder="Enter your phone number"
            {...register('phone')}
          />
        </div>

        {/* Marketing Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Communication Preferences</span>
          </h3>
          
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="acceptsMarketing"
                  {...register('acceptsMarketing')}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="acceptsMarketing" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Subscribe to marketing updates
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Receive emails about new products, special offers, and exclusive deals. You can unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <Button 
            type="submit" 
            disabled={isSubmitting || !isDirty}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Save Profile</span>
              </div>
            )}
          </Button>
          
          {isDirty && !isSubmitting && (
            <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200 text-center">
              You have unsaved changes
            </div>
          )}
        </div>
      </form>
    </div>
  );
}