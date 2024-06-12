import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OfferNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function OfferCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new offer"
        links={[
          {
            name: 'Dashboard',
            href: paths.stakeholder.root,
          },
          {
            name: 'offers',
            href: paths.stakeholder.offers.root,
          },
          { name: 'New offer' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OfferNewEditForm />
    </Container>
  );
}
