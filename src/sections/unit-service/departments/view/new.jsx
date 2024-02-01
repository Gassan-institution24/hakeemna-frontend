import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';

import { useParams } from 'react-router';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../department-new-edit-form';

// ----------------------------------------------------------------------

export default function USAccountingCreateView({ unitServiceData }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const unitServiceName = unitServiceData?.name_english || 'Unit Service';
  const params = useParams();
  const { id } = params;
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create new accounting')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin,
          },
          {
            name: t('Unit Services'),
            href: paths.superadmin.unitservices.root,
          },
          {
            name: `${unitServiceName} ${t('accounting')}`, /// edit
            href: paths.superadmin.unitservices.accounting(id),
          },
          { name: `${t('new')} ${unitServiceName} ${t('accounting')}` },
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
