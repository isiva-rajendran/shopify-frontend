'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressInput, Customer } from '@/lib/shopify/types';
import { updateCustomerAddress } from '@/lib/shopify/queries/account';

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

    const { register, handleSubmit, formState: { errors } } = useForm<AddressInput>({
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

        // Ensure customerAccessToken and addressId are available
        const addressId = customer.defaultAddress?.id;

        if (!addressId) {
            setErrorMessage('Missing customer access token or address ID');
            setIsSubmitting(false);
            return;
        }

        const result = await updateCustomerAddress(addressId, data);

        if (result.success) {
            setSuccessMessage('Address updated successfully!');
            router.refresh(); // Refresh the page to reflect changes
        } else {
            setErrorMessage(result.errors?.[0]?.message || 'Failed to update address');
        }

        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <div>
                <Label htmlFor="firstName">First Name (Optional)</Label>
                <Input id="firstName" {...register('firstName')} />
            </div>

            <div>
                <Label htmlFor="lastName">Last Name (Optional)</Label>
                <Input id="lastName" {...register('lastName')} />
            </div>

            <div>
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" {...register('phone')} />
            </div>
            <div>
                <Label htmlFor="address1">Street Address</Label>
                <Input
                    id="address1"
                    {...register('address1', { required: 'Address is required' })}
                />
                {errors.address1 && <p className="text-red-500 text-sm">{errors.address1.message}</p>}
            </div>

            <div>
                <Label htmlFor="address2">Apartment/Suite (Optional)</Label>
                <Input id="address2" {...register('address2')} />
            </div>

            <div>
                <Label htmlFor="city">City</Label>
                <Input
                    id="city"
                    {...register('city', { required: 'City is required' })}
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="province">State/Province</Label>
                    <Input
                        id="province"
                        {...register('province', { required: 'State/Province is required' })}
                    />
                    {errors.province && <p className="text-red-500 text-sm">{errors.province.message}</p>}
                </div>

                <div>
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input
                        id="zip"
                        {...register('zip', { required: 'Postal code is required' })}
                    />
                    {errors.zip && <p className="text-red-500 text-sm">{errors.zip.message}</p>}
                </div>
            </div>

            <div>
                <Label htmlFor="country">Country</Label>
                <Input
                    id="country"
                    {...register('country', { required: 'Country is required' })}
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
            </div>

            <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" {...register('company')} />
            </div>



            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Address'}
            </Button>
        </form>
    );
}