'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut, 
  UserCircle, 
  Bell,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import CartModal from 'components/cart/modal';
import { logoutCustomer } from '@/app/actions/auth';
import Link from 'next/link';

interface Customer {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export default function AuthButtons({ customer }: { customer: Customer | null }) {
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Handle logout by calling an API route to clear the cookie
  const handleLogout = async () => {
    try {
      const result = await logoutCustomer();
      
      if (result.success) {
        setIsPopoverOpen(false);
        router.push("/");
      } 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Handle login navigation
  const handleLogin = () => {
    router.push('/auth');
  };

  // Handle popover close when clicking menu items
  const handleMenuItemClick = () => {
    setIsPopoverOpen(false);
  };

  // Generate user initials
  const getUserInitials = () => {
    if (customer?.firstName && customer?.lastName) {
      return `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`.toUpperCase();
    } else if (customer?.firstName) {
      return customer.firstName.charAt(0).toUpperCase();
    } else if (customer?.email) {
      return customer.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const menuItems = [
    {
      icon: UserCircle,
      label: 'My Profile',
      href: '/account',
      description: 'Manage your account settings'
    },
    // {
    //   icon: ShoppingBag,
    //   label: 'My Orders',
    //   href: '/account/orders',
    //   description: 'View order history'
    // },
    // {
    //   icon: Heart,
    //   label: 'Wishlist',
    //   href: '/account/wishlist',
    //   description: 'Your saved items'
    // },
    // {
    //   icon: MapPin,
    //   label: 'Addresses',
    //   href: '/account/addresses',
    //   description: 'Manage shipping addresses'
    // },
    // {
    //   icon: CreditCard,
    //   label: 'Payment Methods',
    //   href: '/account/payment',
    //   description: 'Saved payment options'
    // },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/account/notifications',
      description: 'Communication preferences'
    },
    // {
    //   icon: Settings,
    //   label: 'Account Settings',
    //   href: '/account/settings',
    //   description: 'Privacy and security'
    // },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      href: '/support',
      description: 'Get help with your account'
    }
  ];

  return (
    <div className="flex justify-end md:w-1/3 items-center space-x-1 xl:space-x-4">
      <CartModal />
      
      {customer ? (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full w-10 h-10 hover:shadow-md cursor-pointer transition-shadow duration-200 border-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} />
                <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 shadow-2xl border-1 bg-white rounded-xl " align="end">
            <div className="flex flex-col">
              {/* User Info Header */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} />
                    <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-lg ">
                      {customer.firstName && customer.lastName 
                        ? `${customer.firstName} ${customer.lastName}`
                        : customer.firstName || 'User'
                      }
                    </p>
                    <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-xs text-gray-500 truncate">{customer.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.href}
                    onClick={handleMenuItemClick}
                    className="block "
                  >
                    <Button 
                      variant="ghost" 
                      className="w-full cursor-pointer justify-between px-4 py-3 h-auto hover:bg-gray-50 rounded-none group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                          <item.icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </Button>
                  </Link>
                ))}
                
                <Separator className="my-2" />
                
                {/* Logout Button */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start cursor-pointer px-4 py-3 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none"
                  onClick={handleLogout}
                >
                  <div className="p-2 rounded-lg bg-red-100 mr-3">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Sign Out</div>
                    <div className="text-xs text-red-400">Log out of your account</div>
                  </div>
                </Button>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t">
                <p className="text-xs text-gray-500 text-center">
                  Account ID: {customer.id ? `***${customer.id.slice(-4)}` : 'N/A'}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button 
          onClick={handleLogin}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Log In
        </Button>
      )}
    </div>
  );
}