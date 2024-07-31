import { Helmet } from 'react-helmet-async';

import RecieptsView from 'src/sections/stakeholder/accounting/reciepts/view/home';
// ----------------------------------------------------------------------

export default function RecieptsPage() {
  return (
    <>
      <Helmet>
        <title>Reciepts</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RecieptsView />
    </>
  );
}
