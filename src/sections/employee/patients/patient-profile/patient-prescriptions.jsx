import React from 'react'
import PropTypes from 'prop-types';

import { Box, Card, Stack, Container, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetPrescription } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

export default function PatientPrescriptions({ patient }) {
    const { t } = useTranslate()

    const { user } = useAuthContext()
    const { prescriptionData } = useGetPrescription({
        unit_service: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
        patient: patient?.patient?._id,
        unit_service_patient: patient?._id,
        populate: { path: 'medicines', populate: 'medicines' }
    })
    return (
        <Container maxWidth='xl'>
            {prescriptionData?.map((one, idx) => (
                <Card key={idx} sx={{ py: 3, px: 5, mb: 2 }}>
                    <Stack direction='row' justifyContent='flex-end'>
                        <Typography variant='subtitle2'>{fDate(one.created_at)}</Typography>
                    </Stack>
                    {/* <Typography variant='subtitle2'>{t('prescription')}:</Typography> */}
                    <Box
                        mt={1}
                        ml={1}
                        rowGap={0.5}
                        columnGap={4}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            md: 'repeat(4, 1fr)',
                        }}
                    >
                        <Typography variant='body2' color='text.disabled'>{t('trade name')}</Typography>
                        <Typography variant='body2' color='text.disabled'>{t('frequently')}</Typography>
                        <Typography variant='body2' color='text.disabled'>{t('start date')}</Typography>
                        <Typography variant='body2' color='text.disabled'>{t('end date')}</Typography>
                        {one.medicines?.map((medicine, indx) => (
                            <>
                                <Typography variant='body2'>{medicine?.medicines?.trade_name}{' '}-{' '}{medicine?.medicines?.concentration}</Typography>
                                <Typography variant='body2'>{medicine?.Frequency_per_day} {' '} {t('daily')}</Typography>
                                <Typography variant='body2'>{fDate(medicine?.Start_time)}</Typography>
                                <Typography variant='body2'>{fDate(medicine?.End_time)}</Typography>
                            </>
                        ))}
                    </Box>
                </Card>
            ))}
        </Container>
    )
}
PatientPrescriptions.propTypes = {
    patient: PropTypes.object,
};