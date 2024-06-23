import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetProduct } from 'src/api/product';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function ProductEditView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate()

  const { product: currentProduct } = useGetProduct(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("edit Product")}
        links={[
          { name: t('dashboard'), href: paths.stakeholder.root },
          {
            name: t('products'),
            href: paths.stakeholder.products.root,
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentProduct && <ProductNewEditForm currentProduct={currentProduct} />}
    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
