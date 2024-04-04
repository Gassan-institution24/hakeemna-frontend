import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../department-new-edit-form';

// ----------------------------------------------------------------------

export default function USAccountingCreateView({ unitServiceData }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('create new department')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.unitservices.root,
          },
          {
            name: t('departments'),
            href: paths.superadmin.unitservices.departments.root(id),
          },
          { name: t('new') },
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
