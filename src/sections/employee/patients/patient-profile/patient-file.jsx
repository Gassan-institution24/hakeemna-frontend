import React from 'react'
import PropTypes from 'prop-types';

import { Card, Link, Stack, Container, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetdoctorreports } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

export default function PatientFile({ patient }) {
    const { t } = useTranslate()

    const { user } = useAuthContext()
    const { data } = useGetdoctorreports({
        unit_service: user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
        patient: patient?.patient?._id,
        unit_service_patient: patient?._id
    })
    return (
        <Container maxWidth='xl'>
            {data?.map((one, idx) => (
                <Card key={idx} sx={{ py: 3, px: 5, mb: 2 }}>
                    <Stack direction='row' justifyContent='flex-end'>
                        <Typography variant='subtitle2'>{fDate(one.created_at)}</Typography>
                    </Stack>
                    {/* <Typography variant='subtitle2'>{t('doctor notes')}:</Typography> */}
                    <Stack gap={1} mt={1} ml={1}>
                        <Typography
                            textTransform='none'
                            variant='body2'
                            dangerouslySetInnerHTML={{ __html: one.description }}
                        />
                        <Stack direction='row' gap={1} >
                            {one.file?.map((file) => (
                                <Link href={file} target="_blank" sx={{ fontSize: 14 }}>{file.name || t('file')}</Link>
                            ))}
                        </Stack>
                    </Stack>
                </Card>
            ))}
        </Container>
    )
}
PatientFile.propTypes = {
    patient: PropTypes.object,
};