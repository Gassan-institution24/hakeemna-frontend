import * as yup from 'yup'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Card, Stack, Button, Typography } from '@mui/material'

import axiosInstance, { endpoints } from 'src/utils/axios'

import { useAuthContext } from 'src/auth/hooks'
import { useLocales, useTranslate } from 'src/locales'

import FormProvider, { RHFEditor, RHFDatePicker } from 'src/components/hook-form'

function CommunicationUpload({ patient }) {
    const { t } = useTranslate()
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';
    const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

    const methods = useForm({
        defaultValues: useMemo(() => ({
            date: null,
            description: '',
        }), []),
        mode: 'all',
        resolver: yupResolver(yup.object().shape({
            date: yup.date().required(),
            description: yup.string().required(),
        })),
    });

    const handleSubmit = methods.handleSubmit(async (data) => {
        try {
            await axiosInstance.post(endpoints.uspcommunication.all, {
                patient: patient?.patient?._id,
                unit_service_patient: patient?._id,
                unit_services: employee?.unit_service?._id,
                employee: user?.employee?._id,
                date: data.date,
                description: data.description,
            });
            methods.reset();
            enqueueSnackbar(t('communication added successfully'));
        } catch (e) {
            enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
                variant: 'error',
            });
        }
    });


    return (
        <FormProvider methods={methods}>
            <Card sx={{ p: 2, mb: 2 }}>
                <Stack gap={2}>
                    <Typography variant="subtitle1">{t('communication')}</Typography>
                    <RHFDatePicker name="date" label={t('date')} />
                    <RHFEditor
                        lang="en"
                        name="description"
                        label={t('description')}
                        sx={{ textTransform: 'lowercase' }}
                    />
                    <Stack direction="row" justifyContent="flex-end">
                        <Button variant="contained" onClick={handleSubmit}>
                            {t('save')}
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </FormProvider>
    )
}

export default CommunicationUpload

CommunicationUpload.propTypes = {
    patient: PropTypes.object,
};