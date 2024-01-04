import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/components/settings';

import { _addressBooks } from 'src/_mock';

import FormProvider from 'src/components/hook-form';

import NewEditHolidays from '../appointmentConfig/new-edit-holidays';
import NewEditLongHolidays from '../appointmentConfig/new-edit-long-holiday';
import NewEditDaysDetails from '../appointmentConfig/new-edit-days-details';
import NewEditStatusDate from '../appointmentConfig/new-edit-details';

// ----------------------------------------------------------------------

export default function InvoiceNewEditForm({ currentConfig }) {
  const router = useRouter();

  const settings = useSettingsContext();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const NewConfigSchema = Yup.object().shape({
    weekend: Yup.array(),
    appointment_time: Yup.number().required('Appointment Time is required'),
    holidays: Yup.array(),
    long_holidays: Yup.array(),
    // not required
    // work_group: Yup.string().required('Work Group is required'),
    work_shift: Yup.string().required('Work Shift is required'),
    days_details: Yup.array().required('Days Details is required'),
  });

  const defaultValues = useMemo(
    () => ({
      weekend: currentConfig?.weekend || [],
      appointment_time: currentConfig?.appointment_time || null,
      holidays: currentConfig?.holidays || [{
        description:'',
        date:null
      }],
      long_holidays: currentConfig?.long_holidays || [{
        description:'',
        start_date:null,
        end_date:null
      }],
      work_group: currentConfig?.work_group || null,
      work_shift: currentConfig?.work_shift || null,
      days_details: currentConfig?.days_details || [
        {
          day: '',
          work_start_time: null,
          work_end_time: null,
          break_start_time: null,
          break_end_time: null,
        },
      ],
    }),
    [currentConfig]
  );

  const methods = useForm({
    resolver: yupResolver(NewConfigSchema),
    defaultValues,
  });

  const {
    reset,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = handleSubmit(async (data) => {
    loadingSend.onTrue();
    console.log("submitted data ",data)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <Container maxWidth='lg'>
    <FormProvider methods={methods}>
      <Card>
        <NewEditStatusDate />
        <NewEditDaysDetails />
        <NewEditHolidays />
        <NewEditLongHolidays />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>

        <LoadingButton
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleSave}
        >
          Save
        </LoadingButton>
      </Stack>
    </FormProvider>
    </Container>
  );
}

InvoiceNewEditForm.propTypes = {
  currentConfig: PropTypes.object,
};
