import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Card, Container, Typography, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetEmployeeEngagement, useGetUSActiveEmployeeEngs } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFMultiCheckbox } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const options = [
    { label: t('read'), value: 'read' },
    { label: t('create'), value: 'create' },
    { label: t('edit'), value: 'update' },
    { label: t('delete'), value: 'delete' },
  ];

  const { id } = useParams();

  const { user } = useAuthContext();

  const router = useRouter();

  const { data } = useGetEmployeeEngagement(id);

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessControlList = Yup.object().shape({
    departments: Yup.array(),
    employees: Yup.array(),
    management_tables: Yup.array(),
    appointments: Yup.array(),
    appointment_configs: Yup.array(),
    accounting: Yup.array(),
    offers: Yup.array(),
    quality_control: Yup.array(),
    unit_service_info: Yup.array(),
    old_patient: Yup.array(),
    entrance: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      departments: data?.acl?.unit_service?.departments || [],
      employees: data?.acl?.unit_service?.employees || [],
      management_tables: data?.acl?.unit_service?.management_tables || [],
      appointments: data?.acl?.unit_service?.appointments || [],
      appointment_configs: data?.acl?.unit_service?.appointment_configs || [],
      accounting: data?.acl?.unit_service?.accounting || [],
      offers: data?.acl?.unit_service?.offers || [],
      quality_control: data?.acl?.unit_service?.quality_control || [],
      unit_service_info: data?.acl?.unit_service?.unit_service_info || [],
      old_patient: data?.acl?.unit_service?.old_patient || [],
      permissions: data?.acl?.unit_service?.permissions || [],
      hr: data?.acl?.unit_service?.hr || [],
      entrance: data?.acl?.unit_service?.entrance || [],
    }),
    [data]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(accessControlList),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { employeesData, loading } = useGetUSActiveEmployeeEngs(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service._id,
    { select: 'employee' }
  );
  useEffect(() => {
    if (!id && !loading && employeesData?.[0]?._id) {
      router.push(`${paths.unitservice.acl.unitservice}/${employeesData?.[0]?._id}`);
    }
  }, [id, employeesData, router, loading]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (submittedData) => {
    try {
      const newAcl = data.acl;
      newAcl.unit_service = submittedData;
      axios.patch(endpoints.employee_engagements.one(id), { acl: newAcl });
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.acl(id),
        msg: `updated a unit of service employee permissions`,
      });
      enqueueSnackbar(t('updated successfully!'));
      // router.push(paths.superadmin.subscriptions.root);
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  });

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('permissions')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('giving or withdrowing permissions refered to all')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('unit of service and all its departments')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('permissions')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography title="Permissions" textTransform="capitalize" variant="subtitle2">
                {t('departments')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="departments" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('employees')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="employees" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('management tables')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="management_tables" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('appointments')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="appointments" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('appointment configuration')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="appointment_configs" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('accounting')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="accounting" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('offers')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="offers" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('quality control')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="quality_control" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('old patient data')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="old_patient" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('unit of service info')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="unit_service_info" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('permissions')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="permissions" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('human resource')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="hr" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('entrance management')}
              </Typography>
              <RHFMultiCheckbox
                row
                spacing={4}
                name="entrance"
                options={[
                  { label: t('appointment'), value: 'appointment' },
                  { label: t('rooms'), value: 'rooms' },
                  { label: t('finished'), value: 'finished' },
                ]}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );
  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          // size="large"
          loading={isSubmitting}
          sx={{ m: 2 }}
        >
          {t('save changes')}
        </LoadingButton>
      </Grid>
    </>
  );
  return (
    <Container maxWidth="lg">
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderProperties}

          {renderActions}
        </Grid>
      </FormProvider>
    </Container>
  );
}
