
import React from 'react';
import PropTypes from 'prop-types';


import {
  Box,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { History as HistoryIcon } from '@mui/icons-material';



import HistoryCard from './HistoryCard';

const HistoryList = ({ history, onView, currentPage, totalPages, onPageChange }) => {
  if (!history || history.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No records found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filter criteria
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {history.map((record, idx) => (
          <HistoryCard
            key={record._id || idx}
            record={record}
            onView={onView}
          />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            size="large"
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

HistoryList.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      recordType: PropTypes.string,
      visitStatus: PropTypes.string,
      servicesCount: PropTypes.number,
      visitLabel: PropTypes.string,
      created_at: PropTypes.string,
      work_group: PropTypes.shape({
        name_arabic: PropTypes.string,
        name_english: PropTypes.string,
      }),
      service_unit: PropTypes.shape({
        name_arabic: PropTypes.string,
        name_english: PropTypes.string,
      }),
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default HistoryList;