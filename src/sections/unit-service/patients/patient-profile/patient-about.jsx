import React from 'react'
import PropTypes from 'prop-types';

import { Box, Card, Stack, Container, Typography } from '@mui/material'

import { useLocales, useTranslate } from 'src/locales';

export default function PatientAbout({ patient }) {
    const { t } = useTranslate();
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const patientData = patient.patient ? patient.patient : patient

    return (
        <Container maxWidth='xl'>
            <Card sx={{ px: 4, py: 4 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    <Stack>
                        <Typography variant='subtitle2'>{t('drug allergies')}</Typography>
                        <ul>
                            {patientData?.drug_allergies?.map((drug, index) => (
                                <li key={index}>
                                    {curLangAr ? drug?.name_arabic : drug?.name_english}
                                </li>
                            ))}
                        </ul>
                    </Stack>
                    <Stack>
                        <Typography variant='subtitle2'>{t('diseases')}</Typography>
                        <ul>
                            {patientData?.diseases?.map((disease, index) => (
                                <li key={index}>
                                    {curLangAr ? disease?.name_arabic : disease?.name_english}
                                </li>
                            ))}
                        </ul>
                    </Stack>
                    <Stack>
                        <Typography variant='subtitle2'>{t('surgeries')}</Typography>
                        <ul>
                            {patientData?.surgeries?.map((surgery, index) => (
                                <li key={index}>
                                    {curLangAr ? surgery?.name_arabic : surgery?.name_english}
                                </li>
                            ))}
                        </ul>
                    </Stack>
                    <Stack>
                        <Typography variant='subtitle2'>{t('medicines')}</Typography>
                        <ul>
                            {patientData?.medicines?.map((medicine, index) => (
                                <li key={index}>
                                    {curLangAr ? medicine?.medicine?.name_arabic : medicine?.medicine?.name_english}
                                </li>
                            ))}
                        </ul>
                    </Stack>
                </Box>
            </Card>
        </Container>
    )
}
PatientAbout.propTypes = {
    patient: PropTypes.object,
};