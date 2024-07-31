import { Helmet } from 'react-helmet-async';

import InvoicingView from 'src/sections/stakeholder/accounting/invoicing/view/home';
// ----------------------------------------------------------------------

export default function InvoicingPage() {
  return (
    <>
      <Helmet>
        <title>invoicing</title>
        <meta name="description" content="meta" />
      </Helmet>

      <InvoicingView />
    </>
  );
}
