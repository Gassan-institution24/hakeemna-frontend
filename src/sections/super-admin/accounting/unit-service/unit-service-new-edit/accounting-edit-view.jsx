import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './accounting-new-edit-form';

// ----------------------------------------------------------------------

export default function USAppointmentEditView({ unitServiceData, licenseMovementData }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const unitServiceName = unitServiceData?.name_english || 'Unit Service';
  const params = useParams();
  const { id } = params;
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Edit ${unitServiceName} Accounting`} /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin,
          },
          {
            name: t('accounting'),
            href: paths.superadmin.accounting.root,
          },
          {
            name: `${unitServiceName} accounting`, /// edit
            href: paths.superadmin.accounting.unitservice.root(id),
          },
          { name: `Edit ${unitServiceName} accounting` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {licenseMovementData && (
        <TableNewEditForm
          licenseMovementData={licenseMovementData}
          unitServiceData={unitServiceData}
        />
      )}
    </Container>
  );
}
USAppointmentEditView.propTypes = {
  unitServiceData: PropTypes.object,
  licenseMovementData: PropTypes.object,
};
