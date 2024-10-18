import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/authProvider';
import axios from 'axios';
import { Loader2Icon, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Form {
  name: string;
  age: number;
  treatmentPlan: string;
}

export const AddPatient = ({ onAdd }: { onAdd: () => void }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>({
    name: '',
    age: 0,
    treatmentPlan: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    age: '',
    treatmentPlan: '',
  });

  const validate = () => {
    const newErrors = {
      name: '',
      age: '',
      treatmentPlan: '',
    };

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (form.age <= 0) {
      newErrors.age = 'Age is invalid';
    }
    if (!form.treatmentPlan.trim()) {
      newErrors.treatmentPlan = 'Treatment plan is required';
    }

    setErrors(newErrors);

    // If no errors, return true
    return !newErrors.name && !newErrors.age && !newErrors.treatmentPlan;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
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
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/patients`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          data: form,
        }
      );

      if (res.status === 201) {
        toast.success('Successfully added patient');
      } else {
        toast.error('Failed to add patient');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add patient';
      toast.error(message);
      console.error('Error during adding patient:', error);
    } finally {
      setLoading(false);
      // Reset form
      setForm({
        name: '',
        age: 0,
        treatmentPlan: '',
      });
      setOpen(false);
      onAdd(); // Refresh patient list
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className='max-w-[150px]'>
          <UserPlus className='h-4 w-4' /> Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[90%] max-w-[600px] bg-white py-5 px-4 rounded-md absolute'>
        {/* add patient form */}
        <DialogHeader>
          <DialogTitle>New Patient Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 pt-8'>
          {/* name and age */}
          <div className='flex  flex-col sm:flex-row  justify-between gap-3'>
            <Input
              type='text'
              id='name'
              name='name'
              label='Name'
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder='Enter patient name'
            />
            <Input
              type='number'
              id='age'
              name='age'
              label='Age'
              value={form.age}
              onChange={handleChange}
              error={errors.age}
              placeholder='Enter patient age'
            />
          </div>
          <Input
            type='text'
            id='treatmentPlan'
            name='treatmentPlan'
            label='Treatment Plan'
            value={form.treatmentPlan}
            onChange={handleChange}
            error={errors.treatmentPlan}
            placeholder='Enter patient treatment plan'
          />

          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2Icon className='w-4 h-4 animate-spin' />}{' '}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
