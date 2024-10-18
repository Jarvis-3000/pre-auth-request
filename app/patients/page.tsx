'use client';

import { usePatients } from '@/hooks/usePatients'; // Import the custom hook
import { PatientItem } from './PatientItem';
import { AddPatient } from './AddPatient';
import Pagination from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

export default function PatientList() {
  // Use custom hook
  const {
    patients,
    fetchPatients,
    pages,
    page,
    handlePageChange,
    handleSearchChange,
  } = usePatients({ initialPage: 1 });

  return (
    <div className='w-full h-screen flex flex-col py-3 px-8'>
      <h1 className='text-lg sm:text-xl md:text-3xl font-bold mb-6'>
        Patients
      </h1>
      {/* Filters and add-patient */}
      <div className='flex flex-col sm:flex-row justify-between gap-5 mb-4'>
        <Input
          type='text'
          id='search'
          name='search'
          onChange={handleSearchChange}
          placeholder='Search Patient'
          className='w-[100%] sm:max-w-[300px]'
        />

        <div className='flex justify-end'>
          <AddPatient onAdd={fetchPatients} />
        </div>
        {/* Trigger refresh after adding */}
      </div>
      {/* Patient List */}
      <div className='w-full flex-1 overflow-y-auto mb-4'>
        {patients?.length == 0 && (
          <div className='w-full h-[200px] flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-semibold mb-4'>No Patients Found</h1>
            <p>Please create new patient !!</p>
          </div>
        )}
        {patients?.length > 0 && (
          <table className='w-full shadow-sm'>
            <thead className='sticky top-0 bg-white'>
              <tr className='text-left bg-blue-100 h-[40px]'>
                <th className='px-4 text-sm min-w-[200px]'>Name</th>
                <th className='text-sm min-w-[100px]'>Age</th>
                <th className='text-sm min-w-[100px]'>Condition</th>
                <th className='text-sm min-w-[150px]'>Treatment Plan</th>
                <th className='text-sm min-w-[100px]'>View Profile</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient: any) => (
                <PatientItem
                  key={patient._id}
                  id={patient._id}
                  name={patient.name}
                  age={patient.age}
                  condition={'OK'}
                  treatmentPlan={patient.treatmentPlan}
                  className=''
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination */}
      {!!patients.length && (
        <Pagination
          currentPage={page}
          totalPages={pages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
