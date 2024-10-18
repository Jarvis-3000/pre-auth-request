import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/providers/authProvider';

interface UsePreAuthorizationsProps {
  initialPage?: number;
  patientId: any;
}

export const usePreAuthorizations = ({
  initialPage = 1,
  patientId,
}: UsePreAuthorizationsProps) => {
  const { token } = useAuth();
  const [preAuthorizations, setPreAuthorizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState<string>('');

  const fetchPreAuthorizations = async () => {
    const params: { page: number; patientId: string; status?: string } = {
      page,
      patientId,
    };

    if (search) {
      params['status'] = search;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/pre-auth-requests`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setPage(res.data.page);
        setPages(res.data.pages);
        setPreAuthorizations(res.data.data);
      } else {
        toast.error('Failed to load pre auth requests');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load pre auth requests';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPreAuthorizations();
    }
  }, [token, page, search, patientId]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when search is applied
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    preAuthorizations,
    loading,
    page,
    pages,
    search,
    handleSearchChange,
    handlePageChange,
    fetchPreAuthorizations, // You may want to trigger refresh manually sometimes
  };
};
