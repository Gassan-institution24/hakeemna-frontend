import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSettingsContext } from 'src/components/settings';

import { _addressBooks } from 'src/_mock';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { socket } from 'src/socket';
import { useTranslate } from 'src/locales';
import axios, { endpoints } from 'src/utils/axios';
import FormProvider from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';

import NewEditHolidays from '../new-edit-holidays';
import NewEditLongHolidays from '../new-edit-long-holiday';
import NewEditDaysDetails from '../new-edit-days-details';
import NewEditDetails from '../new-edit-details';

// ----------------------------------------------------------------------

export default function AppointConfigNewEditForm({ appointmentConfigData, refetch, loading }) {
  const router = useRouter();

  const { t } = useTranslate();

  const { user } = useAuthContext();

  const [appointTime, setAppointTime] = useState(0);

  const [dataToUpdate, setDataToUpdate] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const saving = useBoolean();
  const updating = useBoolean();

  const confirm = useBoolean();

  const loadingSend = useBoolean();

  const NewConfigSchema = Yup.object().shape({
    weekend: Yup.array(),
    start_date: Yup.date().nullable(),
    end_date: Yup.date().nullable(),
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
        appointment_type: Yup.string().nullable(),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        appointmentConfigData?.unit_service ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      department: appointmentConfigData?.department || null,
      start_date: appointmentConfigData?.start_date || null,
      end_date: appointmentConfigData?.end_date || null,
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
          appointments: [],
          service_types: [],
          appointment_type: null,
        },
      ],
    }),
    [appointmentConfigData, user]
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

  const handleSaving = async () => {
    saving.onTrue();
    try {
      await axios.patch(`${endpoints.tables.appointmentconfigs}/${appointmentConfigData?._id}`, {
        ...dataToUpdate,
        ImmediateEdit: false,
      });
      enqueueSnackbar('Updated successfully!');
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.appointmentconfig.root(
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
        ),
        msg: `updated an appointment configuration <strong>[ ${appointmentConfigData.code} ]</strong>`,
      });
      confirm.onFalse();
      router.push(paths.employee.appointmentconfiguration.root);
      saving.onFalse();
    } catch (e) {
      enqueueSnackbar(`Failed to update: ${e.message}`, { variant: 'error' });
      saving.onFalse();
    }
  };
  const handleUpdating = async () => {
    updating.onTrue();
    try {
      await axios.patch(`${endpoints.tables.appointmentconfigs}/${appointmentConfigData?._id}`, {
        ...dataToUpdate,
        ImmediateEdit: true,
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.appointmentconfig.root(
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
        ),
        msg: `updated an appointment configuration <strong>[ ${appointmentConfigData.code} ]</strong>`,
      });
      enqueueSnackbar('Updated successfully!');
      router.push(paths.employee.appointmentconfiguration.root);
      confirm.onFalse();
      updating.onFalse();
      // await refetch();
    } catch (e) {
      enqueueSnackbar(`Failed to update: ${e.message}`, { variant: 'error' });
      confirm.onFalse();
      updating.onFalse();
    }
  };

  const handleSave = handleSubmit(async (data) => {
    loadingSend.onTrue();
    const now = new Date();
    const thisFrequentEndDate = new Date(
      now.getTime() + data.config_frequency * 24 * 60 * 60 * 1000
    );
    try {
      if (appointmentConfigData) {
        if (
          (!data.start_date && !data.end_date) ||
          (new Date(data.end_date) > now &&
            (new Date(data.start_date) <= now || new Date(data.start_date) < thisFrequentEndDate))
        ) {
          setDataToUpdate(data);
          confirm.onTrue();
        }

        // await axios.patch(`${endpoints.tables.appointmentconfigs}/${appointmentConfigData?._id}`, {
        //   ...data,
        //   department: id,
        // });
      } else {
        const config = await axios.post(endpoints.tables.appointmentconfigs, data);
        enqueueSnackbar('Added Successfully!');
        socket.emit('created', {
          user,
          link: paths.unitservice.employees.appointmentconfig.root(
            user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
          ),
          msg: `created an appointment configuration <strong>[ ${config.data?.code} ]</strong>`,
        })
        router.push(paths.employee.appointmentconfiguration.root);
      }
      // reset();
      loadingSend.onFalse();
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      socket.emit('error', {
        error,
        user,
        link: `/dashboard/unitservices/${data.unit_service}/systemerrors`,
        msg: `creating or updating a new work shift ${data.name_english} into ${data.unit_service}`,
      });
      // console.log(error);
      enqueueSnackbar(`Failed to Add: ${error}`, { variant: 'error' });
      console.error(error);
      loadingSend.onFalse();
    }
  });

  useEffect(() => {
    if (appointmentConfigData) {
      methods.reset({
        unit_service:
          appointmentConfigData?.unit_service ||
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
            ._id,
        department: appointmentConfigData?.department || null,
        start_date: appointmentConfigData?.start_date || null,
        end_date: appointmentConfigData?.end_date || null,
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
  }, [appointmentConfigData, methods, user]);

  return (
    <>
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Configuration Detail" /// edit
          links={[
            {
              name: t('dashboard'),
              href: paths.employee.root,
            },
            {
              name: 'Apointments Configuration',
              href: paths.employee.appointmentconfiguration.root,
            },
            { name: 'Configuration Detail' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <FormProvider methods={methods}>
          {!loading && (
            <Card>
              <NewEditDetails
                setAppointTime={setAppointTime}
                appointmentConfigData={appointmentConfigData}
              />
              <NewEditDaysDetails appointTime={appointTime} />
              <NewEditHolidays />
              <NewEditLongHolidays />
            </Card>
          )}

          <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton
              variant="contained"
              loading={isSubmitting || updating || saving}
              onClick={handleSave}
            >
              Save
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="UnCancel"
        content={
          <>
            Do you want to <strong> change your existance appointments</strong> ?
          </>
        }
        action={
          <>
            <LoadingButton
              variant="contained"
              loading={updating}
              color="error"
              onClick={handleUpdating}
            >
              Yes, I want to change
            </LoadingButton>
            <LoadingButton
              loading={saving}
              variant="contained"
              color="success"
              onClick={handleSaving}
            >
              No, I want to start from uncreated
            </LoadingButton>
          </>
        }
      />
    </>
  );
}

AppointConfigNewEditForm.propTypes = {
  appointmentConfigData: PropTypes.object,
  refetch: PropTypes.func,
  loading: PropTypes.bool,
};
