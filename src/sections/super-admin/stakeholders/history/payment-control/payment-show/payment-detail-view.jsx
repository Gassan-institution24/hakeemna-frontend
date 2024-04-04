import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useSettingsContext } from 'src/components/settings';

import PaymentDetails from './payment-details';
import PaymentDetailToolbar from './payment-detail-toolbar';

// ----------------------------------------------------------------------

export default function InvoiceDetailView({ paymentData }) {
  const params = useParams();
  const { id } = params;
  const settings = useSettingsContext();
  return (
    <Container maxWidth="xl">
      <PaymentDetailToolbar
        backLink={paths.superadmin.stakeholders.history.root(id)}
        // editLink={paths.superadmin.stakeholders.history.invoices.edit(id,paymentData._id)}
        // liveLink="#"
      />
      <PaymentDetails paymentData={paymentData} />
    </Container>
  );
}

InvoiceDetailView.propTypes = {
  paymentData: PropTypes.object,
};
