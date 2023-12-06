import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import axiosHandler from 'src/utils/axios-handler';
import TourItem from './offer-item';

// ----------------------------------------------------------------------

export default function TourList({ offers,refetch }) {
  const router = useRouter();




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




  const handleDelete = useCallback((id) => {
    axiosHandler({
     method:"DELETE", path:`suppliersoffers/${id}`
    })
    refetch()
  }, [refetch]);

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
            onDelete={() => handleDelete(tour._id)}
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
