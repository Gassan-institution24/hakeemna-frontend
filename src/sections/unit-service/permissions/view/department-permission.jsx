import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Card, Container, Typography, CardHeader } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

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

  const {data } = useGetEmployeeEngagement(id);

  const { user } = useAuthContext();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessControlList = Yup.object().shape({
    employees: Yup.array(),
    management_tables: Yup.array(),
    appointments: Yup.array(),
    appointment_configs: Yup.array(),
    accounting: Yup.array(),
    quality_control: Yup.array(),
    permissions: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      employees: data?.acl?.department?.employees || [],
      management_tables: data?.acl?.department?.management_tables || [],
      appointments: data?.acl?.department?.appointments || [],
      appointment_configs: data?.acl?.department?.appointment_configs || [],
      accounting: data?.acl?.department?.accounting || [],
      quality_control: data?.acl?.department?.quality_control || [],
      permissions: data?.acl?.department?.permissions || [],
    }),
    [data]
  );

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(accessControlList),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key, idx) =>
        enqueueSnackbar(`${key}: ${errors?.[key]?.message || 'error'}`, { variant: 'error' })
      );
    }
  }, [errors, enqueueSnackbar]);

  /* eslint-disable */
  useEffect(() => {
    reset({
      employees: data?.acl?.department?.employees || [],
      management_tables: data?.acl?.department?.management_tables || [],
      appointments: data?.acl?.department?.appointments || [],
      appointment_configs: data?.acl?.department?.appointment_configs || [],
      accounting: data?.acl?.department?.accounting || [],
      quality_control: data?.acl?.department?.quality_control || [],
      permissions: data?.acl?.department?.permissions || [],
    });
  }, [id, data]);
  /* eslint-enable */

  const onSubmit = handleSubmit(async (submitedData) => {
    try {
      const newAcl = data.acl;
      newAcl.department = submitedData;
      axios.patch(endpoints.employee_engagements.one(id), { acl: newAcl });
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.acl(id),
        msg: `updated a department employee permissions`,
      });
      enqueueSnackbar(t('updated successfully!'));
      //   router.push(paths.superadmin.subscriptions.root);
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
          <Typography textTransform="capitalize" variant="h6" sx={{ mb: 0.5 }}>
            {t('permissions')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('giving or withdrowing permissions refered to all')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('department and all its work groups')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('permissions')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
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
                {t('quality control')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="quality_control" options={options} />
            </Stack>
            <Stack spacing={1}>
              <Typography textTransform="capitalize" variant="subtitle2">
                {t('permissions')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="permissions" options={options} />
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
