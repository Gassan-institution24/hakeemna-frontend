import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import OfferNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function OfferCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslate()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("create a new offer")}
        links={[
          {
            name: t('dashboard'),
            href: paths.stakeholder.root,
          },
          {
            name: t('offers'),
            href: paths.stakeholder.offers.root,
          },
          { name: t('new') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OfferNewEditForm />
    </Container>
  );
}
