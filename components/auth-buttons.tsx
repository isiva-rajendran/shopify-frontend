'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, LogOut, UserCircle, ShoppingBag } from 'lucide-react';
import CartModal from 'components/cart/modal';
import { logoutCustomer } from '@/app/actions/auth';
import Link from 'next/link';


export default function AuthButtons({ customer }: { customer: any }) {
  const router = useRouter();
  // Handle logout by calling an API route to clear the cookie
  const handleLogout = async () => {
        try {
          const result = await logoutCustomer();
          
          if (result.success) {
            // Redirect to dashboard or home page after successful login
            router.push("/")
          } 
        } catch (err) {
            console.error("Logout failed:", err);
            // Optionally handle error state
        }
  };

  // Handle login navigation
  const handleLogin = () => {
    router.push('/auth');
  };

 return (
    <div className="flex justify-end md:w-1/3 items-center space-x-1 xl:space-x-4">
      <CartModal />
      
      {customer ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full w-10 h-10"
            >
              {customer?.firstName ? (
                <span className="font-medium">
                  {customer.firstName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="flex flex-col gap-1">
              <div className="px-3 py-2">
                <p className="font-medium truncate">
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{customer.email}</p>
              </div>
              <div className="border-t my-1" />
              <Link href="/account">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button onClick={handleLogin}>Log In</Button>
      )}
    </div>
  );
}