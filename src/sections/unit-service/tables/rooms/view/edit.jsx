import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ roomData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('edit room')}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('rooms'),
            href: paths.unitservice.tables.rooms.root,
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {roomData && <TableNewEditForm currentTable={roomData} />}
    </Container>
  );
}
TableEditView.propTypes = {
  roomData: PropTypes.object,
};
