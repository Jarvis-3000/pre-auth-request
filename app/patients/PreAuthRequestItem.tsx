
interface PreAuthRequestItemProps {
  id: string;
  treatmentType: string;
  insurancePlan: string;
  dateOfService: Date;
  diagnosisCode: string;
  status: 'pending' | 'approved' | 'denied';
  className?: string;
}

export const PreAuthRequestItem = ({
  treatmentType,
  insurancePlan,
  dateOfService,
  diagnosisCode,
  status,
  className = '',
}: PreAuthRequestItemProps) => {
  const date = new Date(dateOfService);
  return (
    <tr
      className={`w-full bg-white h-[60px] py-4 px-4 hover:bg-blue-50 transition-all duration-100 border-b-[1px] border-gray-100 ${className}`}
    >
      <td className='text-semibold py-2 px-4 text-sm'>{treatmentType}</td>
      <td className='py-2 text-sm'>{insurancePlan}</td>
      <td className='py-2 text-sm'>{date.toISOString().split('T')[0]}</td>
      <td className='py-2 text-sm'>{diagnosisCode || '-'}</td>
      <td>
        <span
          className={`py-2 px-3 text-sm text-white rounded-lg ${
            status === 'pending'
              ? 'bg-blue-600'
              : status === 'approved'
              ? 'bg-green-600'
              : 'bg-red-600'
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};
