import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Typewriter from 'typewriter-effect';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Alert, Typography, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Walktour, { useWalktour } from 'src/components/walktour';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import NewEditDetails from '../new-edit-details';
import NewEditHolidays from '../new-edit-holidays';
import NewEditDaysDetails from '../new-edit-days-details';
import NewEditLongHolidays from '../new-edit-long-holiday';

// ----------------------------------------------------------------------

export default function AppointConfigNewEditForm({ appointmentConfigData, refetch, loading }) {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const employeeInfo = useGetEmployeeEngagement(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
  ).data;

  const walktour = useWalktour({
    defaultRun: true,
    showProgress: true,
    steps: [
      {
        target: '#currEMNewEditDetails',
        title: t('Step One (1) of “Automated Appointment Settings”'),
        disableBeacon: true,
        content: (
          <>
            <Typography lang="ar" sx={{ color: 'text.secondary' }}>
              {t(
                "General information about creating 'Automated Appointment Settings', as these settings will create the appointments available for booking for each day automatically and automatically according to the conditions that you have previously specified, you should know that you can make 'Automated Appointment Settings' flexibly and independently according to each work group and according to each work shift."
              )}
            </Typography>
            <Typography lang="ar" sx={{ color: 'text.secondary' }}>
              <br />
              {t('In this part of the screen you must enter the following information:')}
              <br />
            </Typography>
            <Typography lang="ar" sx={{ color: 'text.secondary' }}>
              <br />
              {t('(1) The start date and expiry date of these settings, as from that date it will create appointments according to those settings and will stop creating new appointments on the expiry date you specified.')}
              <br />
            </Typography>
            <Typography lang="ar" sx={{ color: 'text.secondary' }}>
              {t(
                "(2) In addition to the above, you must specify for which 'work shift' and for which 'work group' you want to create these appointments. Remember that in the work group you have linked all employees and workers in that group, and therefore creating 'Automated Appointment Settings' will be appointments for all members of that work group."
              )}{' '}
              <br />
            </Typography>
            <Typography lang="ar" sx={{ color: 'text.secondary' }}>
              {t('(3) You must specify the time period for each appointment.')}
            </Typography>
            <Typography lang="ar" sx={{ color: 'text.secondary' }}>
              {t(
                '(4) Very important: Remember to write the number of days you want appointments to be available for, for example, if you write 30 days, the patient will be able to book an appointment on any day of the 30 days following today’s date (of course according to the settings conditions that you will write in this step.'
              )}
            </Typography>
          </>
        ),
      },
      {
        target: '#appointmentSettingDuration',
        title: t('Step Two (2) of “Automated Appointment Settings”'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'In this part of the settings, you should be able to detail your work pattern (daily routine) for each shift of the week, and these settings for each day of the week will determine the detail and number of appointments for each shift.'
            )}
            <br />
            {t(
              "Remember: choose 'morning' or 'evening' when specifying the time so that we can configure the automated appointments correctly."
            )}
          </Typography>
        ),
      },
      {
        target: '#appointmentSettingAvailableForBooking',
        title: t('Step Two (2) of “Automated Appointment Settings”'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'In this part of the settings, you should be able to detail your work pattern (daily routine) for each shift of the week, and these settings for each day of the week will determine the detail and number of appointments for each shift.'
            )}
            <br />
            {t(
              "Remember: choose 'morning' or 'evening' when specifying the time so that we can configure the automated appointments correctly."
            )}
          </Typography>
        ),
      },
      {
        target: '#currEMNewEditDaysDetails',
        title: t('Step Two (2) of “Automated Appointment Settings”'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'In this part of the settings, you should be able to detail your work pattern (daily routine) for each shift of the week, and these settings for each day of the week will determine the detail and number of appointments for each shift.'
            )}
            <br />
            {t(
              "Remember: choose 'morning' or 'evening' when specifying the time so that we can configure the automated appointments correctly."
            )}
          </Typography>
        ),
      },
      {
        target: '#currEMNewEditHolidays',
        title: t('Step Three (3) of “Automated Appointment Settings”'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              'Here you can add holidays that last only one day (eg Labor Day / Independence Day)'
            )}
          </Typography>
        ),
      },
      {
        target: '#currEMNewEditLongHolidays',
        title: t('Step Four (4) of “Automated Appointment Settings”'),
        disableBeacon: true,
        content: (
          <Typography lang="ar" sx={{ color: 'text.secondary' }}>
            {t(
              "Here you can add holidays that last more than one day, for example 'Eid al-Adha' or 'Annual Holiday'."
            )}
          </Typography>
        ),
      },
    ],
  });

  const [appointTime, setAppointTime] = useState(0);

  const [dataToUpdate, setDataToUpdate] = useState([]);
  const [errorMsg, setErrorMsg] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const saving = useBoolean(false);
  const updating = useBoolean(false);

  const confirm = useBoolean();

  const loadingSend = useBoolean();

  const NewConfigSchema = Yup.object().shape({
    weekend: Yup.array(),
    start_date: Yup.mixed().nullable(),
    end_date: Yup.mixed().nullable(),
    appointment_time: Yup.number()
      .required(t('required field'))
      .min(5, `${t('must be at least')} 5`)
      .max(180, `${t('must be at most')} 5`),
    config_frequency: Yup.number()
      .required(t('required field'))
      .min(1, `${t('must be at least')} 1`)
      .max(360, `${t('must be at most')} 360`),
    holidays: Yup.array(),
    long_holidays: Yup.array().of(
      Yup.object().shape({
        start_date: Yup.mixed().nullable(),
        end_date: Yup.mixed().nullable(),
        description: Yup.string().nullable(),
      })
    ),
    work_group: Yup.string().required(t('required field')),
    work_shift: Yup.string().required(t('required field')),
    days_details: Yup.array().of(
      Yup.object().shape({
        day: Yup.string().required(t('required field')),
        work_start_time: Yup.mixed().nullable().required(t('required field')),
        work_end_time: Yup.mixed().nullable().required(t('required field')),
        appointments: Yup.array(),
        service_types: Yup.array(),
        appointment_type: Yup.string().nullable(),
        online_available: Yup.boolean(),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      unit_service:
        appointmentConfigData?.unit_service._id ||
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ._id,
      department:
        employeeInfo?.department?._id ||
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.department?._id,
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
      online_available: appointmentConfigData?.online_available || true,
      days_details: appointmentConfigData?.days_details || [
        {
          day: 'saturday',
          work_start_time: null,
          work_end_time: null,
          break_start_time: null,
          break_end_time: null,
          appointments: [],
          service_types: [],
          appointment_type: null,
          online_available: true,
        },
      ],
    }),
    [appointmentConfigData, user?.employee, employeeInfo?.department]
  );

  const methods = useForm({
    mode: 'all',
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
      await axios.patch(`${endpoints.appointment_configs.all}/${appointmentConfigData?._id}`, {
        ...dataToUpdate,
        ImmediateEdit: false,
      });
      enqueueSnackbar(t('updated successfully!'));
      saving.onFalse();
      confirm.onFalse();
      router.push(paths.employee.appointmentconfiguration.root);
    } catch (error) {
      console.error(error);
      saving.onFalse();
      confirm.onFalse();
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };
  const handleUpdating = async () => {
    updating.onTrue();
    try {
      await axios.patch(`${endpoints.appointment_configs.all}/${appointmentConfigData?._id}`, {
        ...dataToUpdate,
        ImmediateEdit: true,
      });
      updating.onFalse();
      confirm.onFalse();
      enqueueSnackbar(t('updated successfully!'));
      router.push(paths.employee.appointmentconfiguration.root);
    } catch (error) {
      console.error(error);
      updating.onFalse();
      confirm.onFalse();
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
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
            `${endpoints.appointment_configs.all}/${appointmentConfigData?._id}`,
            data
          );
          router.push(paths.employee.appointmentconfiguration.root);
        }
      } else {
        updating.onTrue();
        await axios.post(endpoints.appointment_configs.all, data);
        socket.emit('created', {
          data,
          user,
          link: paths.unitservice.employees.appointmentconfig.root(
            user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
          ),
          msg: `created an appointment config <strong>${data.name_english || ''}</strong>`,
          ar_msg: `إنشاء إعدادت مواعيد <strong>${data.name_english || ''}</strong>`,
        });
        updating.onFalse();
        router.push(paths.employee.appointmentconfiguration.root);
        enqueueSnackbar(t('added successfully!'));
      }
      // reset();
      loadingSend.onFalse();
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      // setErrorMsg(typeof error === 'string' ? error : error.message);
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      console.error(error);
      updating.onFalse();
      // error emitted in backend
      loadingSend.onFalse();
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  });

  useEffect(() => {
    setErrorMsg();
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) => {
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' });
      });
    }
  }, [errors, enqueueSnackbar]);
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <>
      <Walktour
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        steps={walktour.steps}
        run={walktour.run}
        callback={walktour.onCallback}
        getHelpers={walktour.setHelpers}
      // scrollDuration={500}
      />
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading={t('appointment configuration')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('appointment configuration') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <FormProvider methods={methods}>
          {!loading && (
            <Card>
              {!!errorMsg && (
                <Alert sx={{ borderRadius: 0 }} severity="error">
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: errorMsg }} />
                </Alert>
              )}
              <div id="currEMNewEditDetails">
                <NewEditDetails
                  setAppointTime={setAppointTime}
                  appointmentConfigData={appointmentConfigData}
                />
              </div>
              <div id="currEMNewEditDaysDetails">
                <NewEditDaysDetails setErrorMsg={setErrorMsg} appointTime={appointTime} />
              </div>
              <div id="currEMNewEditHolidays">
                <NewEditHolidays />
              </div>
              <div id="currEMNewEditLongHolidays">
                <NewEditLongHolidays />
              </div>
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
        title={
          updating.value
            ? t('Creating appointments...')
            : t('Do you want to change your existance appointments?')
        }
        content={
          updating.value ? (
            <>
              {/* <Typography variant="body1" component="h6" sx={{ mt: 1 }}>
                Appointment creating...
              </Typography> */}
              <Typewriter
                options={{
                  strings: [
                    t('It might take several minutes..'),
                    t('We are getting appointments ready..'),
                    t('We are almost done..'),
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
              {/* <Typography variant="body1" component="h6" sx={{ mt: 1 }}>
                {curLangAr
                  ? 'هل تريد تغيير المواعيد المنشأة مسبقا؟'
                  : 'Do you want to change your existance appointments?'}
              </Typography> */}
              {curLangAr ? (
                <>
                  <Typography variant="body1" component="p" sx={{ color: 'info.dark' }}>
                    <strong> ملاحظة: </strong> لن يتم التعديل على أي من المواعيد المحجوزة
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                    اضغط <strong> نعم </strong> لتغيير المواعيد المنشأة
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" component="p" sx={{ color: 'info.dark' }}>
                    <strong> note:</strong> booked appointment will not change
                  </Typography>
                  <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                    press<strong> yes</strong> to change existance appointments
                  </Typography>
                </>
              )}
              {curLangAr ? (
                <Typography variant="body2" component="p" sx={{ color: 'text.disabled' }}>
                  اضغط <strong> لا </strong> لحفظ الاعدادات للبدء من المواعيد التي يراد إنشائها
                </Typography>
              ) : (
                <Typography variant="body2" component="p" sx={{ color: 'text.disabled' }}>
                  press<strong> No</strong> to start changing when creating new appointments
                </Typography>
              )}
            </>
          )
        }
        withoutCancel={updating.value}
        action={
          <>
            {updating.value && (
              <Box
                height="40"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <CircularProgress size={24} color="primary" />
              </Box>
            )}
            {!updating.value && (
              <LoadingButton
                variant="contained"
                loading={updating.value}
                color="warning"
                onClick={handleUpdating}
              >
                {t('yes')}
              </LoadingButton>
            )}
            {!updating.value && (
              <LoadingButton
                disabled={updating.value}
                loading={saving.value}
                variant="contained"
                color="success"
                onClick={handleSaving}
              >
                {t('no')}
              </LoadingButton>
            )}
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
