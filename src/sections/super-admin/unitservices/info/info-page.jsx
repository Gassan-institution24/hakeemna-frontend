import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import UnitServiceDetailsContent from './info-content';
import UnitServiceDetailsToolbar from './info-toolbar';

// ----------------------------------------------------------------------

export default function UnitServiceDetailsView({ unitServiceData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <UnitServiceDetailsToolbar
        backLink={paths.superadmin.unitservices.root}
        // editLink={paths.superadmin.UnitServices.edit(`${unitServiceData?._id}`)}
        liveLink="#"
      />

      <UnitServiceDetailsContent unitServiceData={unitServiceData} />
    </Container>
  );
}

UnitServiceDetailsView.propTypes = {
  unitServiceData: PropTypes.object,
};
