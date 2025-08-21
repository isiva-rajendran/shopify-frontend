'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressInput, Customer, Address } from '@/lib/shopify/types';
import { updateCustomerAddress, setCustomerDefaultAddress, createCustomerAddress } from '@/lib/shopify/queries/account';
import {
    CheckCircle,
    AlertCircle,
    MapPin,
    Building2,
    User,
    Phone,
    Loader2,
    Home,
    Edit,
    Check,
    X,
    Plus
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

// Helper function to extract base ID from Shopify address ID
function getBaseId(id: string | undefined): string {
    return id?.split('?')[0] || '';
}

export default function AddressesManager({ customer }: { customer: Customer }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalErrorMessage, setGlobalErrorMessage] = useState<string | null>(null);
    const [globalSuccessMessage, setGlobalSuccessMessage] = useState<string | null>(null);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const [popupErrorMessage, setPopupErrorMessage] = useState<string | null>(null);

    // Process addresses to handle edges or undefined
    const addresses: Address[] = customer.addresses
        ? Array.isArray(customer.addresses)
            ? customer.addresses
            : customer.addresses.edges?.map((edge: { node: Address }) => edge.node) || []
        : [];

    const defaultAddress = customer.defaultAddress;
    const defaultBaseId = getBaseId(defaultAddress?.id);

    // Sort addresses: default first, then others
    const sortedAddresses = addresses.sort((a, b) => {
        const aIsDefault = getBaseId(a.id) === defaultBaseId;
        const bIsDefault = getBaseId(b.id) === defaultBaseId;

        if (aIsDefault && !bIsDefault) return -1;
        if (!aIsDefault && bIsDefault) return 1;
        return 0;
    });

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
        setPopupErrorMessage(null);
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
        setIsEditPopupOpen(true);
    };

    // Open create address popup
    const openCreatePopup = () => {
        setPopupErrorMessage(null);
        reset({
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
        });
        setIsCreatePopupOpen(true);
    };

    // Close edit popup
    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setEditingAddressId(null);
        setPopupErrorMessage(null);
        reset();
    };

    // Close create popup
    const closeCreatePopup = () => {
        setIsCreatePopupOpen(false);
        setPopupErrorMessage(null);
        reset();
    };

    // Submit handler for updating an address
    const onSubmitEdit = async (data: AddressInput) => {
        if (!editingAddressId) return;

        setIsSubmitting(true);
        setPopupErrorMessage(null);
        setGlobalSuccessMessage(null);
        setGlobalErrorMessage(null);

        try {
            const result = await updateCustomerAddress(editingAddressId, data);

            if (result.success) {
                setGlobalSuccessMessage('Address updated successfully!');
                router.refresh();
                closeEditPopup();
                setTimeout(() => setGlobalSuccessMessage(null), 5000);
            } else {
                setPopupErrorMessage(result.errors?.[0]?.message || 'Failed to update address');
            }
        } catch (error) {
            console.error('Address update failed:', error);
            setPopupErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Submit handler for creating a new address
    const onSubmitCreate = async (data: AddressInput) => {
        setIsSubmitting(true);
        setPopupErrorMessage(null);
        setGlobalSuccessMessage(null);
        setGlobalErrorMessage(null);

        try {
            const result = await createCustomerAddress(data);

            if (result.success) {
                setGlobalSuccessMessage('Address created successfully!');
                router.refresh();
                closeCreatePopup();
                setTimeout(() => setGlobalSuccessMessage(null), 5000);
            } else {
                setPopupErrorMessage(result.errors?.[0]?.message || 'Failed to create address');
            }
        } catch (error) {
            console.error('Address creation failed:', error);
            setPopupErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler for setting an address as default
    const handleSetDefault = async (addressId: string) => {
        setIsSubmitting(true);
        setGlobalErrorMessage(null);
        setGlobalSuccessMessage(null);

        try {
            const baseAddressId = addressId;
            const result = await setCustomerDefaultAddress(baseAddressId);

            if (result.success) {
                setGlobalSuccessMessage('Address set as default successfully!');
                router.refresh();
                setTimeout(() => setGlobalSuccessMessage(null), 5000);
            } else {
                setGlobalErrorMessage(result.errors?.[0]?.message || 'Failed to set as default');
            }
        } catch (error) {
            console.error('Set default failed:', error);
            setGlobalErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Global Messages */}
            {globalSuccessMessage && (
                <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-700 font-medium">{globalSuccessMessage}</p>
                </div>
            )}
            {globalErrorMessage && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 font-medium">{globalErrorMessage}</p>
                </div>
            )}

            {/* All Addresses in Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">My Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   

                    {sortedAddresses.map((addr) => {
                        const isDefault = getBaseId(addr.id) === defaultBaseId;
                        return (
                            <AddressCard
                                key={addr.id}
                                address={addr}
                                isDefault={isDefault}
                                onSetDefault={() => handleSetDefault(addr.id)}
                                onEdit={() => startEditing(addr)}
                                isSubmitting={isSubmitting}
                            />
                        );
                    })}
                     {/* Add New Address Card */}
                    <AddAddressCard onClick={openCreatePopup} />
                </div>
                {sortedAddresses.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No addresses found.</p>
                )}
            </div>

            {/* Edit Address Popup */}
            <Dialog open={isEditPopupOpen} onOpenChange={closeEditPopup}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
                    <DialogHeader className="pb-6 border-b">
                        <DialogTitle className="text-xl font-semibold flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Edit className="w-5 h-5 text-blue-600" />
                            </div>
                            <span>Edit Address</span>
                        </DialogTitle>
                        <DialogClose asChild>
                            <Button variant="ghost" size="sm" className="absolute right-4 top-4 hover:bg-gray-100">
                                <X className="w-4 h-4" />
                            </Button>
                        </DialogClose>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[60vh] px-1">
                        {/* Error Message in Popup */}
                        {popupErrorMessage && (
                            <div className="flex items-center space-x-3 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">{popupErrorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                            First Name *
                                        </Label>
                                        <Input
                                            id="firstName"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter first name"
                                            {...register('firstName', { required: 'First name is required' })}
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                            Last Name *
                                        </Label>
                                        <Input
                                            id="lastName"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter last name"
                                            {...register('lastName', { required: 'Last name is required' })}
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter phone number"
                                            {...register('phone', { required: 'Phone number is required' })}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                                        Company
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="company"
                                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter company name (optional)"
                                            {...register('company')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">
                                    Address Information
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="address1" className="text-sm font-medium text-gray-700">
                                        Street Address *
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="address1"
                                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter street address"
                                            {...register('address1', { required: 'Street address is required' })}
                                        />
                                    </div>
                                    {errors.address1 && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.address1.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address2" className="text-sm font-medium text-gray-700">
                                        Apartment, Suite, etc.
                                    </Label>
                                    <Input
                                        id="address2"
                                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Apartment, suite, unit, building, floor, etc."
                                        {...register('address2')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                        City *
                                    </Label>
                                    <Input
                                        id="city"
                                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter city"
                                        {...register('city', { required: 'City is required' })}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.city.message}
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
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter state/province"
                                            {...register('province', { required: 'State/Province is required' })}
                                        />
                                        {errors.province && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.province.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip" className="text-sm font-medium text-gray-700">
                                            Postal Code *
                                        </Label>
                                        <Input
                                            id="zip"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter postal code"
                                            {...register('zip', { required: 'Postal code is required' })}
                                        />
                                        {errors.zip && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.zip.message}
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
                                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter country"
                                        {...register('country', { required: 'Country is required' })}
                                    />
                                    {errors.country && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.country.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Fixed Footer with Buttons */}
                    <div className="border-t bg-gray-50 px-6 py-4 -mx-6 -mb-6 mt-6">
                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeEditPopup}
                                className="flex-1 h-11 border-gray-300 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit(onSubmitEdit)}
                                disabled={isSubmitting || !isDirty}
                                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Address Popup */}
            <Dialog open={isCreatePopupOpen} onOpenChange={closeCreatePopup}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
                    <DialogHeader className="pb-6 border-b">
                        <DialogTitle className="text-xl font-semibold flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Plus className="w-5 h-5 text-blue-600" />
                            </div>
                            <span>Add New Address</span>
                        </DialogTitle>
                        <DialogClose asChild>
                            <Button variant="ghost" size="sm" className="absolute right-4 top-4 hover:bg-gray-100">
                                <X className="w-4 h-4" />
                            </Button>
                        </DialogClose>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[60vh] px-1">
                        {/* Error Message in Popup */}
                        {popupErrorMessage && (
                            <div className="flex items-center space-x-3 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">{popupErrorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-firstName" className="text-sm font-medium text-gray-700">
                                            First Name *
                                        </Label>
                                        <Input
                                            id="create-firstName"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter first name"
                                            {...register('firstName', { required: 'First name is required' })}
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-lastName" className="text-sm font-medium text-gray-700">
                                            Last Name *
                                        </Label>
                                        <Input
                                            id="create-lastName"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter last name"
                                            {...register('lastName', { required: 'Last name is required' })}
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-phone" className="text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="create-phone"
                                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter phone number"
                                            {...register('phone', { required: 'Phone number is required' })}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-company" className="text-sm font-medium text-gray-700">
                                        Company
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="create-company"
                                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter company name (optional)"
                                            {...register('company')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">
                                    Address Information
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="create-address1" className="text-sm font-medium text-gray-700">
                                        Street Address *
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="create-address1"
                                            className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter street address"
                                            {...register('address1', { required: 'Street address is required' })}
                                        />
                                    </div>
                                    {errors.address1 && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.address1.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-address2" className="text-sm font-medium text-gray-700">
                                        Apartment, Suite, etc.
                                    </Label>
                                    <Input
                                        id="create-address2"
                                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Apartment, suite, unit, building, floor, etc."
                                        {...register('address2')}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-city" className="text-sm font-medium text-gray-700">
                                        City *
                                    </Label>
                                    <Input
                                        id="create-city"
                                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter city"
                                        {...register('city', { required: 'City is required' })}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.city.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-province" className="text-sm font-medium text-gray-700">
                                            State/Province *
                                        </Label>
                                        <Input
                                            id="create-province"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter state/province"
                                            {...register('province', { required: 'State/Province is required' })}
                                        />
                                        {errors.province && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.province.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-zip" className="text-sm font-medium text-gray-700">
                                            Postal Code *
                                        </Label>
                                        <Input
                                            id="create-zip"
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter postal code"
                                            {...register('zip', { required: 'Postal code is required' })}
                                        />
                                        {errors.zip && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {errors.zip.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="create-country" className="text-sm font-medium text-gray-700">
                                        Country *
                                    </Label>
                                    <Input
                                        id="create-country"
                                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter country"
                                        {...register('country', { required: 'Country is required' })}
                                    />
                                    {errors.country && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {errors.country.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Fixed Footer with Buttons */}
                    <div className="border-t bg-gray-50 px-6 py-4 -mx-6 -mb-6 mt-6">
                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeCreatePopup}
                                className="flex-1 h-11 border-gray-300 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit(onSubmitCreate)}
                                disabled={isSubmitting}
                                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Address
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Add Address Card Component
function AddAddressCard({ onClick }: { onClick: () => void }) {
    return (
        <Card className="overflow-hidden pt-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center h-full  p-6">
                <div className="text-center space-y-4">
                    <div className="mx-auto p-3 bg-blue-100 rounded-full">
                        <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Add New Address</h3>
                    <p className="text-gray-600 text-sm">Create a new shipping address for your orders</p>
                </div>
            </CardContent>
            <CardFooter className="border-t bg-white p-4">
                <Button
                    onClick={onClick}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                </Button>
            </CardFooter>
        </Card>
    );
}

// Simplified AddressCard Component for Grid Display
function AddressCard({
    address,
    isDefault,
    onSetDefault,
    onEdit,
    isSubmitting,
}: {
    address: Address;
    isDefault: boolean;
    onSetDefault: () => void;
    onEdit: () => void;
    isSubmitting: boolean;
}) {
    return (
        <Card className="overflow-hidden pt-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b [.border-b]:pb-2 py-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        <span className="truncate">{address.firstName} {address.lastName}</span>
                    </CardTitle>
                    {isDefault && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 shrink-0">
                            <Home className="w-3 h-3 mr-1" />
                            Default
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                <p className="font-medium text-gray-900">{address.address1}</p>
                {address.address2 && <p className="text-gray-700">{address.address2}</p>}
                <p className="text-gray-700">{address.city}, {address.province} {address.zip}</p>
                <p className="text-gray-600">{address.country}</p>

                <div className="pt-2 space-y-1">
                    {address.company && (
                        <p className="flex items-center space-x-1 text-sm text-gray-600">
                            <Building2 className="w-3 h-3" />
                            <span>{address.company}</span>
                        </p>
                    )}
                    {address.phone && (
                        <p className="flex items-center space-x-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{address.phone}</span>
                        </p>
                    )}
                </div>
            </CardContent>

            <CardFooter className="border-t bg-gray-50/50 pt-4 flex justify-between gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    disabled={isSubmitting}
                    className="flex-1"
                >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>

                {!isDefault && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onSetDefault}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                            <Check className="w-4 h-4 mr-1" />
                        )}
                        Set Default
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}