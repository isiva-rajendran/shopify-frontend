'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import CartModal from 'components/cart/modal';
import { logoutCustomer } from '@/app/actions/auth';
import Cookies from "js-cookie";


export default function AuthButtons({ initialAccessToken }: { initialAccessToken?: string }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialAccessToken);  
  
  // Handle logout by calling an API route to clear the cookie
  const handleLogout = async () => {
        try {
          const result = await logoutCustomer();
          
          if (result.success) {
            // Redirect to dashboard or home page after successful login
            router.push("/")
            setIsLoggedIn(false);
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
    <div className="flex justify-end md:w-1/3 items-center space-x-1  xl:space-x-4">
      <CartModal />
      {isLoggedIn ? (
        <Button onClick={handleLogout}>Log Out</Button>
      ) : (
        <Button onClick={handleLogin}>Log In</Button>
      )}
    </div>
  );
}