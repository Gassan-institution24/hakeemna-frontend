import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetOffer } from 'src/api';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import OfferNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function ProductEditView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate()

  const { offerData } = useGetOffer(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("edit offer")}
        links={[
          { name: t('dashboard'), href: paths.stakeholder.root },
          {
            name: t('offers'),
            href: paths.stakeholder.offers.root,
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {offerData && <OfferNewEditForm currentOffer={offerData} />}
    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
