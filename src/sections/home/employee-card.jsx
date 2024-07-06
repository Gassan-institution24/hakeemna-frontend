import PropTypes from 'prop-types';
import { Avatar, Stack, Typography } from '@mui/material'

import React from 'react'
import { useLocales } from 'src/locales';
import Iconify from 'src/components/iconify';

export default function EmployeeCard({ employee }) {
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';
    return (
        <Stack direction={{ md: 'row' }} gap={3}>
            <Avatar sx={{ width: 100, height: 100 }} src={employee.employee?.picture} />
            <Stack>
                <Typography variant='h6'>{curLangAr ? employee?.employee?.name_arabic : employee?.employee?.name_english}</Typography>
                <Typography variant='caption'>
                    {curLangAr ? employee?.employee?.speciality?.name_arabic : employee?.employee?.speciality?.name_english}
                </Typography>
                <Stack direction='row' mt={3}>
                    <Iconify icon='mdi:address-marker-outline' />
                    <Typography variant='caption'>{employee?.employee?.address}</Typography>
                </Stack>
                <Stack direction='row'>
                    <Iconify icon='solar:phone-bold' />
                    <Typography variant='caption'>{employee?.employee?.phone}</Typography>
                </Stack>
                <Stack direction='row'>
                    <Iconify icon='ic:outline-alternate-email' />
                    <Typography variant='caption'>{employee?.employee?.email}</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}
EmployeeCard.propTypes = {
    employee: PropTypes.object,
};