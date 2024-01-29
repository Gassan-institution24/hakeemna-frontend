import { useState } from 'react';
import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';

import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useGetEmployeeOldPatient } from 'src/api/tables';
import UploadOldPatient from '../upload-old-patient';
import UploadedOldPatients from '../uploaded-old-patients';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const { oldPatients, refetch, loading } = useGetEmployeeOldPatient(user?.employee?._id);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Old patient"
          links={[
            {
              name: 'Dashboard',
              href: paths.unitservice.root,
            },
            { name: 'Old patient' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {loading && <LoadingScreen />}
        <UploadOldPatient refetch={refetch} />
        {!loading && <UploadedOldPatients oldPatients={oldPatients} />}
      </Container>
    </>
  );
}
