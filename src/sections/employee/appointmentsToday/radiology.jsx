import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import {
    Button,
    Dialog,
    Divider,
    TextField,
    Typography,
    DialogTitle,
    Autocomplete,
    DialogActions,
    DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetImagings } from 'src/api/imaging';
import { useGeEntranceRadiologyPatient } from 'src/api/radiology_patient';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function Radiology({ Entrance }) {
    const { user } = useAuthContext();
    const router = useRouter();
    const { radiologyData, refetch } = useGeEntranceRadiologyPatient(Entrance?._id);
    const prescriptionDialog = useBoolean();
    const { imagingData } = useGetImagings();


    const { t } = useTranslate();
    const [hoveredButtonId, setHoveredButtonId] = useState(null);
    const [radiology, setradiology] = useState([{ id: 0 }]);


    const handleHover = (hoveredId) => {
        setHoveredButtonId(hoveredId);
    };
    const handleMouseOut = () => {
        setHoveredButtonId(null);
    };
    const handleViewClick = (idd) => {
        router.push(paths.employee.prescription(idd));
    };

    const addMedicalAnalysisField = () => {
        const newItem = { id: radiology.length };

        setradiology((prev) => [...prev, newItem]);

        setValue(`radiology[${radiology.length}]`, {
            radiology: null,
            Doctor_Comments: '',
        });
    };


    const removeremoveRadiology = (id) => {
        const filtered = radiology.filter((item) => item.id !== id);
        setradiology(filtered);

        setValue(
            'radiology',
            filtered.map(() => ({
                radiology: null,
                Doctor_Comments: '',
            }))
        );
    };


    const medicalAnalysisSchema = Yup.object().shape({
        employee: Yup.string(),
        patient: Yup.string(),
        entrance_mangament: Yup.string(),
        Doctor_Comments: Yup.string(),
        radiology: Yup.array().of(
            Yup.object().shape({
                radiology: Yup.string().required('Required'),
                Doctor_Comments: Yup.string(),
            })
        ),
    });

    const defaultValues = {
        radiology: [
            {
                employee: user?.employee?._id || '',
                patient: Entrance?.patient?._id || '',
                unit_service:
                    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
                        ?._id,
                unit_service_patient: Entrance?.unit_service_patient,
                entrance_mangament: Entrance?._id || '',
                radiology: null,
                Doctor_Comments: '',
            },
        ],
    };

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(medicalAnalysisSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        control,
        setValue,
        formState: { isSubmitting },
    } = methods;

    const removeRadiology = async (IdToremove) => {
        await axiosInstance.delete(endpoints.radiologyPatient.one(Entrance?.unit_service_patient, IdToremove));
        const historyId = localStorage.getItem(`historyId${Entrance?.appointmentId}`);
        await axiosInstance.patch(endpoints.history.remove_id(historyId), {
            type: 'radiology',
            id: IdToremove,
        });

        enqueueSnackbar(t('Field removed successfully'), { variant: 'success' });
        refetch();
        reset();
    };





    const onSubmit = async (data) => {
        try {
            const historyId = localStorage.getItem(
                `historyId${Entrance?.appointmentId}`
            );

            const payload = {
                employee: user?.employee?._id,
                patient: Entrance?.patient?._id,
                unit_service:
                    user?.employee?.employee_engagements?.[
                        user.employee.selected_engagement
                    ]?.unit_service?._id,
                unit_service_patient: Entrance?.unit_service_patient,
                entrance_mangament: Entrance?._id,
                appointment: Entrance?.appointmentId,
                radiology: data.radiology,
            };

            const response = await axiosInstance.post(
                endpoints.radiologyPatient.all,
                payload
            );

            await axiosInstance.patch(
                endpoints.history.one(historyId),
                {
                    radiology: true,
                    radiologyId: response.data._id,
                }
            );

            enqueueSnackbar('radiology added successfully', {
                variant: 'success',
            });

            prescriptionDialog.onFalse();
            refetch();
            reset();
            setradiology([{ id: 0 }]);
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Error uploading data', {
                variant: 'error',
            });
        }
    };


    useEffect(() => {
        reset({
            radiology: [
                {
                    employee: user?.employee?._id || '',
                    patient: Entrance?.patient?._id || '',
                    unit_service:
                        user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
                            ?._id,
                    unit_service_patient: Entrance?.unit_service_patient,
                    entrance_mangament: Entrance?._id || '',
                    radiology: null,
                    Doctor_Comments: '',
                },
            ],
        });
    }, [user, Entrance, reset]);
    const watchAnalyses = methods.watch('radiology');

    return (
        <>
            <Button variant="outlined" color="success" onClick={prescriptionDialog.onTrue} sx={{ m: 2 }}>
                {t('add radiology')}
                <Iconify icon="mingcute:add-line" />
            </Button>
            {radiologyData?.map((info, i) => (
                <Typography
                    variant="h6"
                    sx={{
                        bgcolor: '#fff',
                        m: 2,
                        border: 2,
                        borderRadius: 2,
                        borderColor: '#EDEFF2',
                        p: 2,
                    }}
                    key={i}
                >
                    {info?.radiology?.map((item, index) => (
                        <ul
                            key={index}
                            style={{
                                listStyleType: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <li>
                                {item?.radiology?.diagnostic_test}
                            </li>
                        </ul>
                    ))}
                    <br />
                    <Button
                        onMouseOver={() => handleHover(info?._id)}
                        onMouseOut={handleMouseOut}
                        onClick={() => handleViewClick(info?._id)}
                        sx={{ m: 1 }}
                    >
                        {t('View')} &nbsp;{' '}
                        <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
                    </Button>

                    <Button onClick={() => removeRadiology(info?._id)}>
                        {t('Remove')} &nbsp; <Iconify icon="flat-color-icons:delete-database" />
                    </Button>
                </Typography>
            ))}
            <Dialog open={prescriptionDialog.value} onClose={prescriptionDialog.onFalse}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
                        {t('add radiology')}
                    </DialogTitle>
                    <DialogContent>
                        {radiology?.map((prescription, index) => (
                            <div key={prescription.id}>
                                <Autocomplete
                                    sx={{ minWidth: 300, flex: 1, my: 2 }}
                                    options={(imagingData || []).filter(
                                        (option) =>
                                            !watchAnalyses?.some(
                                                (selected, i) => i !== index && selected?.radiology === option._id
                                            )
                                    )}
                                    onChange={(event, newValue) =>
                                        setValue(
                                            `radiology[${index}].radiology`,
                                            newValue?._id || '',
                                            { shouldValidate: true }
                                        )

                                    }
                                    // eslint-disable-next-line
                                    getOptionLabel={(option) => option.diagnostic_test}


                                    renderInput={(params) => (
                                        <TextField {...params} label={t('radiology')} variant="outlined" />
                                    )}
                                />



                                <Controller
                                    name={`radiology[${index}].Doctor_Comments`}
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <RHFTextField
                                            {...field}
                                            label={t('doctor comment')}
                                            multiline
                                            sx={{ mb: 2 }}
                                            error={!!error}
                                            helperText={error?.message}
                                        />
                                    )}
                                />
                                <Button
                                    onClick={() => removeremoveRadiology(prescription.id)}
                                    sx={{ mt: 2, mb: 2 }}
                                    variant="outlined"
                                    disabled={radiology.length === 1} // Disable if only one prescription
                                >
                                    {t('remove radiology')}
                                </Button>

                                {index === radiology.length - 1 && (
                                    <Button
                                        onClick={addMedicalAnalysisField}
                                        sx={{ ml: 2, bgcolor: 'success.main', display: 'inline' }}
                                        variant="contained"
                                    >
                                        {t('Add more')}
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Divider />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="inherit" onClick={prescriptionDialog.onFalse}>
                            {t('Cancel')}
                        </Button>
                        <Button type="submit" loading={isSubmitting} variant="contained">
                            {t('Upload')}
                        </Button>
                    </DialogActions>
                </FormProvider>
            </Dialog>
        </>
    );
}

Radiology.propTypes = {
    Entrance: PropTypes.object,
};
