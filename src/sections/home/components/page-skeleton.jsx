import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

export default function PageSkeleton({ variant = 'doctor' }) {
  return (
    <Container sx={{ my: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ md: 'center' }}
          sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}
        >
          <Skeleton
            variant={variant === 'doctor' ? 'circular' : 'rounded'}
            sx={{ width: 160, height: 160, flexShrink: 0 }}
          />
          <Stack spacing={1.5} sx={{ width: 1 }}>
            <Skeleton sx={{ height: 28, width: 0.4 }} />
            <Skeleton sx={{ height: 20, width: 0.25 }} />
            <Skeleton sx={{ height: 20, width: 0.6 }} />
            <Skeleton sx={{ height: 40, width: 0.3 }} />
          </Stack>
        </Stack>

        {[...Array(3)].map((_, index) => (
          <Stack key={index} spacing={1.5} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Skeleton sx={{ height: 24, width: 0.15 }} />
            <Skeleton sx={{ height: 80 }} />
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}

PageSkeleton.propTypes = {
  variant: PropTypes.oneOf(['doctor', 'clinic']),
};
