import { Helmet } from 'react-helmet-async';
import RecieptsNewView from 'src/sections/employee/accounting/reciepts/view/new'
// ----------------------------------------------------------------------

export default function RecieptsNewPage() {
  return (
    <>
      <Helmet>
        <title>New Reciept</title>
      </Helmet>

      <RecieptsNewView />
    </>
  );
}
