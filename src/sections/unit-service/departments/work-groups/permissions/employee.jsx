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
import { useGetWorkGroup } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
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

  const { emid, wgid } = useParams();

  const { data } = useGetWorkGroup(wgid);

  const { user } = useAuthContext();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const accessControlList = Yup.object().shape({
    appointments: Yup.array(),
    appointment_configs: Yup.array(),
    accounting: Yup.array(),
    entrance_management: Yup.array(),
    permissions: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      appointments: data?.employees?.find((info) => info._id === emid)?.acl?.appointments || [],
      appointment_configs:
        data?.employees?.find((info) => info._id === emid)?.acl?.appointment_configs || [],
      accounting: data?.employees?.find((info) => info._id === emid)?.acl?.accounting || [],
      entrance_management:
        data?.employees?.find((info) => info._id === emid)?.acl?.entrance_management || [],
      permissions: data?.employees?.find((info) => info._id === emid)?.acl?.permissions || [],
    }),
    [data, emid]
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

  const onSubmit = handleSubmit(async (submitData) => {
    try {
      axios.patch(endpoints.work_groups.employee.acl(emid), { acl: submitData });
      socket.emit('updated', {
        user,
        link: paths.unitservice.employees.acl(emid),
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
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('permissions')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('giving or withdrowing permissions refered to all')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('work group and all its employees')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('permissions')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
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
                {t('entrance management')}
              </Typography>
              <RHFMultiCheckbox row spacing={4} name="entrance_management" options={options} />
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
