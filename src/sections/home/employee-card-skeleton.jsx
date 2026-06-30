import PropTypes from 'prop-types';

import { Box, Card, Stack, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function EmployeeCardSkeleton({ count = 1 }) {
  return [...Array(count)].map((_, index) => (
    <Card
      key={index}
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(145, 158, 171, 0.12)',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        gap={{ xs: 3, lg: 5 }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} sx={{ flex: 1 }}>
          <Skeleton variant="rounded" width={140} height={140} sx={{ borderRadius: 3 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="50%" height={20} />
            <Stack direction="row" gap={1} sx={{ mt: 1 }}>
              <Skeleton variant="rounded" width={70} height={24} />
              <Skeleton variant="rounded" width={70} height={24} />
              <Skeleton variant="rounded" width={50} height={24} />
            </Stack>
          </Box>
        </Stack>
        <Box sx={{ minWidth: { lg: 320 } }}>
          <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2, mb: 2 }} />
          <Stack direction="row" gap={1} flexWrap="wrap">
            {[...Array(5)].map((__, i) => (
              <Skeleton key={i} variant="rounded" width={72} height={36} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Card>
  ));
}

EmployeeCardSkeleton.propTypes = {
  count: PropTypes.number,
};
