'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressInput, Customer } from '@/lib/shopify/types';
import { updateCustomerAddress } from '@/lib/shopify/queries/account';
import { CheckCircle, AlertCircle, MapPin, Building2, User, Phone, Loader2, Home } from 'lucide-react';

export default function AddressForm({ customer }: { customer: Customer }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const address = customer.defaultAddress || {
        address1: '',
        city: '',
        province: '',
        country: '',
        zip: '',
        address2: '',
        company: '',
        firstName: '',
        lastName: '',
        phone: '',
    };

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isDirty } 
    } = useForm<AddressInput>({
        defaultValues: {
            address1: address.address1 || '',
            address2: address.address2 || '',
            city: address.city || '',
            province: address.province || '',
            country: address.country || '',
            zip: address.zip || '',
            company: address.company || '',
            firstName: address.firstName || '',
            lastName: address.lastName || '',
            phone: address.phone || '',
        },
    });

    const onSubmit = async (data: AddressInput) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const addressId = customer.defaultAddress?.id;

        if (!addressId) {
            setErrorMessage('Missing address information. Please contact support.');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await updateCustomerAddress(addressId, data);

            if (result.success) {
                setSuccessMessage('Address updated successfully!');
                router.refresh();
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            } else {
                setErrorMessage(result.errors?.[0]?.message || 'Failed to update address');
            }
        } catch (error) {
            console.error('Address update failed:', error);
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
                {/* Personal Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Personal Information</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                First Name *
                            </Label>
                            <Input 
                                id="firstName" 
                                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                placeholder="First name"
                                {...register('firstName', { required: 'First name is required' })} 
                            />
                            {errors.firstName && (
                            <p className="text-red-500 text-sm flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.firstName?.message}</span>
                            </p>
                        )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                Last Name *
                            </Label>
                            <Input 
                                id="lastName" 
                                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                placeholder="Last name"
                                {...register('lastName',{ required: 'Last name is required' })} 
                            />
                             {errors.lastName && (
                            <p className="text-red-500 text-sm flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.lastName?.message}</span>
                            </p>
                        )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>Phone *</span>
                        </Label>
                        <Input 
                            id="phone" 
                            type="tel"
                            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                            placeholder="Phone number"
                            {...register('phone', { required: "Phone number is required" })} 
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.phone?.message}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Address Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                        <Home className="w-5 h-5" />
                        <span>Address Details</span>
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="address1" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Street Address *</span>
                        </Label>
                        <Input
                            id="address1"
                            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                            placeholder="123 Main Street"
                            {...register('address1', { required: 'Street address is required' })}
                        />
                        {errors.address1 && (
                            <p className="text-red-500 text-sm flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.address1.message}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address2" className="text-sm font-medium text-gray-700">
                            Apartment/Suite <span className="text-gray-500 font-normal">(Optional)</span>
                        </Label>
                        <Input 
                            id="address2" 
                            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                            placeholder="Apt 4B, Suite 100, etc."
                            {...register('address2')} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                            City *
                        </Label>
                        <Input
                            id="city"
                            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                            placeholder="Enter city"
                            {...register('city', { required: 'City is required' })}
                        />
                        {errors.city && (
                            <p className="text-red-500 text-sm flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.city.message}</span>
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                                State/Province *
                            </Label>
                            <Input
                                id="province"
                                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                placeholder="State or Province"
                                {...register('province', { required: 'State/Province is required' })}
                            />
                            {errors.province && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.province.message}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zip" className="text-sm font-medium text-gray-700">
                                Postal Code *
                            </Label>
                            <Input
                                id="zip"
                                className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                placeholder="Postal code"
                                {...register('zip', { required: 'Postal code is required' })}
                            />
                            {errors.zip && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.zip.message}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                            Country *
                        </Label>
                        <Input
                            id="country"
                            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                            placeholder="Enter country"
                            {...register('country', { required: 'Country is required' })}
                        />
                        {errors.country && (
                            <p className="text-red-500 text-sm flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.country.message}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>Company <span className="text-gray-500 font-normal">(Optional)</span></span>
                        </Label>
                        <Input 
                            id="company" 
                            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                            placeholder="Company name"
                            {...register('company')} 
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
                    <Button 
                        type="submit" 
                        disabled={isSubmitting || !isDirty}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving Address...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>Save Address</span>
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