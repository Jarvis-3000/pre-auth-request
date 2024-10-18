'use client';

import { LayoutDashboard, LogOut, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './button';
import { useAuth } from '@/providers/authProvider';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { useState } from 'react';

export const SideNavbar = () => {
  const [open, setOpen] = useState(false);
  const { onLogout } = useAuth();
  const pathname = usePathname();

  const path = pathname.split('/');

  return (
    <nav className=' h-full py-4 px-2 bg-white border-r-[1px] shadow-xl flex flex-col gap-8'>
      {/* Logo */}

      <div className='flex justify-center'>
        <Image
          src='/authorization.png'
          width={100}
          height={100}
          alt='logo'
          className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'
        />
      </div>

      <ul className='flex-1 flex flex-col gap-5'>
        <Link
          href='/'
          className={cn(
            'py-2 sm:px-5 flex justify-center items-center gap-2 text-gray-800 hover:text-white hover:bg-blue-400 rounded-md transition duration-300',
            path[1] === '' ? 'bg-blue-500 text-white' : ''
          )}
        >
          <LayoutDashboard className='w-4 h-4' />
          <span className='hidden md:block'>Dashboard</span>
        </Link>
        <Link
          href='/patients'
          className={cn(
            'py-2 sm:px-5 flex justify-center items-center gap-2 text-gray-800 hover:text-white hover:bg-blue-400 rounded-md  transition duration-300',
            path[1] === 'patients' ? 'bg-blue-500 text-white' : ''
          )}
        >
          <Users className='w-4 h-4' />
          <span className='hidden md:block'>Patients</span>
        </Link>
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className='py-2 sm:px-5 flex justify-center items-center gap-2 text-white bg-red-400 hover:bg-red-500 rounded-md transition duration-300'
            onClick={() => setOpen(true)}
          >
            <LogOut className='w-4 h-4 rotate-180' />
            <span className='hidden md:block'>Logout</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='w-[90%] max-w-[400px] rounded-md'>
          <DialogTitle>Please confirm logout action.</DialogTitle>
          <DialogFooter className='flex flex-col sm:flex-row gap-3 mt-5'>
            <Button
              className='bg-gray-400 text-white'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className='bg-gray-700 text-white'
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};
