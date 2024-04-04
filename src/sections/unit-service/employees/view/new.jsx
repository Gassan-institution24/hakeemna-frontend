import { useState } from 'react';
import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';

import { ConfirmDialog } from 'src/components/custom-dialog';
// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import FindExistPatient from '../new/find-exist-employee';
import TableNewEditForm from '../new/create-edit-employee';

// ----------------------------------------------------------------------

export default function TableCreateView({ employeeData }) {
  // const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [selectedPage, setSelectedPage] = useState(1);
  const select = useBoolean(true);

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('new employee')}
          links={[
            {
              name: t('dashboard'),
              href: paths.unitservice.root,
            },
            {
              name: t('employees'),
              href: paths.unitservice.employees.root,
            },
            { name: t('new') },
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
        withoutCancel
        title={curLangAr ? 'هل لدى الموظف حساب لدينا؟' : 'Does the employee have an account?'}
        content={
          <>
            {/* <Typography variant="body1" component="h6" sx={{ mt: 1 }}>
                Do you want to change your existance appointments?
              </Typography> */}
            {curLangAr ? (
              <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                اضغط<strong> نعم </strong> للبحث عنه واضافته
              </Typography>
            ) : (
              <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                press<strong> yes</strong> to search for it and add it
              </Typography>
            )}
            {curLangAr ? (
              <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                اضغط<strong> لا</strong> لإنشاء حساب جديد
              </Typography>
            ) : (
              <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                press<strong> No</strong> to create one
              </Typography>
            )}
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
              {t('yes')}
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="success"
              onClick={(e) => {
                setSelectedPage(1);
                select.onFalse(e);
              }}
            >
              {t('no')}
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
