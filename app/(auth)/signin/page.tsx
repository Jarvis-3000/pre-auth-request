'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

import { validateEmail } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/authProvider';
import { Loader2Icon } from 'lucide-react';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { token, onLogin } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // Redirect to dashboard if already signed-in
  useEffect(() => {
    if (token) {
      toast.info('User is already signed in!');
      router.push('/');
    }
  }, [router, token]);

  const validate = () => {
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    // If no errors, return true
    return !newErrors.email && !newErrors.password;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/signin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: formData,
        }
      );

      if (res.status === 200 && res.data.token) {
        // Save token in cookies
        onLogin(res.data.token);
        toast.success('Successfully signed in!');
      } else {
        toast.error('Failed to signin');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to signin';
      toast.error(message);
      console.error('Error during signin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-[90%] max-w-[600px]'>
        <h2 className='text-2xl font-semibold text-center mb-2'>Sign In</h2>
        {/*  */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            type='email'
            id='email'
            name='email'
            label='Email'
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder='Enter your email'
          />
          <Input
            type='password'
            id='password'
            name='password'
            label='Password'
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder='Enter a strong password'
          />

          <Button type='submit' className='w-full' disabled={loading}>
            {loading && <Loader2Icon className='h-4 w-4 animate-spin' />} Sign
            In
          </Button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-4'>
          <span>Do not have an account?</span>
          <a href='/signup' className='text-blue-500 hover:text-blue-700'>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
