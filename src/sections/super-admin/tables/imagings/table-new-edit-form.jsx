import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TableNewEditForm({ currentTable }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    imagining_group: Yup.string(),
    diagnostic_test: Yup.string().required('Name is required'),
    description: Yup.string(),
    international_code: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      imagining_group: currentTable?.imagining_group || '',
      diagnostic_test: currentTable?.diagnostic_test || '',
      description: currentTable?.description || '',
      international_code: currentTable?.international_code || '',
    }),
    [currentTable]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTable) {
        await axiosInstance.patch(`${endpoints.imaging.one(currentTable._id)}`, data);
      } else {
        await axiosInstance.post(`${endpoints.imaging.all}`, data);
      }
      reset();
      router.push(paths.superadmin.tables.imaging.root);
      enqueueSnackbar(currentTable ? 'Update success!' : 'Create success!');
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} maxWidth="md">
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="diagnostic_test" label="diagnostic test" />
              <RHFTextField name="imagining_group" label="imagining group" />
              <RHFTextField name="international_code" label="international code" />
            </Box>
            <RHFTextField
              sx={{ mt: 3 }}
              multiline
              rows={3}
              name="description"
              label="description"
            />

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
                {!currentTable ? 'Create' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TableNewEditForm.propTypes = {
  currentTable: PropTypes.object,
};
