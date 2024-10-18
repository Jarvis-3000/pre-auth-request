'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/providers/authProvider';
import { toast } from 'sonner';
import AddTreatmentHistoryForm from './AddTreatmentHistoryForm';
import AddMedicationHistoryForm from './AddMedicationHistoryForm';
import AddAuthRequestForm from './AddAuthRequestForm';
import { usePreAuthorizations } from '@/hooks/usePreAuthorizations';
import { PreAuthRequestItem } from '../PreAuthRequestItem';
import Pagination from '@/components/ui/pagination';

export default function PatientByIdPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // Use custom hook
  const {
    preAuthorizations,
    fetchPreAuthorizations,
    pages,
    page,
    handlePageChange,
  } = usePreAuthorizations({ initialPage: 1, patientId: id });

  // Fetch patient details
  const fetchPatient = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/patients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );
      if (res.status === 200) {
        setPatient(res.data);
      } else {
        toast.error('Failed to load patient details.');
      }
    } catch (error: any) {
      toast.error('Error fetching patient data.' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchPatient();
      fetchPreAuthorizations();
    }
  }, [id, token]);

  if (loading || !patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className='h-full flex flex-col mx-auto px-4 py-4'>
      <h1 className='text-xl lg:text-3xl font-bold mb-6'>Patient Details</h1>
      <div className='mb-6'>
        <p>
          <strong>Name:</strong> {patient.name}
        </p>
        <p>
          <strong>Age:</strong> {patient.age}
        </p>
      </div>

      <div className='flex flex-wrap justify-end gap-3 items-center mb-5'>
        {/* Medication History */}
        <AddMedicationHistoryForm patientId={id} onSuccess={() => {}} />

        {/* Treatment History */}
        <AddTreatmentHistoryForm patientId={id} onSuccess={() => {}} />

        {/* Authorization Requests */}
        <AddAuthRequestForm patientId={id} onSuccess={fetchPreAuthorizations} />
      </div>

      {/* Pre-authorization list */}
      <div className='w-full flex-1 overflow-y-auto mb-6'>
        {preAuthorizations?.length == 0 && (
          <div className='w-full h-[200px] flex flex-col justify-center items-center'>
            <h1 className='text-xl lg:text-3xl font-semibold mb-4 text-center'>
              No Pre Authorization Request Found
            </h1>
            <p className='text-sm text-center'>
              Please create a new Pre Authorization request !!
            </p>
          </div>
        )}
        {preAuthorizations?.length > 0 && (
          <table className='w-full shadow-sm'>
            <thead className='sticky top-0 bg-white'>
              <tr className='text-left bg-blue-100 h-[40px]'>
                <th className='px-4 text-sm min-w-[200px]'>Treatment Type</th>
                <th className='text-sm min-w-[150px]'>Insurance Plan</th>
                <th className='text-sm min-w-[150px]'>Date Of Service</th>
                <th className='text-sm min-w-[150px]'>Diagnosis Code</th>
                <th className='text-sm min-w-[150px]'>Status</th>
              </tr>
            </thead>
            <tbody>
              {preAuthorizations.map((request: any) => (
                <PreAuthRequestItem
                  key={request._id}
                  id={request._id}
                  treatmentType={request.treatmentType}
                  insurancePlan={request.insurancePlan}
                  dateOfService={request.dateOfService}
                  diagnosisCode={request.diagnosisCode}
                  status={request.status}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!!preAuthorizations?.length && (
        <Pagination
          currentPage={page}
          totalPages={pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
