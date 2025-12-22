import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Card, Stack, Button, Divider, Typography,CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { createSuperAdminLevel2,useGetSuperAdminsLevel2  } from 'src/api/user';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

const SuperAdminSchema = Yup.object().shape({
  userName: Yup.string().required('User name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function SuperAdminPermissionsPage() {
  const navigate = useNavigate();
  const { data, loading, error, empty } = useGetSuperAdminsLevel2();
  const addDialog = useBoolean();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(SuperAdminSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  
  const onSubmit = handleSubmit(async (dat) => {
    try {
      await createSuperAdminLevel2(dat);

      enqueueSnackbar('Super admin created successfully', {
        variant: 'success',
      });

      reset();
      addDialog.onFalse();
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || 'Failed to create super admin',
        { variant: 'error' }
      );
    }
  });

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 3,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          gap: { xs: 2, md: 0 },
        }}
      >

        <Box>
          <Typography variant="h4">Super Admin Permissions</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage sidebar & access for super admins
          </Typography>
        </Box>

        {/* ➕ New Super Admin button */}
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={addDialog.onTrue}
        >
          New Super Admin
        </Button>
      </Stack>



      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && <Typography color="error">Failed to load super admins</Typography>}

      {/* Empty */}
      {empty && <Typography color="text.secondary">No level 2 super admins found</Typography>}

      {/* Data */}
      {!loading && !error && data?.length > 0 && (
        <Stack divider={<Divider />} spacing={2}>
          {data.map((admin) => (
            <Box
              key={admin._id}
              onClick={() => navigate(paths.superadmin.superAdminPermissions.edit(admin._id))}
              sx={{
                cursor: 'pointer',
                p: 2,
                borderRadius: 3,
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'background-color 0.2s ease',

                '&:hover': {
                  bgcolor: 'background.paper',
                },
              }}
            >
              <Typography fontWeight={600}>{admin.userName || '—'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'none' }}>
                {admin.email}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
      <Dialog open={addDialog.value} onClose={addDialog.onFalse} maxWidth="sm" fullWidth>
        <DialogTitle >New Super Admin Level 2</DialogTitle>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="userName" label="User Name" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="password" label="Password" type="password" />
              <RHFTextField name="confirmPassword" label="Confirm Password" type="password" />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={addDialog.onFalse} color="inherit">
              Cancel
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Create
            </LoadingButton>
          </DialogActions>
        </FormProvider>

      </Dialog>

    </Card>
  );
}
