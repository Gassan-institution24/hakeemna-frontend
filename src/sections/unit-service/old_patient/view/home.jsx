import { useState } from 'react';
import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';

import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UploadOldPatient from '../upload-old-patient';
import UploadedOldPatients from '../uploaded-old-patients';

// ----------------------------------------------------------------------

export default function TableCreateView({ employeeData }) {
  const settings = useSettingsContext();

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

        <UploadOldPatient />
        <UploadedOldPatients />
      </Container>

    </>
  );
}
TableCreateView.propTypes = {
  employeeData: PropTypes.object,
};
