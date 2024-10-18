'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { deleteCookie, getCookie, setCookie } from '@/lib/utils';

// Define the context types
interface AuthContextType {
  token: string | null;
  onLogout: () => void;
  onLogin: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const path = usePathname();

  // Check if the user is logged in on initial load
  useEffect(() => {
    const token = getCookie('token');

    if (token) {
      setToken(token);
    } else {
      if (path === '/signup' || path === '/signin') {
        return;
      }

      router.push('/signin'); // If no user, redirect to signin page
    }
  }, [router]);

  const onLogin = async (token: string) => {
    await setCookie('token', token, 2); // Expires in 2 days
    setToken(token);
    router.push('/');
  };

  const onLogout = async () => {
    await deleteCookie('token');
    setToken(null);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ token, onLogout, onLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
