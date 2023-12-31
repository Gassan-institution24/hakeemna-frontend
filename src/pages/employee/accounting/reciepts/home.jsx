import { Helmet } from 'react-helmet-async';
import RecieptsView from 'src/sections/employee/accounting/reciepts/view/home'
// ----------------------------------------------------------------------

export default function RecieptsPage() {
  return (
    <>
      <Helmet>
        <title>Reciepts</title>
      </Helmet>

      <RecieptsView />
    </>
  );
}
