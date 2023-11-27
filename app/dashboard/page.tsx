
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DashboardPage = () => {
  useEffect(() => {
    // Your code here
    const router = useRouter();

    router.push('/dashboard/profile');
  });
};

export default DashboardPage;
