import React from 'react';
import PropTypes from 'prop-types';

import {
  Stack,
  Button,
  Dialog,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
  Chip,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetPatientHistoryDataForUs } from 'src/api';

export default function PatientHistory({ patient }) {
  const { currentLang } = useTranslate();
  const curLangAr = currentLang?.value === 'ar';

  const { historyDataForPatient } = useGetPatientHistoryDataForUs(patient?._id);

  const [selectedData, setSelectedData] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  // const { fTimeUnit } = useFDateTimeUnit();
  const handleView = (item) => {
    setSelectedData(item);
    setOpenDialog(true);
  };

  const colorPalette = ['#ffebee', '#e8f5e9', '#e3f2fd', '#fff3e0', '#f3e5f5', '#ede7f6'];
  const workGroupColors = {};
  let colorIndex = 0;

  historyDataForPatient?.forEach((one) => {
    const workGroupId = typeof one.work_group === 'object' ? one.work_group?._id : one.work_group;

    if (workGroupId && !workGroupColors[workGroupId]) {
      workGroupColors[workGroupId] = colorPalette[colorIndex % colorPalette.length];
      // eslint-disable-next-line no-plusplus
      colorIndex++;
    }
  });

  return (
    <Container sx={{ py: 3, backgroundColor: 'background.neutral' }} maxWidth="xl">
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="flex-start">
        {curLangAr ? patient?.name_arabic : patient?.name_english}
      </Stack>

      <Stack spacing={2}>
        {historyDataForPatient?.map((one, idx) => {
          const workGroupId =
            typeof one.work_group === 'object' ? one.work_group?._id : one.work_group;
          const bgColor = workGroupColors[workGroupId] || '#fff';

          return (
            <Stack
              key={idx}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: bgColor,
              }}
            >
              <Typography component="span" sx={{ mr: 1, color: 'text.secondary' }}>
                {fDate(one?.created_at)}
              </Typography>
              <Typography component="span" sx={{ mr: 1, fontWeight: 'bold' }}>
                {one.title || 'No title'}
              </Typography>
              <Typography component="span" sx={{ mr: 1, color: 'text.secondary' }}>
                {one?.work_group?.name_english || one?.work_group?.name_arabic}
              </Typography>
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                {one?.service_unit?.name_arabic || one?.service_unit?.name_english}
              </Typography>

              <Button variant="outlined" onClick={() => handleView(one)}>
                View
              </Button>
            </Stack>
          );
        })}
      </Stack>

      {/* Dialog عرض التفاصيل */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Patient History Details</DialogTitle>
        <DialogContent dividers>
          {selectedData ? (
            <Stack spacing={3} sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {/* General Info Section */}
              <Typography variant="h6" gutterBottom>
                General Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Title
                  </Typography>
                  <Typography>{selectedData.title || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created At
                  </Typography>
                  <Typography>{fDate(selectedData.created_at)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedData.status || 'N/A'}
                    color={selectedData.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Modifications Number
                  </Typography>
                  <Typography>{selectedData.modifications_nums ?? 0}</Typography>
                </Grid>
              </Grid>

              <Divider />

              {/* Work Group Section */}
              <Typography variant="h6" gutterBottom>
                Work Group
              </Typography>
              <Typography>
                {selectedData.work_group
                  ? selectedData.work_group.name_english ||
                    selectedData.work_group.name_arabic ||
                    'N/A'
                  : 'N/A'}
              </Typography>

              <Divider />

              {/* Service Unit Section */}
              <Typography variant="h6" gutterBottom>
                Service Unit
              </Typography>
              <Typography>
                {selectedData.service_unit
                  ? selectedData.service_unit.name_english ||
                    selectedData.service_unit.name_arabic ||
                    'N/A'
                  : 'N/A'}
              </Typography>

              <Divider />
            </Stack>
          ) : (
            <Typography>No data selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

PatientHistory.propTypes = { patient: PropTypes.object };
