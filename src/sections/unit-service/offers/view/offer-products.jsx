import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useGetOffer } from 'src/api';
import { useParams } from 'src/routes/hooks';

import OfferProducts from '../offer-products';
// ----------------------------------------------------------------------

export default function TableCreateView() {
    const { id } = useParams()
    const { offerData } = useGetOffer(id)
    console.log('offerData', offerData)
    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading="offer products"
                links={[
                    { name: 'Dashboard', href: paths.unitservice.root },
                    { name: 'products and supplier', href: paths.unitservice.products.root },
                    { name: 'List' }
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
