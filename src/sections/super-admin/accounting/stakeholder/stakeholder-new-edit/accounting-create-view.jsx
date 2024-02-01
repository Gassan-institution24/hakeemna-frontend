import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useParams } from 'react-router';
import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './accounting-new-edit-form';

// ----------------------------------------------------------------------

export default function USAccountingCreateView({ stakeholderData }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();
  const params = useParams();
  const { id } = params;

  const stakeholderName = stakeholderData?.name_english || 'Stakeholder';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Create new ${stakeholderName} accounting`} /// edit
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
          { name: `New ${stakeholderName} accounting` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm stakeholderData={stakeholderData} />
    </Container>
  );
}
USAccountingCreateView.propTypes = {
  stakeholderData: PropTypes.object,
};
