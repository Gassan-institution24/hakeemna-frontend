import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetOffer } from 'src/api';
import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OfferProducts from '../offer-products';
// ----------------------------------------------------------------------

export default function TableCreateView() {
  const { id } = useParams();
  const { offerData } = useGetOffer(id);

  const { t } = useTranslate();

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('offer products')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('products and supplier'), href: paths.dashboard.user.products.root },
          { name: t('offer products') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {offerData && <OfferProducts offerData={offerData} />}
    </Container>
  );
}
