import { SideNavbar } from '@/components/ui/side-navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full h-screen flex'>
      <SideNavbar />
      <div className='flex-1 overflow-auto'>{children}</div>
    </div>
  );
}
