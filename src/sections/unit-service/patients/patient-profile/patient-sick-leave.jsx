import React from 'react';
import PropTypes from 'prop-types';

import { Box, Card, Stack, Container, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetSickLeaves } from 'src/api/sickleave';

export default function PatientSickLeaves({ patient }) {
  const { t } = useTranslate();

  const { user } = useAuthContext();
  const { data } = useGetSickLeaves({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });
  return (
    <Container maxWidth="xl">
      {data?.map((one, idx) => (
        <Card key={idx} sx={{ py: 3, px: 5, mb: 2 }}>
          <Stack direction="row" justifyContent="flex-end">
            <Typography variant="subtitle2">{fDate(one.created_at)}</Typography>
          </Stack>
          {/* <Typography variant='subtitle2'>{t('prescription')}:</Typography> */}
          <Box
            mt={1}
            ml={1}
            rowGap={0.5}
            columnGap={4}
            display="grid"
            gridTemplateColumns={{
              // xs: 'repeat(1, 1fr)',
              xs: 'repeat(3, 1fr)',
            }}
          >
            <Typography variant="body2" color="text.disabled">
              {t('start date')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('end date')}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {t('description')}
            </Typography>
            <Typography variant="body2">{fDate(one?.Medical_sick_leave_start)}</Typography>
            <Typography variant="body2">{fDate(one?.Medical_sick_leave_end)}</Typography>
            <Typography variant="body2">{one?.description}</Typography>
          </Box>
        </Card>
      ))}
    </Container>
  );
}
PatientSickLeaves.propTypes = {
  patient: PropTypes.object,
};
