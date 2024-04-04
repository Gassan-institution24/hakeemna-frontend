import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeOldPatient } from 'src/api';
import { useAclGuard } from 'src/auth/guard/acl-guard';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UploadOldPatient from '../upload-old-patient';
import UploadedOldPatients from '../uploaded-old-patients';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { oldPatients, refetch, loading } = useGetEmployeeOldPatient(user?.employee?._id);

  const checkAcl = useAclGuard();

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('old patient data')}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          { name: t('old patient data') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {loading && <LoadingScreen />}
      {checkAcl({ category: 'unit_service', subcategory: 'old_patient', acl: 'create' }) && (
        <UploadOldPatient refetch={refetch} />
      )}
      {!loading &&
        checkAcl({ category: 'unit_service', subcategory: 'old_patient', acl: 'read' }) && (
          <UploadedOldPatients oldPatients={oldPatients} />
        )}
    </Container>
  );
}
