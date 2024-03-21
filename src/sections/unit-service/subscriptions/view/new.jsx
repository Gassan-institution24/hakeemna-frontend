import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useGetActiveSubscriptions } from 'src/api';

// import { _pricingPlans } from 'src/_mock';

import PricingCard from '../pricing-card';

// ----------------------------------------------------------------------

export default function PricingView() {
  const { subscriptionsData } = useGetActiveSubscriptions();
  return (
    <Container>
      <Box
        gap={{ xs: 3, md: 5 }}
        display="grid"
        alignItems={{ md: 'center' }}
        gridTemplateColumns={{ md: 'repeat(3, 1fr)' }}
      >
        {subscriptionsData.map((card, index) => (
          <PricingCard key={card.subscription} card={card} index={index} />
        ))}
      </Box>
    </Container>
  );
}
