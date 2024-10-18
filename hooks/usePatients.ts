import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/providers/authProvider';
import { debounce } from '@/lib/utils';

interface UsePatientsProps {
  initialPage?: number;
}

export const usePatients = ({ initialPage = 1 }: UsePatientsProps) => {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState<string>('');

  const fetchPatients = async () => {
    const params: { page: number; search?: string } = { page };

    if (search) {
      params['search'] = search;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/patients`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        }
      );

      if (res.status === 200) {
        setPage(res.data.page);
        setPages(res.data.pages);
        setPatients(res.data.patients);
      } else {
        toast.error('Failed to load patients data');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load patients data';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPatients();
    }
  }, [token, page, search]);

  const handleSearchChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e?.target?.value;
      setSearch(value);
      setPage(1); // Reset to first page when search is applied
    }, 200),
    []
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    patients,
    loading,
    page,
    pages,
    search,
    handleSearchChange,
    handlePageChange,
    fetchPatients, // You may want to trigger refresh manually sometimes
  };
};
