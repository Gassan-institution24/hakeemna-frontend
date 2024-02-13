import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './accounting-new-edit-form';

// ----------------------------------------------------------------------

export default function USAppointmentEditView({ stakeholderData, licenseMovementData }) {
  const settings = useSettingsContext();

  const params = useParams();
  const { id } = params;

  const { t } = useTranslate();

  const stakeholderName = stakeholderData?.name_english || 'Stakeholder';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Edit ${stakeholderName} Accounting`} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin,
          },
          {
            name: t('accounting'),
            href: paths.superadmin.accounting.root,
          },
          {
            name: `${stakeholderName} accounting`, /// edit
            href: paths.superadmin.accounting.stakeholder.root(id),
          },
          { name: `Edit ${stakeholderName} accounting` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {licenseMovementData && (
        <TableNewEditForm
          licenseMovementData={licenseMovementData}
          stakeholderData={stakeholderData}
        />
      )}
    </Container>
  );
}
USAppointmentEditView.propTypes = {
  stakeholderData: PropTypes.object,
  licenseMovementData: PropTypes.object,
};
