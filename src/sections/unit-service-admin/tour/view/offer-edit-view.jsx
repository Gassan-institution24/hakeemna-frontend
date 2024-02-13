
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetOffer } from 'src/api/user';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TourNewEditForm from '../offer-new-edit-form';

// ----------------------------------------------------------------------

export default function TourEditView({ id }) {
  const settings = useSettingsContext();

  const { data } = useGetOffer(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Offer',
            href: paths.dashboard.tour.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TourNewEditForm currentTour={data} />
    </Container>
  );
}

TourEditView.propTypes = {
  id: PropTypes.string,
};
