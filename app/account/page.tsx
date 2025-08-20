import AddressForm from '@/components/account/address-form';
import ProfileForm from '@/components/account/profile-form';
import { getCustomer } from '@/lib/shopify';
import { redirect } from 'next/navigation';
import { User, MapPin, Settings } from 'lucide-react';

export default async function AccountPage() {
  const customer = await getCustomer();
  
  if (!customer) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Account</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your profile information, addresses, and account preferences
          </p>
        </div>

        {/* Customer Welcome Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Welcome back, {customer.firstName || 'Valued Customer'}!
              </h2>
              <p className="text-gray-600 mt-1">
                {customer.email}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1  gap-8">
          {/* Profile Form - Takes 2 columns on large screens */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center space-x-3">
                  <Settings className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                </div>
                <p className="text-blue-100 mt-2">
                  Update your personal details and preferences
                </p>
              </div>
              <div className="p-8">
                <ProfileForm customer={customer} />
              </div>
          </div>
          
          {/* Address Form - Takes 1 column */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-fit">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">Address</h2>
                </div>
                <p className="text-green-100 mt-2">
                  Manage your delivery address
                </p>
              </div>
              <div className="p-6">
                <AddressForm customer={customer} />
              </div>
            </div>
        </div>

        {/* Customer Support Footer */}
        <footer className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Support</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're here to help! Reach out to our support team for assistance with your account or any other inquiries.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-600 font-medium">Email:</span>
                <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                  support@example.com
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-600 font-medium">Phone:</span>
                <a href="tel:+1-800-555-1234" className="text-blue-600 hover:underline">
                  +1-800-555-1234
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-600 font-medium">Help Center:</span>
                <a href="/help" className="text-blue-600 hover:underline">
                  Visit our Help Center
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}