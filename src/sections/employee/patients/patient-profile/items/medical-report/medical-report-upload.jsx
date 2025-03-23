import React from 'react';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
    Card,
    Stack,
    Button,
    Typography,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import {
    RHFEditor,
    RHFUpload,
} from 'src/components/hook-form';

export default function MedicalReportUpload({ patient }) {
    const { t } = useTranslate();
    const { user } = useAuthContext();

    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const { enqueueSnackbar } = useSnackbar();

    const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

    const validationSchema = yup.object().shape({
        medical_report_file: yup.mixed().nullable(),
        medical_report_description: yup.string(),
    }).test(
        'at-least-one-field',
        t('Either file or description must be provided'),
        (values) => values.medical_report_file || values.medical_report_description?.trim()
    );

    const methods = useForm({
        defaultValues: {
            medical_report_file: null,
            medical_report_description: '',
        },
        mode: 'all',
        resolver: yupResolver(validationSchema),
    });

    const handleDrop = (acceptedFile, name) => {
        const newFile = acceptedFile;
        methods.setValue(name, newFile);
    };
    const handleSubmit = methods.handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            if (patient?.patient?._id) {
                formData.append('patient', patient?.patient?._id);
            }
            if (patient?._id) {
                formData.append('unit_service_patient', patient?._id);
            }
            formData.append('unit_service', employee?.unit_service?._id);
            formData.append('employee', user?.employee?._id);
            formData.append('description', data.medical_report_description);
            data.medical_report_file?.forEach((one, idx) => {
                formData.append(`file[${idx}]`, one);
            });
            await axiosInstance.post(endpoints.medicalreports.all, formData);
            methods.reset();

            enqueueSnackbar(t('medical report added successfully'));
        } catch (e) {
            enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
                variant: 'error',
            });
        }
    })

    return (
        <FormProvider methods={methods}>
            <Card sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">{t('medical report')}</Typography>
                <RHFEditor
                    lang="en"
                    name="medical_report_description"
                    label={t('description')}
                    sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
                />
                <RHFUpload
                    multiple
                    fullWidth
                    name="medical_report_file"
                    margin="dense"
                    sx={{ mb: 2 }}
                    variant="outlined"
                    onDrop={(file) => handleDrop(file, 'medical_report_file')}
                />
                <Stack direction="row" justifyContent="flex-end">
                    <Button variant="contained" onClick={handleSubmit}>
                        {t('save')}
                    </Button>
                </Stack>
            </Card>
        </FormProvider>
    );
}
MedicalReportUpload.propTypes = {
    patient: PropTypes.object,
};
