'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressInput, Customer, Address } from '@/lib/shopify/types';
import { updateCustomerAddress } from '@/lib/shopify/queries/account';
import { CheckCircle, AlertCircle, MapPin, Building2, User, Phone, Loader2, Home, Edit, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Helper function to extract base ID from Shopify address ID
function getBaseId(id: string | undefined): string {
    return id?.split('?')[0] || '';
}

export default function AddressesManager({ customer }: { customer: Customer }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    // Process addresses to handle edges or undefined
    const addresses: Address[] = customer.addresses
        ? Array.isArray(customer.addresses)
            ? customer.addresses
            : customer.addresses.edges?.map((edge: { node: Address }) => edge.node) || []
        : [];

    const defaultAddress = customer.defaultAddress;
    const defaultBaseId = getBaseId(defaultAddress?.id);

    // Find default address from the list (to avoid duplicate)
    const defaultAddr = addresses.find((addr) => getBaseId(addr.id) === defaultBaseId);

    // Other addresses (exclude default by base ID)
    const otherAddresses = addresses.filter((addr) => getBaseId(addr.id) !== defaultBaseId);

    // Form for editing an address
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset
    } = useForm<AddressInput>({
        defaultValues: {
            address1: '',
            address2: '',
            city: '',
            province: '',
            country: '',
            zip: '',
            company: '',
            firstName: '',
            lastName: '',
            phone: '',
        },
    });

    // Load form with selected address data for editing
    const startEditing = (addr: Address) => {
        reset({
            address1: addr.address1 || '',
            address2: addr.address2 || '',
            city: addr.city || '',
            province: addr.province || '',
            country: addr.country || '',
            zip: addr.zip || '',
            company: addr.company || '',
            firstName: addr.firstName || '',
            lastName: addr.lastName || '',
            phone: addr.phone || '',
        });
        setEditingAddressId(addr.id);
    };

    // Submit handler for updating an address
    const onSubmit = async (data: AddressInput) => {
        if (!editingAddressId) return;

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await updateCustomerAddress(editingAddressId, data);

            if (result.success) {
                setSuccessMessage('Address updated successfully!');
                router.refresh();
                setEditingAddressId(null);
                setTimeout(() => setSuccessMessage(null), 5000);
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

    // Handler for setting an address as default
    const handleSetDefault = async (addressId: string) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            // const baseAddressId = addressId;
            // const result = await setCustomerDefaultAddress(baseAddressId);

            // if (result.success) {
            //     setSuccessMessage('Address set as default successfully!');
            //     router.refresh();
            //     setTimeout(() => setSuccessMessage(null), 5000);
            // } else {
            //     setErrorMessage(result.errors?.[0]?.message || 'Failed to set as default');
            // }
        } catch (error) {
            console.error('Set default failed:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Global Messages */}
            {successMessage && (
                <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 font-medium">{successMessage}</p>
                </div>
            )}
            {errorMessage && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 font-medium">{errorMessage}</p>
                </div>
            )}

            {/* Default Address Card */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Default Address</h2>
                {defaultAddr ? (
                    <AddressCard
                        address={defaultAddr}
                        isDefault={true}
                        onEdit={() => startEditing(defaultAddr)}
                        isEditing={editingAddressId === defaultAddr.id}
                        onSubmit={handleSubmit(onSubmit)}
                        register={register}
                        errors={errors}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                    />
                ) : (
                    <p className="text-gray-500">No default address set.</p>
                )}
            </div>

            {/* Other Addresses */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Other Addresses</h2>
                <div className="grid ">
                    {otherAddresses.map((addr) => (
                        <AddressCard
                            key={addr.id}
                            address={addr}
                            isDefault={false}
                            onSetDefault={() => handleSetDefault(addr.id)}
                            onEdit={() => startEditing(addr)}
                            isEditing={editingAddressId === addr.id}
                            onSubmit={handleSubmit(onSubmit)}
                            register={register}
                            errors={errors}
                            isDirty={isDirty}
                            isSubmitting={isSubmitting}
                        />
                    ))}
                </div>
                {otherAddresses.length === 0 && <p className="text-gray-500">No other addresses.</p>}
            </div>
        </div>
    );
}

// AddressCard Component (unchanged from previous)
function AddressCard({
    address,
    isDefault,
    onSetDefault,
    onEdit,
    isEditing,
    onSubmit,
    register,
    errors,
    isDirty,
    isSubmitting,
}: {
    address: Address;
    isDefault: boolean;
    onSetDefault?: () => void;
    onEdit: () => void;
    isEditing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    register: any;
    errors: any;
    isDirty: boolean;
    isSubmitting: boolean;
}) {
    return (
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <span>{address.firstName} {address.lastName}</span>
                    </CardTitle>
                    {isDefault && <Badge variant="secondary" className="bg-green-100 text-green-700">Default</Badge>}
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
                {!isEditing ? (
                    <>
                        <p className="font-medium">{address.address1}</p>
                        {address.address2 && <p>{address.address2}</p>}
                        <p>{address.city}, {address.province} {address.zip}</p>
                        <p>{address.country}</p>
                        {address.company && <p className="flex items-center space-x-1"><Building2 className="w-4 h-4" /> {address.company}</p>}
                        {address.phone && <p className="flex items-center space-x-1"><Phone className="w-4 h-4" /> {address.phone}</p>}
                    </>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input id="firstName" {...register('firstName', { required: 'First name is required' })} />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input id="lastName" {...register('lastName', { required: 'Last name is required' })} />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input id="phone" {...register('phone', { required: 'Phone number is required' })} />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="address1">Street Address *</Label>
                            <Input id="address1" {...register('address1', { required: 'Street address is required' })} />
                            {errors.address1 && <p className="text-red-500 text-xs">{errors.address1.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="address2">Apartment/Suite</Label>
                            <Input id="address2" {...register('address2')} />
                        </div>
                        <div>
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" {...register('city', { required: 'City is required' })} />
                            {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="province">State/Province *</Label>
                                <Input id="province" {...register('province', { required: 'State/Province is required' })} />
                                {errors.province && <p className="text-red-500 text-xs">{errors.province.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="zip">Postal Code *</Label>
                                <Input id="zip" {...register('zip', { required: 'Postal code is required' })} />
                                {errors.zip && <p className="text-red-500 text-xs">{errors.zip.message}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="country">Country *</Label>
                            <Input id="country" {...register('country', { required: 'Country is required' })} />
                            {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" {...register('company')} />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isDirty}
                            className="w-full"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </Button>
                    </form>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
                {!isEditing && (
                    <>
                        <Button variant="outline" onClick={onEdit}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        {!isDefault && onSetDefault && (
                            <Button variant="secondary" onClick={onSetDefault}>
                                <Check className="w-4 h-4 mr-2" /> Set as Default
                            </Button>
                        )}
                    </>
                )}
            </CardFooter>
        </Card>
    );
}