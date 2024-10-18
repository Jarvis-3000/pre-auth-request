import { useState } from 'react';
// import { useAuth } from '@/providers/authProvider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2Icon, Plus } from 'lucide-react';

export default function AddMedicationHistoryForm({}: {
  patientId: any;
  onSuccess: () => void;
}) {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    medication: '',
    dateOfService: new Date(),
    doctorNotes: '',
  });
  const [errors, setErrors] = useState({
    medication: '',
    dateOfService: '',
    doctorNotes: '',
  });

  // const validate = () => {
  //   const newErrors = {
  //     medication: '',
  //     dateOfService: '',
  //     doctorNotes: '',
  //   };

  //   setErrors(newErrors);

  //   // If no errors, return true
  //   return (
  //     !newErrors.medication &&
  //     !newErrors.dateOfService &&
  //     !newErrors.doctorNotes
  //   );
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    // // Validate form inputs
    // if (!validate()) return;

    // try {
    //   setLoading(true);
    //   const res = await axios(
    //     `${process.env.NEXT_PUBLIC_SERVER_API_URL}/medication-history`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: 'Bearer ' + token,
    withCredentials: true;
    //       },
    //       data: formData,
    //     }
    //   );

    //   if (res.status === 201) {
    //     toast.success('Successfully account created!');
    //   } else {
    //     toast.error('Failed to signup');
    //   }
    // } catch (error: any) {
    //   const message = error.response?.data?.message || 'Failed to signup';
    //   toast.error(message);
    //   console.error('Error during signup:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  let formattedDate: any = new Date(formData.dateOfService);
  formattedDate = formattedDate.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} disabled>
          <Plus className='h-4 w-4' /> Medication History
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[600px] bg-white py-5 px-4 rounded-md absolute'>
        <DialogHeader>
          <DialogTitle>Medication History Form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
          <div className='flex items-center gap-2'>
            <Input
              type='text'
              id='medication'
              name='medication'
              label='Medication'
              value={formData.medication}
              onChange={handleChange}
              error={errors.medication}
              placeholder='Enter patient medication'
            />
            <Input
              type='date'
              id='dateOfService'
              name='dateOfService'
              label='Date of service'
              value={formattedDate}
              onChange={handleChange}
              error={errors.dateOfService}
              placeholder='Pick date of service'
            />
          </div>
          <Textarea
            id='doctorNotes'
            name='doctorNotes'
            label='Doctor Notes'
            value={formData.doctorNotes}
            onChange={handleChange}
            error={errors.doctorNotes}
            placeholder='Doctor notes'
          />

          <DialogFooter className='mt-5'>
            <Button type='submit' disabled={true}>
              {loading && <Loader2Icon className='w-4 h-4 animate-spin' />}{' '}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
