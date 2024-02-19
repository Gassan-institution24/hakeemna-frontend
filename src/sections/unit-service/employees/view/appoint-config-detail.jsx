import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Typewriter from 'typewriter-effect';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { Alert, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';

import NewEditDetails from '../appointmentConfig/new-edit-details';
import NewEditHolidays from '../appointmentConfig/new-edit-holidays';
import NewEditDaysDetails from '../appointmentConfig/new-edit-days-details';
import NewEditLongHolidays from '../appointmentConfig/new-edit-long-holiday';

// ----------------------------------------------------------------------

export default function AppointConfigNewEditForm({ appointmentConfigData, refetch, loading }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id } = useParams();

  const { user } = useAuthContext();

  const employeeInfo = useGetEmployeeEngagement(id).data;

  const [appointTime, setAppointTime] = useState(0);
  const [errorMsg, setErrorMsg] = useState();

  const [dataToUpdate, setDataToUpdate] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();

  const saving = useBoolean(false);
  const updating = useBoolean(false);

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
        work_start_time: Yup.date().required('work start time is required'),
        work_end_time: Yup.date()
          .required('work end time is required')
          .when(
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
  // console.log('user', user);

  const defaultValues = useMemo(
    () => ({
      unit_service:
        appointmentConfigData?.unit_service._id ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
      department:
        employeeInfo?.department?._id ||
        user?.employee?.employee_engagements[user?.employee.selected_engagement]?.department?._id,
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
      days_details:
        appointmentConfigData?.days_details ||
        [
          // {
          //   day: '',
          //   // work_start_time: null,
          //   // work_end_time: null,
          //   // break_start_time: null,
          //   // break_end_time: null,
          //   appointments: [],
          //   // service_types: [],
          //   appointment_type: null,
          // },
        ],
    }),
    [appointmentConfigData, user?.employee, employeeInfo?.department]
  );

  const methods = useForm({
    resolver: yupResolver(NewConfigSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const handleSaving = async () => {
    saving.onTrue();
    try {
      await axios.patch(`${endpoints.tables.appointmentconfigs}/${appointmentConfigData?._id}`, {
        ...dataToUpdate,
        ImmediateEdit: false,
      });
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.appointmentconfig.root(id),
        msg: `updated an appointment configuration <strong>[ ${appointmentConfigData.code} ]</strong>`,
      });
      enqueueSnackbar(t('updated successfully!'));
      saving.onFalse();
      confirm.onFalse();
      router.push(paths.unitservice.employees.appointmentconfig.root(id));
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      setErrorMsg(typeof error === 'string' ? error : error.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      saving.onFalse();
      confirm.onFalse();
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
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
        link: paths.unitservice.employees.appointmentconfig.root(id),
        msg: `updated an appointment configuration <strong>[ ${appointmentConfigData.code} ]</strong>`,
      });
      updating.onFalse();
      confirm.onFalse();
      enqueueSnackbar(t('Updated successfully!'));
      router.push(paths.unitservice.employees.appointmentconfig.root(id));
      // await refetch();
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      socket.emit('error', { error, user, location: window.location.pathname });
      updating.onFalse();
      confirm.onFalse();
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
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
        } else {
          await axios.patch(
            `${endpoints.tables.appointmentconfigs}/${appointmentConfigData?._id}`,
            data
          );
          socket.emit('updated', {
            data,
            user,
            link: paths.unitservice.employees.appointmentconfig.root(id),
            msg: `updated an appointment configuration ${appointmentConfigData.code}`,
          });
          router.push(paths.unitservice.employees.appointmentconfig.root(id));
        }
      } else {
        updating.onTrue();
        await axios.post(endpoints.tables.appointmentconfigs, data);
        socket.emit('created', {
          data,
          user,
          link: paths.unitservice.employees.appointmentconfig.root(id),
          msg: `created an appointment config <strong>${data.name_english}</strong>`,
        });
        updating.onFalse();
        enqueueSnackbar(t('added successfully!'));
        router.push(paths.unitservice.employees.appointmentconfig.root(id));
      }
      // reset();
      loadingSend.onFalse();
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      socket.emit('error', { error, user, location: window.location.pathname });
      updating.onFalse();
      loadingSend.onFalse();
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      console.error(error);
    }
  });

  useEffect(() => {
    if (Object.keys(errors).length) {
      // console.log(errors);
      setErrorMsg(
        Object.keys(errors)
          .map((key) => errors?.[key]?.message)
          .join('<br>')
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [errors]);

  console.log('errorMsg', errorMsg);

  useEffect(() => {
    if (appointmentConfigData) {
      methods.reset({
        unit_service:
          appointmentConfigData?.unit_service ||
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
            ._id,
        department:
          employeeInfo?.department?._id ||
          user?.employee.employee_engagements[user?.employee.selected_engagement]?.department?._id,
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
  }, [appointmentConfigData, methods, user, employeeInfo?.department]);

  return (
    <>
      <Container maxWidth="lg">
        <FormProvider methods={methods}>
          {!loading && (
            <Card>
              {!!errorMsg && (
                <Alert sx={{ borderRadius: 0 }} severity="error">
                  <div> {errorMsg} </div>
                </Alert>
              )}
              <NewEditDetails
                setAppointTime={setAppointTime}
                appointmentConfigData={appointmentConfigData}
              />
              <NewEditDaysDetails setErrorMsg={setErrorMsg} appointTime={appointTime} />
              <NewEditHolidays />
              <NewEditLongHolidays />
            </Card>
          )}

          <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton
              variant="contained"
              loading={isSubmitting || saving.value || updating.value}
              onClick={handleSave}
            >
              {t('save')}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
      <ConfirmDialog
        disabled={updating.value}
        open={updating.value || confirm.value}
        onClose={confirm.onFalse}
        title={updating.value ? 'Creating appointments...' : 'Save changes'}
        content={
          updating.value ? (
            <>
              {/* <Typography variant="body1" component="h6" sx={{ mt: 1 }}>
                Appointment creating...
              </Typography> */}
              <Typewriter
                options={{
                  strings: [
                    'It might take several minutes..',
                    'We are getting appointments ready..',
                    'We are almost done..',
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 5,
                  cursor: '',
                  delay: 20,
                }}
              />
            </>
          ) : (
            <>
              <Typography variant="body1" component="h6" sx={{ mt: 1 }}>
                {curLangAr
                  ? 'هل تريد تغيير المواعيد المنشأة مسبقا؟'
                  : 'Do you want to change your existance appointments?'}
              </Typography>
              {curLangAr ? (
                <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                  اضغط <strong> نعم </strong> لتغيير المواعيد المنشأة
                </Typography>
              ) : (
                <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                  press<strong> yes</strong> to change existance appointments
                </Typography>
              )}
              {curLangAr ? (
                <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                  اضغط <strong> لا </strong> لحفظ الاعدادات للبدء من المواعيد التي يراد إنشائها
                </Typography>
              ) : (
                <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                  press<strong> No</strong> to start changing when creating new appointments
                </Typography>
              )}
            </>
          )
        }
        action={
          <>
            <LoadingButton
              variant="contained"
              loading={updating.value}
              color="warning"
              onClick={handleUpdating}
            >
              {t('yes')}
            </LoadingButton>
            <LoadingButton
              disabled={updating.value}
              loading={saving.value}
              variant="contained"
              color="success"
              onClick={handleSaving}
            >
              {t('no')}
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
