import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm, useFieldArray } from 'react-hook-form';

import { Box, Card, Stack, Button, Divider, TextField, Typography, IconButton, Autocomplete } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetMedicines } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFCheckbox, RHFTextField, RHFDatePicker } from 'src/components/hook-form';

export default function PrescriptionItem({ one, refetch }) {
    const { t } = useTranslate();
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const [medSerach, setMedSerach] = useState();
    const [loading, setloading] = useState(false);

    const debouncedQuery = useDebounce(medSerach);

    const { medicinesData } = useGetMedicines({
        select: 'trade_name concentration',
        search: debouncedQuery,
    });

    const { enqueueSnackbar } = useSnackbar()
    const [editting, setEditting] = useState(false)

    const defaultDrug = {
        unit_service: one?.unit_service?._id || one?.unit_service || '',
        employee: one?.employee?._id || one?.employee || '',
        patient: one?.patient?._id || one?.patient || '',
        unit_service_patient: one?.unit_service_patient?._id || one?.unit_service_patient || '',
        medicines: null,
        Frequency_per_day: '',
        Start_time: '',
        End_time: '',
        Doctor_Comments: '',
    };

    const methods = useForm({
        defaultValues: {
            medicines: one?.medicines || [defaultDrug],
        },
    });

    const { handleSubmit, control, setValue, watch } = methods;
    const values = watch()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'medicines',
    });

    const appendDrug = () => {
        append(defaultDrug);
        setMedSerach();
    };

    const removeDrug = (index) => {
        remove(index);
        setloading(true);
        setTimeout(() => {
            setloading(false);
        }, 100);
    };
    const chronicChange = (index) => {
        if (!values.medicines[index].chronic) {
            setValue(`medicines[${index}].Start_time`, null);
            setValue(`medicines[${index}].End_time`, null);
        }
        setValue(`medicines[${index}].chronic`, !values.medicines[index].chronic);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            await axiosInstance.patch(endpoints.prescription.one(one?._id), data);
            setEditting(false)
            refetch()
            // eslint-disable-next-line
            enqueueSnackbar(`${t('prescription')} ${t('added successfully')}`);
        } catch (e) {
            enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
                variant: 'error',
            });
        }
    });

    return (
        <Card sx={{ py: 3, px: 5, mb: 2 }}>
            {editting ?
                <FormProvider methods={methods}>
                    <Stack direction="row" justifyContent="flex-end" alignItems='center' gap={2} >
                        <IconButton onClick={() => setEditting(false)}><Iconify icon='mingcute:close-fill' /></IconButton>
                    </Stack>
                    <Typography variant="subtitle1">{t('prescription')}</Typography>
                    {!loading &&
                        fields.map((_, index) => (
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                alignItems="center"
                                rowGap={2}
                                columnGap={1}
                                mt={2}
                            >
                                <Autocomplete
                                    sx={{ minWidth: 300, flex: 1 }}
                                    options={medicinesData}
                                    onChange={(event, newValue) =>
                                        setValue(`medicines[${index}].medicines`, newValue?._id)
                                    }
                                    getOptionLabel={(option) => option.trade_name || ''}
                                    onBlur={() => setMedSerach()}
                                    onInputChange={(event, newInputValue) => {
                                        setMedSerach(newInputValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={t('medicine')} variant="outlined" />
                                    )}
                                />
                                <RHFTextField
                                    sx={{ minWidth: 350, flex: 1 }}
                                    name={`medicines[${index}].Frequency_per_day`}
                                    label={t('frequency')}
                                />
                                <RHFDatePicker
                                    sx={{ minWidth: 200, flex: 1 }}
                                    name={`medicines[${index}].Start_time`}
                                    label={t('start date')}
                                />
                                <RHFDatePicker
                                    sx={{ minWidth: 200, flex: 1 }}
                                    name={`medicines[${index}].End_time`}
                                    label={t('end date')}
                                    shouldDisableDate={(date) => date < new Date(watch(`medicines[${index}].Start_time`))}
                                />
                                <RHFTextField
                                    sx={{ minWidth: 350, flex: 1 }}
                                    name={`medicinesv[${index}].Doctor_Comments`}
                                    label={t('doctor comment')}
                                />
                                <RHFCheckbox
                                    onChange={() => chronicChange(index)}
                                    sx={{ minWidth: 300, flex: 1 }}
                                    name={`medicines[${index}].chronic`}
                                    label={t('chronic')}
                                />
                                <IconButton color="error" onClick={() => removeDrug(index)}>
                                    <Iconify width={25} icon="mi:delete" />
                                </IconButton>
                            </Stack>
                        ))}
                    <Divider sx={{ mt: 2 }} />
                    <Button color="success" onClick={appendDrug}>
                        <Iconify width={20} icon="ri:add-line" />
                        {t('add')}
                    </Button>
                    <Stack alignItems="end">
                        <Button variant="contained" onClick={onSubmit} sx={{ mt: 2 }}>
                            {t('save')}
                        </Button>
                    </Stack>
                </FormProvider>
                :
                <>
                    <Stack direction="row" justifyContent="flex-end" alignItems='center' gap={2} >
                        <Typography variant="subtitle2">{fDate(one.created_at)}</Typography>
                        <IconButton onClick={() => setEditting(true)}><Iconify icon='lets-icons:edit-fill' /></IconButton>
                    </Stack>
                    <Box
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
                        <Typography variant="body2" color="text.disabled">
                            {t('trade name')}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            {t('frequently')}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            {t('start date')}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            {t('end date')}
                        </Typography>
                        {one.medicines?.map((medicine, indx) => (
                            <>
                                <Typography variant="body2">
                                    {medicine?.medicines?.trade_name} - {medicine?.medicines?.concentration}
                                </Typography>
                                <Typography variant="body2">{medicine?.Frequency_per_day}</Typography>
                                <Typography variant="body2">{fDate(medicine?.Start_time)}</Typography>
                                <Typography variant="body2">{fDate(medicine?.End_time)}</Typography>
                            </>
                        ))}
                    </Box>
                </>
            }
        </Card>
    );
}
PrescriptionItem.propTypes = {
    one: PropTypes.object,
    refetch: PropTypes.func,
};
