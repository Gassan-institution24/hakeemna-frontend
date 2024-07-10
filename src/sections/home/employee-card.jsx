import PropTypes from 'prop-types';
import { Avatar, Dialog, Rating, Stack, Typography } from '@mui/material'
import { fCurrency } from 'src/utils/format-number';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
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

    const router = useRouter()

    const [page, setPage] = useState(1);
    const [signupDialog, setSignupDialog] = useState(false);
    const [patientId, setPatientId] = useState()
    const [selected, setSelected] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { appointmentsData, AppointDates, loading, refetch } = useGetEmployeeAppointments({
        id: employee._id,
        filters: { status: 'available', startDate: selectedDate, online_available: true },
    });

    const timeListChangeHandler = (newValue) => {
        setSelected(newValue);
        setSignupDialog(true)
        // setTimeListItem(newValue);
    };


    return (
        <>
            <Stack direction={{ lg: 'row' }} gap={3} justifyContent='space-between' padding={3} sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                <Stack direction={{ md: 'row' }} gap={{ md: 10 }}>
                    <Image onClick={() => router.push(paths.pages.doctor(employee._id))} sx={{ width: 150, height: 150, cursor: 'pointer' }} src={employee.employee?.picture} />
                    <Stack sx={{ gap: 1 }}>
                        <Stack mb={3}>
                            <Stack direction='row' alignItems='flex-end'>
                                <Typography onClick={() => router.push(paths.pages.doctor(employee._id))} variant='h6' mr={5} sx={{ cursor: 'pointer' }} >{curLangAr ? employee?.employee?.name_arabic : employee?.employee?.name_english}</Typography>
                                <Rating size="small" readOnly value={employee.employee?.rate} precision={0.1} max={5} />
                                <Typography variant='caption' textTransform='lowercase'>({employee.employee?.rated_times}) {t('people rate')}</Typography>
                            </Stack>
                            <Typography variant='body2'>
                                {curLangAr ? employee?.employee?.speciality?.name_arabic : employee?.employee?.speciality?.name_english}
                            </Typography>
                            <Typography variant='body2'>
                                {curLangAr ? employee?.unit_service?.name_arabic : employee?.unit_service?.name_english}
                            </Typography>
                        </Stack>
                        {employee?.fees && <Stack direction='row' gap={1} mb={2} >
                            <Typography variant='body2'>{t('fees')}:</Typography>
                            <Typography variant='body2'>{fCurrency(employee?.fees, employee.currency?.symbol)}</Typography>
                        </Stack>}
                        {employee?.unit_service?.address && <Stack direction='row' gap={1} >
                            <Typography variant='body2'>{t('address')}:</Typography>
                            <Typography variant='body2'>{employee?.unit_service?.address}</Typography>
                        </Stack>}
                        {employee?.employee?.phone && <Stack direction='row' gap={1}>
                            {/* <Iconify width={16} icon='solar:phone-bold' /> */}
                            <Typography variant='body2'>{t('phone number')}:</Typography>
                            <Typography variant='body2'>{employee?.employee?.phone}</Typography>
                        </Stack>}
                        {employee?.employee?.email && <Stack direction='row' gap={1}>
                            {/* <Iconify width={16} icon='ic:outline-alternate-email' /> */}
                            <Typography variant='body2'>{t('email')}:</Typography>
                            <Typography variant='body2'>{employee?.employee?.email}</Typography>
                        </Stack>}
                        <Stack direction='row' gap={1}>
                            <Typography variant='body2'>{t('insurance')}:</Typography>
                            <Stack>
                                {employee?.unit_service?.insurance?.length > 5 ? employee?.unit_service?.insurance?.filter((one, index) => index <= 5).map((one) => (
                                    <Typography variant='body2'>{curLangAr ? one.name_arabic : one.name_english}</Typography>
                                )) : employee?.unit_service?.insurance?.map((one) => (
                                    <Typography variant='body2'>{curLangAr ? one.name_arabic : one.name_english}</Typography>
                                ))}
                                {employee?.unit_service?.insurance?.length > 5 && `+${employee.unit_service.insurance.length - 5}`}
                            </Stack>
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
            <Dialog fullWidth open={signupDialog} minWidth='lg' onClose={() => setSignupDialog(false)} >
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