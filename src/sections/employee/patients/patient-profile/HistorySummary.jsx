
import React from 'react';
import PropTypes from 'prop-types';


import {
  Assignment,
  History,
  LocalPharmacy as Medication,
  Warning,
} from '@mui/icons-material';


import {
  Avatar,
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

const HistorySummary = ({ summary, history }) => {
  if (!summary) return null;

  const recordCounts = {
    sick_leave: (history || []).filter(r => r.recordType === 'sick_leave').length,
    prescription: (history || []).filter(r => r.recordType === 'prescription').length,
    medical_report: (history || []).filter(r => r.recordType === 'medical_report').length,
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            height: '100%',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              <History />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {summary.totalVisits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Records
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            height: '100%',
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#d32f2f' }}>
              <Warning />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {recordCounts.sick_leave}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sick Leaves
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            height: '100%',
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#ed6c02' }}>
              <Medication />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {recordCounts.prescription}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prescriptions
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            height: '100%',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: '#1976d2' }}>
              <Assignment />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {recordCounts.medical_report}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Medical Reports
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
};

HistorySummary.propTypes = {
  summary: PropTypes.shape({
    totalVisits: PropTypes.number.isRequired,
    
  }),
  history: PropTypes.arrayOf(
    PropTypes.shape({
      recordType: PropTypes.string.isRequired,
    })
  ),
};

HistorySummary.defaultProps = {
  summary: null,
  history: [],
};

export default HistorySummary;