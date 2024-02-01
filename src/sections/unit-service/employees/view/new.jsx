import { useState } from 'react';
import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';

import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../new/create-edit-employee';
import FindExistPatient from '../new/find-exist-employee';

// ----------------------------------------------------------------------

export default function TableCreateView({ employeeData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const [selectedPage, setSelectedPage] = useState();
  const select = useBoolean(true);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('New employee')}
          links={[
            {
              name: t('dashboard'),
              href: paths.unitservice.root,
            },
            {
              name: t('employees'),
              href: paths.unitservice.employees.root,
            },
            { name: t('New employee') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        {selectedPage === 0 && <FindExistPatient employeeData={employeeData} />}
        {selectedPage === 1 && <TableNewEditForm employeeData={employeeData} />}
      </Container>

      <ConfirmDialog
        open={select.value}
        onClose={select.onFalse}
        title="Does the employee have an account?"
        content={
          <>
            {/* <Typography variant="body1" component="h6" sx={{ mt: 1 }}>
                Do you want to change your existance appointments?
              </Typography> */}
            <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
              press<strong> yes</strong> to search for it and add it
            </Typography>
            <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
              press<strong> No</strong> to create one
            </Typography>
          </>
        }
        action={
          <>
            <LoadingButton
              variant="contained"
              color="warning"
              onClick={(e) => {
                setSelectedPage(0);
                select.onFalse(e);
              }}
            >
              Yes
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="success"
              onClick={(e) => {
                setSelectedPage(1);
                select.onFalse(e);
              }}
            >
              No
            </LoadingButton>
          </>
        }
      />
    </>
  );
}
TableCreateView.propTypes = {
  employeeData: PropTypes.object,
};
