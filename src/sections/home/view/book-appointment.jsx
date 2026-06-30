import React, { useRef, useState, useEffect } from 'react';

import { Box, Stack, Container, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetEmployeeEngs } from 'src/api';

import Iconify from 'src/components/iconify';

import BookToolbar from '../book-toolbar';
import EmployeeCard from '../employee-card';
import EmployeeCardSkeleton from '../employee-card-skeleton';

export default function BookAppointment() {
  const { t } = useTranslate();
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

  const isInitialLoading = loading && employees.length === 0;
  const isEmpty = !loading && employees.length === 0;

  return (
    <Box sx={{ bgcolor: '#F4F9F8', minHeight: '100vh', pb: 8 }}>
      {/* ---- Hero header ---- */}
      <Box
        sx={{
          pt: { xs: '110px', md: '150px' },
          pb: { xs: 10, md: 14 },
          textAlign: 'center',
          background: 'linear-gradient(rgba(60, 176, 153, 0.7), rgba(112, 216, 192, 0.24))',
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px',
        }}
      >
        <Container maxWidth="md">
          <Iconify
            icon="solar:calendar-mark-bold-duotone"
            width={56}
            sx={{ mb: 1, color: 'secondary.main' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, color: 'secondary.main' }}>
            {t('book an appointment')}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 400, color: 'text.secondary' }}>
            {t('search by doctor, specialty or disease')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -6 }, position: 'relative', zIndex: 2 }}>
        {/* ---- Sticky filter bar ---- */}
        <Box
          sx={{
            position: 'sticky',
            top: { xs: 8, md: 16 },
            zIndex: 10,
            mb: 4,
          }}
        >
          <BookToolbar filters={filters} filterChange={filterChange} />
        </Box>

        {/* ---- Results ---- */}
        <Stack gap={3}>
          {employees.map((one, index) => (
            <EmployeeCard key={index} employee={one} />
          ))}

          {isInitialLoading && <EmployeeCardSkeleton count={3} />}

          {isEmpty && (
            <Stack alignItems="center" justifyContent="center" gap={1.5} sx={{ py: 10 }}>
              <Iconify
                icon="solar:user-cross-rounded-bold-duotone"
                width={72}
                sx={{ color: 'primary.main', opacity: 0.7 }}
              />
              <Typography variant="h6" color="text.secondary">
                {t('no results')}
              </Typography>
            </Stack>
          )}
        </Stack>

        {!loading && employeesData.length > 0 && hasMore && <div ref={loadMoreRef} />}

        {loading && employees.length > 0 && (
          <Stack direction="row" justifyContent="center" py={3}>
            <Iconify width={50} icon="eos-icons:bubble-loading" sx={{ color: 'primary.main' }} />
          </Stack>
        )}
      </Container>
    </Box>
  );
}
