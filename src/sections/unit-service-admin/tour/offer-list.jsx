import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import axiosHandler from 'src/utils/axios-handler';
import TourItem from './offer-item';

// ----------------------------------------------------------------------

export default function TourList({ offers, refetch }) {
  const router = useRouter();
  const [status, setStatus] = useState();
  // offers.map((info)=> setStatus(info.status))

  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.tour.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.tour.edit(id));
    },
    [router]
  );

  const handleStatusChange = useCallback(
    (id, newStatus) => {
      axiosHandler({
        method: 'PATCH',
        path: `/api/suppliersoffers/${id}`,
        data: { status: newStatus },
      });
      refetch();
    },
    [refetch]
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {offers.map((tour) => (
          <TourItem
            key={tour.id}
            tour={tour}
            onView={() => handleView(tour._id)}
            onEdit={() => handleEdit(tour._id)}
            onStatusChange={() =>
              handleStatusChange(tour._id, tour.status === 'active' ? 'inactive' : 'active')
            }
          />
        ))}
      </Box>

      {/* {offers.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )} */}
    </>
  );
}

TourList.propTypes = {
  offers: PropTypes.array,
  refetch: PropTypes.func,
};
