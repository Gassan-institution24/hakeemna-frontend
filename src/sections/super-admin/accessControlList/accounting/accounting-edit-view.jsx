import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useParams } from 'react-router';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './accounting-new-edit-form';

// ----------------------------------------------------------------------

export default function USAppointmentEditView({ unitServiceData, licenseMovementData }) {
  const settings = useSettingsContext();
  const unitServiceName = unitServiceData?.name_english || 'Unit Service';
  const params = useParams();
  const { id } = params;
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Edit ${unitServiceName} Accounting`} /// edit
        links={[
          {
            name: 'Dashboard',
            href: paths.superadmin,
          },
          {
            name: 'Unit Services',
            href: paths.superadmin.unitservices.root,
          },
          {
            name: `${unitServiceName} accounting`, /// edit
            href: paths.superadmin.unitservices.accounting(id),
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
