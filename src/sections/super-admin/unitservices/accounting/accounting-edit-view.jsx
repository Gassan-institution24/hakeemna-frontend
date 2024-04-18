import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './accounting-new-edit-form';

// ----------------------------------------------------------------------

export default function USAppointmentEditView({ unitServiceData, licenseMovementData }) {
  // const settings = useSettingsContext();

  const unitServiceName = unitServiceData?.name_english || 'unit of service';
  const params = useParams();
  const { id } = params;
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={`Edit ${unitServiceName} Accounting`} /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'unit of services',
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
