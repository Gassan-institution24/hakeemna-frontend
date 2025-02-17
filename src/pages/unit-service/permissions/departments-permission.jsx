import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import DepartmentPermissionsView from 'src/sections/unit-service/permissions/view/department-permission';
import { Stack, Typography } from '@mui/material';
import { useTranslate } from 'src/locales';
// ----------------------------------------------------------------------

export default function DepartmentPermissionsPage() {
  const { user } = useAuthContext();
  const { t } = useTranslate()
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  const { emid, depId } = useParams();
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : departments permissions</title>
        <meta name="description" content="meta" />
      </Helmet>
      {(!emid || !depId) && <Stack direction='column' justifyContent='center' alignItems='center'>
        <Typography variant='h5' sx={{ mt: 2 }}>{t('Select department and employee to show and change permissions')}</Typography>
      </Stack>}
      {emid && depId && <DepartmentPermissionsView />}
    </ACLGuard>
  );
}
