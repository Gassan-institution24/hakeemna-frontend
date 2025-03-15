import React, { useRef, useState, useEffect } from 'react';

import { Stack } from '@mui/material';

import { useGetEmployeeEngs } from 'src/api';

import Iconify from 'src/components/iconify';

import BookToolbar from '../book-toolbar';
import EmployeeCard from '../employee-card';

export default function BookAppointment() {
  const loadMoreRef = useRef(null);

  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    US_type: '',
    // speciality: '',
    country: '',
    city: '',
    insurance: '',
    name: '',
    rowsPerPage: 15,
    // sortBy: '',
    // order: '',
    visibility_online_appointment: true,
  });

  const [employees, setEmployees] = useState([]);
  const { employeesData, hasMore, loading } = useGetEmployeeEngs({
    ...filters,
    name: filters.name,
    page,
  });

  useEffect(() => {
    if (employeesData) {
      setEmployees((prevEmployees) => [...prevEmployees, ...employeesData]);
    }
  }, [employeesData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
  }, [hasMore]);

  const filterChange = (name, value) => {
    setPage(0);
    setEmployees([]);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Stack>
      <BookToolbar filters={filters} filterChange={filterChange} />
      <Stack m={4} gap={2}>
        {/* {employees.map((one, index) => ( */}
          <EmployeeCard  />
        {/* ))} */}
      </Stack>
      {!loading && employeesData.length > 0 && hasMore && <div ref={loadMoreRef} />}
      {loading && (
        <Stack direction="row" justifyContent="center" py={3}>
          <Iconify width={50} icon="eos-icons:bubble-loading" sx={{ color: 'primary.main' }} />
        </Stack>
      )}

      {/* {hasMore && <Button onClick={() => setPage((prev) => prev + 1)}>load more</Button>} */}
    </Stack>
  );
}
