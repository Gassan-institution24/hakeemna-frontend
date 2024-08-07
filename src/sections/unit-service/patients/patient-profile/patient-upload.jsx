import React from 'react'
import PropTypes from 'prop-types';

import { Box, Button, Card, Container, Typography } from '@mui/material'
import { useTranslate } from 'src/locales'
import { RHFEditor, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export default function PatientUpload({ patient }) {
    const { t } = useTranslate()
    const { user } = useAuthContext()
    const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement]._id

    const methods = useForm({
        mode: 'onTouched',
    });

    const {
        watch,
        setValue,
    } = methods;
    const values = watch()

    const handleDrop = (acceptedFile) => {
        const newFile = acceptedFile;
        setValue('file', newFile);
    };
    const handleSubmit = async () => {
        await axiosInstance.post(endpoints.medicalreports.all, {
            patient: patient._id, unit_service: employee?.unit_service?._id, employee: employee._id,
            description: values.description,
            file: values.file
        })
    }
    return (
        <Container maxWidth='xl'>
            <FormProvider methods={methods} >
                <Box
                    rowGap={4}
                    columnGap={4}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        md: 'repeat(2, 1fr)',
                        xl: 'repeat(3, 1fr)',
                    }}
                >
                    <Card sx={{ p: 2 }}>
                        <Typography variant='subtitle1'>{t('patient record')}</Typography>
                        <RHFTextField
                            lang="en"
                            multiline
                            name="description"
                            label={t('description')}
                            sx={{ mb: 2, mt: 2 }}
                        />
                        <RHFUpload
                            multiple
                            autoFocus
                            fullWidth
                            name="file"
                            margin="dense"
                            sx={{ mb: 2 }}
                            variant="outlined"
                            onDrop={handleDrop}
                        />
                    </Card>
                    <Card sx={{ p: 2 }}>
                        <Typography variant='subtitle1'>{t('medical report')}</Typography>
                        <RHFEditor
                            lang="en"
                            // multiline
                            // rows={3}
                            name="description"
                            label={t('description')}
                            sx={{ mb: 2, mt: 2 }}
                        />
                        {/* <RHFTextField
                            lang="en"
                            multiline
                            rows={3}
                            name="description"
                            label={t('description')}
                            sx={{ mb: 2, mt: 2 }}
                        /> */}
                        <RHFUpload
                            multiple
                            autoFocus
                            fullWidth
                            name="file"
                            margin="dense"
                            sx={{ mb: 2 }}
                            variant="outlined"
                            onDrop={handleDrop}
                        />
                        <Button onClick={handleSubmit}>{t('upload')}</Button>
                    </Card>
                    <Card sx={{ p: 2 }}>
                        <Typography variant='subtitle1'>{t('prescription')}</Typography>
                        <RHFTextField
                            lang="en"
                            multiline
                            name="description"
                            label={t('description')}
                            sx={{ mb: 2, mt: 2 }}
                        />
                        <RHFUpload
                            multiple
                            autoFocus
                            fullWidth
                            name="file"
                            margin="dense"
                            sx={{ mb: 2 }}
                            variant="outlined"
                            onDrop={handleDrop}
                        />
                    </Card>
                    <Card sx={{ p: 2 }}>
                        <Typography variant='subtitle1'>{t('sick leave')}</Typography>
                        <RHFTextField
                            lang="en"
                            multiline
                            name="description"
                            label={t('description')}
                            sx={{ mb: 2, mt: 2 }}
                        />
                        <RHFUpload
                            multiple
                            autoFocus
                            fullWidth
                            name="file"
                            margin="dense"
                            sx={{ mb: 2 }}
                            variant="outlined"
                            onDrop={handleDrop}
                        />
                    </Card>
                </Box>
            </FormProvider>
        </Container>
    )
}
PatientUpload.propTypes = {
    patient: PropTypes.object,
};