import Link from 'next/link';

interface PatientItemProps {
  id: string;
  name: string;
  age: number;
  condition: string;
  treatmentPlan: string;
  className?: string;
}

export const PatientItem = ({
  id,
  name,
  age,
  condition,
  treatmentPlan,
  className = '',
}: PatientItemProps) => {
  return (
    <tr
      className={`w-full bg-white h-[60px] py-4 px-4 hover:bg-blue-50 transition-all duration-100 border-b-[1px] border-gray-100 ${className}`}
    >
      <td className='text-semibold py-2 px-4 text-sm'>{name}</td>
      <td className='py-2 text-sm'>{age}</td>
      <td className='py-2 text-sm'>{condition}</td>
      <td className='py-2 text-sm'>{treatmentPlan || '-'}</td>
      <td className='text-blue-500 py-2 text-sm' title='View full patient profile'>
        <Link href={`/patients/${id}`}>Profile</Link>
      </td>
    </tr>
  );
};
