import Image from 'next/image';

export default function Home() {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center p-5'>
      <h1 className='text-xl lg:text-3xl font-bold text-center'>Pre Authorization Request Software</h1>
      <p className='text-sm lg:text-lg mt-5 text-center'>Visit Patients page for accessing your patient data</p>
      <Image
        src='/dashboard.jpg'
        width={500}
        height={400}
        alt='dashboard image'
      />
    </div>
  );
}
