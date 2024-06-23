import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetOffer } from 'src/api';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import OfferProducts from '../offer-products';
// ----------------------------------------------------------------------

export default function TableCreateView() {
    const { id } = useParams()
    const { offerData } = useGetOffer(id)
    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading="offer products"
                links={[
                    { name: 'Dashboard', href: paths.unitservice.root },
                    { name: 'products and supplier', href: paths.unitservice.products.root },
                    { name: 'offer products' }
                ]}
                // action={
                //   <Button
                //     component={RouterLink}
                //     href={paths.dashboard.job.new}
                //     variant="contained"
                //     startIcon={<Iconify icon="mingcute:add-line" />}
                //   >
                //     New Job
                //   </Button>
                // }
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            {offerData && <OfferProducts offerData={offerData} />}
        </Container>
    );
}
