import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/providers/authProvider';
import { toast } from 'sonner';
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

export default function AddAuthRequestForm({
  patientId,
  onSuccess,
}: {
  patientId: any;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    treatmentType: '',
    insurancePlan: '',
    dateOfService: new Date(),
    diagnosisCode: '',
    doctorNotes: '',
  });
  const [errors, setErrors] = useState({
    treatmentType: '',
    insurancePlan: '',
    dateOfService: '',
    diagnosisCode: '',
    doctorNotes: '',
  });
  const { token } = useAuth();

  const validate = () => {
    const newErrors = {
      treatmentType: '',
      insurancePlan: '',
      dateOfService: '',
      diagnosisCode: '',
      doctorNotes: '',
    };

    if (!formData.treatmentType.trim()) {
      newErrors.treatmentType = 'Treatment type is required';
    }
    if (!formData.insurancePlan.trim()) {
      newErrors.insurancePlan = 'Insurance plan is required';
    }
    if (!formData.dateOfService) {
      newErrors.dateOfService = 'Date of service is required';
    }
    if (!formData.diagnosisCode.trim()) {
      newErrors.diagnosisCode = 'Diagnosis code is required';
    }
    if (!formData.doctorNotes.trim()) {
      newErrors.doctorNotes = 'Doctor notes is required';
    }

    setErrors(newErrors);

    // If no errors, return true
    return (
      !newErrors.treatmentType &&
      !newErrors.insurancePlan &&
      !newErrors.dateOfService &&
      !newErrors.diagnosisCode &&
      !newErrors.doctorNotes
    );
  };

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

  const resetData = () => {
    setFormData({
      treatmentType: '',
      insurancePlan: '',
      dateOfService: new Date(),
      diagnosisCode: '',
      doctorNotes: '',
    });
    setErrors({
      treatmentType: '',
      insurancePlan: '',
      dateOfService: '',
      diagnosisCode: '',
      doctorNotes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/pre-auth-requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            withCredentials: true,
          },
          data: { ...formData, patientId },
        }
      );

      if (res.status === 201) {
        toast.success('Successfully pre authorization request sent!');
        setOpen(false);
        onSuccess();
      } else {
        toast.error('Failed to send pre authorization request');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Failed to send pre authorization request';
      toast.error(message);
      console.error('Error during sending pre authorization request:', error);
    } finally {
      resetData();
      setLoading(false);
    }
  };

  const closeDialog = (open) => {
    setOpen(open);
    resetData();
  };

  let formattedDate: any = new Date(formData.dateOfService);
  formattedDate = formattedDate.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className='h-4 w-4' /> Pre Auth Request
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[90%] max-w-[700px] bg-white py-5 px-4 rounded-md absolute'>
        <DialogHeader>
          <DialogTitle>Pre Authorization Form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
          <div className='flex flex-col sm:flex-row gap-2'>
            <Input
              type='text'
              id='treatmentType'
              name='treatmentType'
              label='Treatment Type'
              value={formData.treatmentType}
              onChange={handleChange}
              error={errors.treatmentType}
              placeholder='Enter patient treatment type'
            />
            <Input
              type='text'
              id='insurancePlan'
              name='insurancePlan'
              label='Insurance Plan'
              value={formData.insurancePlan}
              onChange={handleChange}
              error={errors.insurancePlan}
              placeholder='Enter patient insurance plan'
            />
          </div>
          <div className='flex  flex-col sm:flex-row gap-2'>
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
            <Input
              type='text'
              id='diagnosisCode'
              name='diagnosisCode'
              label='Diagnosis Code'
              value={formData.diagnosisCode}
              onChange={handleChange}
              error={errors.diagnosisCode}
              placeholder='Enter diagnosis code'
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
            <Button type='submit' disabled={loading}>
              {loading && <Loader2Icon className='w-4 h-4 animate-spin' />}{' '}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
