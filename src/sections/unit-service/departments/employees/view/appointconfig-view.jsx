import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/components/settings';

import { _addressBooks } from 'src/_mock';

import axios, { endpoints } from 'src/utils/axios';
import FormProvider from 'src/components/hook-form';

import NewEditHolidays from '../appointmentConfig/new-edit-holidays';
import NewEditLongHolidays from '../appointmentConfig/new-edit-long-holiday';
import NewEditDaysDetails from '../appointmentConfig/new-edit-days-details';
import NewEditDetails from '../appointmentConfig/new-edit-details';

// ----------------------------------------------------------------------

export default function AppointConfigNewEditForm({ appointmentConfigData, refetch, loading }) {
  const router = useRouter();

  const { id, emid } = useParams();

  const [appointTime,setAppointTime] =useState(0)

  const settings = useSettingsContext();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const NewConfigSchema = Yup.object().shape({
    weekend: Yup.array(),
    start_date: Yup.date(),
    end_date: Yup.date(),
    appointment_time: Yup.number()
      .required('Appointment Time is required')
      .min(5, 'Appointment Time must be at least 5')
      .max(180, 'Appointment Time must be at most 180'),
    config_frequency: Yup.number()
      .required('Configuration Frequency is required')
      .min(1, 'must be at least 1')
      .max(360, 'must be at most 360'),
    holidays: Yup.array(),
    long_holidays: Yup.array(),
    work_group: Yup.string().required('Work Group is required'),
    work_shift: Yup.string().required('Work Shift is required'),
    days_details: Yup.array().of(
      Yup.object().shape({
        day: Yup.string().required('Day is required'),
        work_start_time: Yup.date(),
        work_end_time: Yup.date().when(
          'work_start_time',
          (work_start_time, schema) =>
            work_start_time &&
            schema.min(work_start_time, 'Work End Time must be after Work Start Time')
        ),
        // break_start_time: Yup.date().nullable()
        //   .when(
        //     'work_end_time',
        //     (work_end_time, schema) =>
        //       schema.isType(null)||(work_end_time &&
        //       schema.max(
        //         work_end_time,
        //         'Break Time must be between Work Start Time and Work End Time'
        //       ))
        //   ),
        //   .when(
        //     'work_start_time',
        //     (work_start_time, schema) =>
        //       work_start_time &&
        //       schema.min(
        //         work_start_time,
        //         'Break Time must be between Work Start Time and Work End Time'
        //       )
        //   ),
        // break_end_time: Yup.date().nullable()
        //   .when(
        //     'work_start_time',
        //     (work_start_time, schema) =>
        //       work_start_time &&
        //       schema.min(
        //         work_start_time,
        //         'Break Time must be between Work Start Time and Work End Time'
        //       )
        //   )
        //   .when(
        //     'work_end_time',
        //     (work_end_time, schema) =>
        //       work_end_time &&
        //       schema.max(
        //         work_end_time,
        //         'Break Time must be between Work Start Time and Work End Time'
        //       )
        //   )
        //   .when(
        //     'break_start_time',
        //     (break_start_time, schema) =>
        //       break_start_time &&
        //       schema.min(
        //         break_start_time,
        //         'Break Time must be between Work Start Time and Work End Time'
        //       )
        //   ),
        appointments: Yup.array(),
        service_types: Yup.array(),
        appointment_type: Yup.string(),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      weekend: appointmentConfigData?.weekend || [],
      appointment_time: appointmentConfigData?.appointment_time || null,
      config_frequency: appointmentConfigData?.config_frequency || null,
      holidays: appointmentConfigData?.holidays || [
        {
          description: '',
          date: null,
        },
      ],
      long_holidays: appointmentConfigData?.long_holidays || [
        {
          description: '',
          start_date: null,
          end_date: null,
        },
      ],
      work_group: appointmentConfigData?.work_group?._id || null,
      work_shift: appointmentConfigData?.work_shift?._id || null,
      days_details: appointmentConfigData?.days_details || [
        {
          day: '',
          work_start_time: null,
          work_end_time: null,
          break_start_time: null,
          break_end_time: null,
          appointments:[],
          service_types: [],
          appointment_type: null,
        },
      ],
    }),
    [appointmentConfigData]
  );

  const methods = useForm({
    resolver: yupResolver(NewConfigSchema),
    defaultValues,
  });
  console.log('methods', methods);
  const {
    reset,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSave = handleSubmit(async (data) => {
    loadingSend.onTrue();
    console.log('submitted data ', data);
    try {
      if (appointmentConfigData) {
        await axios.patch(`${endpoints.tables.appointmentconfigs}/${appointmentConfigData?._id}`, {
          ...data,
          department: id,
        });
      } else {
        await axios.post(endpoints.tables.appointmentconfigs, { ...data, department: id });
      }
      // reset();
      loadingSend.onFalse();
      // router.push(paths.dashboard.invoice.root);
      await refetch();
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  useEffect(() => {
    if (appointmentConfigData) {
      methods.reset({
        weekend: appointmentConfigData?.weekend || [],
        appointment_time: appointmentConfigData?.appointment_time || null,
        config_frequency: appointmentConfigData?.config_frequency || null,
        holidays: appointmentConfigData?.holidays || [
          {
            description: '',
            date: null,
          },
        ],
        long_holidays: appointmentConfigData?.long_holidays || [
          {
            description: '',
            start_date: null,
            end_date: null,
          },
        ],
        work_group: appointmentConfigData.work_group?._id || null,
        work_shift: appointmentConfigData.work_shift?._id || null,
        days_details: appointmentConfigData.days_details || [
          {
            day: '',
            work_start_time: null,
            work_end_time: null,
            break_start_time: null,
            break_end_time: null,
            appointments: [],
          },
        ],
      });
    }
  }, [appointmentConfigData, methods]);

  return (
    <Container maxWidth="lg">
      <FormProvider methods={methods}>
        {!loading && (
          <Card>
            <NewEditDetails setAppointTime={setAppointTime} appointmentConfigData={appointmentConfigData} />
            <NewEditDaysDetails appointTime={appointTime}  />
            <NewEditHolidays />
            <NewEditLongHolidays />
          </Card>
        )}

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

AppointConfigNewEditForm.propTypes = {
  appointmentConfigData: PropTypes.object,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
};
