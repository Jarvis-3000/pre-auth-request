'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { validateEmail, validateStrongPassword } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validate = () => {
    const newErrors = { name: '', email: '', password: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validateStrongPassword(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character';
    }

    setErrors(newErrors);

    // If no errors, return true
    return !newErrors.name && !newErrors.email && !newErrors.password;
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

    // Validate form inputs
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: formData,
        }
      );

      if (res.status === 201) {
        toast.success('Successfully account created!');
        router.push('/signin');
      } else {
        toast.error('Failed to signup');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to signup';
      toast.error(message);
      console.error('Error during signup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-lg shadow-md w-[90%] max-w-[600px]'>
        <h2 className='text-2xl font-semibold text-center mb-2'>Sign Up</h2>
        <p className='text-center mb-8 text-muted-foreground'>
          (Create new Health Provider Account)
        </p>
        {/*  */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            type='text'
            id='name'
            name='name'
            label='Provider Name'
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder='Enter healthcare provider name'
          />
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
            Up
          </Button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-4'>
          Already have an account?{' '}
          <a href='/signin' className='text-blue-500 hover:text-blue-700'>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
