import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import UnitServiceDetailsContent from './info-content';

// ----------------------------------------------------------------------

export default function UnitServiceDetailsView({ unitServiceData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth="xl">
      <UnitServiceDetailsContent unitServiceData={unitServiceData} />
    </Container>
  );
}

UnitServiceDetailsView.propTypes = {
  unitServiceData: PropTypes.object,
};
