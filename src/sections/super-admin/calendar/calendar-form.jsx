import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { fTimestamp } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
// import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, { RHFSwitch, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CalendarForm({ currentEvent, refetch, colorOptions, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  // const { user } = useAuthContext();
  const { t } = useTranslate();

  const EventSchema = Yup.object().shape({
    title: Yup.string()
      .max(255, `${t('must be at most')} 255`)
      .required(t('required field')),
    description: Yup.string().max(5000, `${t('must be at most')} 5000`),
    // not required
    color: Yup.string(),
    allDay: Yup.boolean(),
    start: Yup.mixed(),
    end: Yup.mixed(),
  });

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = values.start && values.end ? values.start > values.end : false;

  const onSubmit = handleSubmit(async (data) => {
    const eventData = {
      ...data,
      superadmin: true,
    };

    try {
      if (!dateError) {
        if (currentEvent?._id) {
          await axiosInstance.patch(`${endpoints.calender.all}/${currentEvent?._id}`, eventData);
          enqueueSnackbar(t('updated successfully!'));
        } else {
          await axiosInstance.post(endpoints.calender.all, eventData);
          enqueueSnackbar(t('created successfully!'));
        }
        refetch();
        onClose();
        reset();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const onDelete = useCallback(async () => {
    try {
      await axiosInstance.delete(`${endpoints.calender.all}/${currentEvent?._id}`);
      enqueueSnackbar(t('deleted successfully!'));
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [currentEvent, enqueueSnackbar, t, onClose, refetch]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="title" label={t('title')} />

        <RHFTextField name="description" label={t('description')} multiline rows={3} />

        <RHFSwitch name="allDay" label={t('all day')} />

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label={t('start date')}
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label={t('end date')}
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  helperText: dateError && 'End date must be later than start date',
                },
              }}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              selected={field.value}
              onSelectColor={(color) => field.onChange(color)}
              colors={colorOptions}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {!!currentEvent?.id && (
          <Tooltip title={t('delete event')}>
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('cancel')}
        </Button>

        <LoadingButton
          type="submit"
          tabIndex={-1}
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          {t('save changes')}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

CalendarForm.propTypes = {
  colorOptions: PropTypes.arrayOf(PropTypes.string),
  currentEvent: PropTypes.object,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
};
