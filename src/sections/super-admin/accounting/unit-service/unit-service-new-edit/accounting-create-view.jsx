import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './accounting-new-edit-form';

// ----------------------------------------------------------------------

export default function USAccountingCreateView({ unitServiceData }) {
  // const settings = useSettingsContext();

  const { t } = useTranslate();

  const params = useParams();
  const { id } = params;

  const unitServiceName = unitServiceData?.name_english || 'unit of service';
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={`Create new ${unitServiceName} accounting`} /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: t('accounting'),
            href: paths.superadmin.accounting.root,
          },
          {
            name: `${unitServiceName} accounting`, /// edit
            href: paths.superadmin.accounting.unitservice.root(id),
          },
          { name: `New ${unitServiceName} accounting` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm unitServiceData={unitServiceData} />
    </Container>
  );
}
USAccountingCreateView.propTypes = {
  unitServiceData: PropTypes.object,
};
