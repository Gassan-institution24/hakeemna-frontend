import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import FormProvider, {
    RHFDatePicker,
    RHFTimePicker,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AttendanceEdit({ row, open, onClose, refetch, employeeId }) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslate()
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';
    const attendanceSchema = Yup.object().shape({
        date: Yup.date().nullable(),
        check_in_time: Yup.date().nullable(),
        check_out_time: Yup.date().nullable(),
        leave_end: Yup.date().nullable(),
        leave_start: Yup.date().nullable(),
        employee_engagement: Yup.string().nullable(),
    });

    const defaultValues = {
        date: row?.date || null,
        check_in_time: row?.check_in_time || null,
        check_out_time: row?.check_out_time || null,
        leave_end: row?.leave_end || null,
        leave_start: row?.leave_start || null,
        employee_engagement: employeeId || ''
    };

    const methods = useForm({
        resolver: yupResolver(attendanceSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (row?._id) {
                await axiosInstance.patch(endpoints.attendence.one(row?._id), data)
                onClose();
                refetch()
                enqueueSnackbar(t('updated successfuly'))
            } else {
                await axiosInstance.post(endpoints.attendence.create, data)
                onClose();
                refetch()
                enqueueSnackbar(t('created successfuly'))
            }
        } catch (error) {
            enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
                variant: 'error',
            });
        }
    });

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{row ? t('Edit Attendance details') : t('Create New Attendance')}</DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={3} mt={2}>
                        <RHFDatePicker name='date' label={t('Date')} />
                        <RHFTimePicker name='check_in_time' label={t('Check in time')} />
                        <RHFTimePicker name='check_out_time' label={t('Check out time')} />
                        <RHFTimePicker name='leave_start' label={t('Leave start')} />
                        <RHFTimePicker name='leave_end' label={t('Leave end')} />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button color="inherit" variant="outlined" onClick={onClose}>
                        {t('Cancel')}
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {t("Save")}
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}

AttendanceEdit.propTypes = {
    refetch: PropTypes.func,
    onClose: PropTypes.func,
    employeeId: PropTypes.string,
    open: PropTypes.bool,
    row: PropTypes.object
};
