import PropTypes from 'prop-types';

import { useSettingsContext } from 'src/components/settings';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import InvoiceDetails from './accounting-details';
import InvoiceDetailToolbar from './accounting-detail-toolbar';

// ----------------------------------------------------------------------

export default function InvoiceDetailView({ economicMovementData }) {
  const params = useParams();
  const { id } = params;
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <InvoiceDetailToolbar
        backLink={paths.superadmin.patients.history.root(id)}
        // editLink={paths.superadmin.patients.history.invoices.edit(id,economicMovementData._id)}
        // liveLink="#"
      />
      <InvoiceDetails economicMovementData={economicMovementData} />
    </Container>
  );
}

InvoiceDetailView.propTypes = {
  economicMovementData: PropTypes.object,
};
