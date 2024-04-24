import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { useMemo } from 'react';

import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';

import { useLocales, useTranslate } from 'src/locales';

// import CustomPopover from "src/components/custom-popover";
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Box, MenuItem, Popover, PopoverPaper, Stack } from '@mui/material';
import CustomPopover from 'src/components/custom-popover';

export default function TicketPopover({ open, onClose }) {
    const { t } = useTranslate()
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const { enqueueSnackbar } = useSnackbar();

    const NewUserSchema = Yup.object().shape({
        first_name: Yup.string().required(t('required field')),
        family_name: Yup.string().required(t('required field')),
        identification_num: Yup.string().required(t('required field')),
        birth_date: Yup.date().nullable(),
        marital_status: Yup.string(),
        nationality: Yup.string().nullable(),
        country: Yup.string().required(t('required field')),
        city: Yup.string().required(t('required field')),
        email: Yup.string().required(t('required field')),
        mobile_num1: Yup.string().required(t('required field')),
        mobile_num2: Yup.string(),
        gender: Yup.string(),
    });

    const methods = useForm({
        mode: 'onTouched',
        resolver: yupResolver(NewUserSchema),
    });

    const {
        reset,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (data._id) {
                // await axios.patch(endpoints.appointments.book(appointment._id), {
                //     patient: data._id,
                // });
            } else {
                await axios.patch(
                    // endpoints.appointments.patient.createPatientAndBookAppoint(appointment._id),
                    data
                );
            }
            // refetch();

            onClose();
        } catch (error) {
            // error emitted in backend
            enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
                variant: 'error',
            });
            console.error(error);
        }
    });

    return (
        <CustomPopover
            open={open}
            arrow={curLangAr ? 'right-bot' : 'left-bottom'}
            sx={{ backgroundColor: 'white' }}
            // sx={{ position: 'fixed', bottom: {md: 30, sm: 10 }, right: {md: 30, sm: 10 }, zIndex: 99 }}
            onClose={onClose}
        >
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack sx={{ p: 3 }} spacing={2.5}>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        width="auto"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                        }}
                    >
                        <RHFTextField variant='standard' name="first_name" label={t('first name')} />
                        <RHFTextField variant='standard' name="family_name" label={t('family name')} />
                        {/* <RHFTextField variant='standard' name="email" label={t('email')} />
                        <RHFTextField variant='standard' name="identification_num" label={t('ID number')} />
                        <RHFTextField variant='standard' type="number" name="mobile_num1" label={t('mobile number')} />
                        <RHFTextField variant='standard'
                            type="number"
                            name="mobile_num2"
                            label={t('alternative mobile number')}
                        /> */}

                        {/* <RHFSelect
                                name="city"
                                label="City"
                                PaperPropsSx={{ textTransform: 'capitalize' }}
                            // InputLabelProps={{ shrink: true }}
                            >
                                {tableData.map((option, index, idx) => (
                                    <MenuItem lang="ar" key={idx} value={option._id}>
                                        {curLangAr ? option?.name_arabic : option?.name_english}
                                    </MenuItem>
                                ))}
                            </RHFSelect> */}
                        <RHFSelect
                            variant='standard'
                            name="marital_status"
                            label={t('marital status')}
                        // InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem lang="ar" value="single">
                                {t('single')}
                            </MenuItem>
                            <MenuItem lang="ar" value="married">
                                {t('married')}
                            </MenuItem>
                            <MenuItem lang="ar" value="widowed">
                                {t('widowed')}
                            </MenuItem>
                            <MenuItem lang="ar" value="separated">
                                {t('separated')}
                            </MenuItem>
                            <MenuItem lang="ar" value="divorced">
                                {t('divorced')}{' '}
                            </MenuItem>
                        </RHFSelect>
                        <RHFSelect
                            variant='standard'
                            name="gender"
                            label={t('gender')}
                        // InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem lang="ar" value="male">
                                {t('male')}
                            </MenuItem>
                            <MenuItem lang="ar" value="female">
                                {t('female')}
                            </MenuItem>
                        </RHFSelect>
                    </Box>
                </Stack>
            </FormProvider>
        </CustomPopover>
    )
}
TicketPopover.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};
