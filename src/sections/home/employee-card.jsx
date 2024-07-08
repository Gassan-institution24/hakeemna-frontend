import PropTypes from 'prop-types';
import { Avatar, Dialog, Stack, Typography } from '@mui/material'

import { useGetEmployeeAppointments } from 'src/api';
import React, { useState } from 'react'
import { useLocales, useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import BookDetails from './book-details';
import JwtRegisterView from '../auth/jwt-register-view';
import ClassicVerifyView from '../auth/verify-email';
import { JwtLoginView } from '../auth';

export default function EmployeeCard({ employee }) {
    const { t } = useTranslate()
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const [page, setPage] = useState(1);
    const [signupDialog, setSignupDialog] = useState(false);
    const [patientId, setPatientId] = useState()
    const [selected, setSelected] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { appointmentsData, AppointDates, loading, refetch } = useGetEmployeeAppointments({
        id: employee._id,
        filters: { status: 'available', startDate: selectedDate },
    });

    const timeListChangeHandler = (newValue) => {
        setSelected(newValue);
        setSignupDialog(true)
        // setTimeListItem(newValue);
    };


    return (
        <>
            <Stack direction={{ md: 'row' }} justifyContent='space-between' padding={3} sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                <Stack direction={{ md: 'row' }} gap={10}>
                    <Image sx={{ width: 150, height: 150 }} src={employee.employee?.picture} />
                    <Stack sx={{ gap: 1, width: { md: 300 } }}>
                        <Stack mb={3}>
                            <Typography variant='h6'>{curLangAr ? employee?.employee?.name_arabic : employee?.employee?.name_english}</Typography>
                            <Typography variant='caption'>
                                {curLangAr ? employee?.employee?.speciality?.name_arabic : employee?.employee?.speciality?.name_english}
                            </Typography>
                        </Stack>
                        {employee?.employee?.address && <Stack direction='row' >
                            <Iconify width={16} icon='mdi:address-marker-outline' />
                            <Typography variant='caption'>{employee?.employee?.address}</Typography>
                        </Stack>}
                        {employee?.employee?.phone && <Stack direction='row'>
                            <Iconify width={16} icon='solar:phone-bold' />
                            <Typography variant='caption'>{employee?.employee?.phone}</Typography>
                        </Stack>}
                        {employee?.employee?.email && <Stack direction='row'>
                            <Iconify width={16} icon='ic:outline-alternate-email' />
                            <Typography variant='caption'>{employee?.employee?.email}</Typography>
                        </Stack>}
                        <Stack direction='row' gap={1} alignItems='center'>
                            <Typography variant='caption'>{t('insurance')}:</Typography>
                            {employee?.unit_service?.insurance?.map((one) => (
                                <Typography variant='caption'>{curLangAr ? one.name_arabic : one.name_english}</Typography>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction={{ md: 'row' }} gap={{ md: 10 }}>
                    {appointmentsData.length > 0 && <BookDetails
                        selected={selected}
                        AppointDates={AppointDates}
                        loading={loading}
                        timeListChangeHandler={timeListChangeHandler}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        list={appointmentsData}
                    />}
                    {appointmentsData.length < 1 &&
                        <Typography>{t('no appointment found')}</Typography>
                    }
                </Stack>
            </Stack>
            <Dialog open={signupDialog} onClose={() => setSignupDialog(false)} sx={{ minWidth: '60vw' }} >
                <Stack sx={{ p: 4 }}>
                    {page === 1 && <JwtRegisterView afterSignUp={() => setPage(2)} onSignIn={() => setPage(3)} setPatientId={setPatientId} />}
                    {page === 2 && <ClassicVerifyView onVerify={() => setSignupDialog(false)} patientId={patientId} selected={selected} refetch={refetch} />}
                    {page === 3 && <JwtLoginView onSignin={() => setSignupDialog(false)} onSignUp={() => setPage(1)} setPatientId={setPatientId} selected={selected} refetch={refetch} />}
                </Stack>
            </Dialog>
        </>
    )
}
EmployeeCard.propTypes = {
    employee: PropTypes.object,
};