import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({workShiftData}) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit work Shift"
        links={[
          {
            name: 'Dashboard',
            href: paths.unitservice.root,
          },
          {
            name: 'Work shifts',
            href: paths.unitservice.tables.workshifts.root,
          },
          { name: 'Edit work Shift' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {workShiftData && <TableNewEditForm currentTable={workShiftData} />}
    </Container>
  );
}
TableEditView.propTypes = {
  workShiftData: PropTypes.object,
};
