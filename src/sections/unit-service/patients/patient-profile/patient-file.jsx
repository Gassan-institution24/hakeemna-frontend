import React from 'react'
import PropTypes from 'prop-types';
import { Box, Card, Container, Link, Stack, Typography } from '@mui/material';
import { useGetMedRecord } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { fDate } from 'src/utils/format-time';
import { useTranslate } from 'src/locales';

export default function PatientFile({ patient }) {
    const { t } = useTranslate()

    const { user } = useAuthContext()
    const { medRecord } = useGetMedRecord(user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id, patient?._id)
    return (
        <Container maxWidth='xl'>
            {medRecord?.map((one, idx) => (
                <Card key={idx} sx={{ py: 3, px: 5, mb: 2 }}>
                    <Stack direction='row' justifyContent='flex-end'>
                        <Typography variant='subtitle2'>{fDate(one.Appointment_date)}</Typography>
                    </Stack>
                    {one?.doctor_report?.length > 0 && <Stack>
                        <Typography variant='subtitle2'>{t('doctor notes')}:</Typography>
                        {one?.doctor_report?.map((report, index) => (
                            <Stack gap={1} mt={1} ml={1} key={index}>
                                <Typography variant='body2'>{report.description}</Typography>
                                <Stack direction='row' gap={1} key={index}>
                                    {report.file?.map((file) => (
                                        <Link href={file} target="_blank" sx={{ fontSize: 14 }}>{file.name || t('file')}</Link>
                                    ))}
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>}
                    {one?.Drugs_report?.length > 0 && <Stack sx={{ mt: 1 }}>
                        <Typography variant='subtitle2'>{t('prescription')}:</Typography>
                        {one?.Drugs_report?.map((drug, index) => (
                            // <Stack key={index}>
                            <Box
                                key={index}
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
                                {drug.medicines?.map((medicine, indx) => (
                                    <>
                                        <Typography variant='body2'>{medicine?.medicines?.trade_name}{' '}-{' '}{medicine?.medicines?.concentration}</Typography>
                                        <Typography variant='body2'>{medicine?.Frequency_per_day} {' '} {t('daily')}</Typography>
                                        <Typography variant='body2'>{fDate(medicine?.Start_time)}</Typography>
                                        <Typography variant='body2'>{fDate(medicine?.End_time)}</Typography>
                                    </>
                                ))}
                            </Box>
                            // </Stack>
                        ))}
                    </Stack>}
                </Card>
            ))}
        </Container>
    )
}
PatientFile.propTypes = {
    patient: PropTypes.object,
};