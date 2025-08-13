import AddressForm from '@/components/account/address-form';
import ProfileForm from '@/components/account/profile-form';
import { getCustomer } from '@/lib/shopify';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const customer = await getCustomer();
  
  if (!customer) {
    redirect('/auth');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <ProfileForm customer={customer} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <AddressForm customer={customer} />
        </div>
      </div>
    </div>
  );
}