import { Helmet } from 'react-helmet-async';

import RecieptsInfoView from 'src/sections/stakeholder/accounting/reciepts/view/info';
// ----------------------------------------------------------------------

export default function RecieptsInfoPage() {
  return (
    <>
      <Helmet>
        <title>Reciept Info</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RecieptsInfoView />
    </>
  );
}
