import { useState } from 'react';
import PropTypes from 'prop-types';

import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useLocales, useTranslate } from 'src/locales';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../create-edit-employee';
import FindExistEmployee from '../find-exist-employee';

// ----------------------------------------------------------------------

export default function TableCreateView({ departmentData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id, depid } = useParams();

  const [selectedPage, setSelectedPage] = useState();
  const select = useBoolean(true);
  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('Create a new employee account')}
          links={[
            {
              name: t('dashboard'),
              href: paths.superadmin.unitservices.root,
            },
            {
              name: t('departments'),
              href: paths.superadmin.unitservices.departments.root(id),
            },
            {
              name: `${departmentData.name_english || t('Department')} ${t('employees')}`,
              href: paths.superadmin.unitservices.departments.employees.root(id, depid),
            },
            { name: t('new') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {selectedPage === 0 && <FindExistEmployee departmentData={departmentData} />}
        {selectedPage === 1 && <TableNewEditForm departmentData={departmentData} />}
      </Container>

      <ConfirmDialog
        open={select.value}
        title={curLangAr ? 'هل لدى الموظف حساب لدينا؟' : 'Does the employee have an account?'}
        onClose={select.onFalse}
        content={
          <>
            {/* <Typography variant="body1" component="h6" sx={{ mt: 1 }}>
                Do you want to change your existance appointments?
              </Typography> */}
            {curLangAr ? (
              <Typography variant="body2" component="p" sx={{ mt: 1, color: 'text.disabled' }}>
                اضغط<strong> نعم </strong>للبحث عنه واضافته
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
  departmentData: PropTypes.object,
};
