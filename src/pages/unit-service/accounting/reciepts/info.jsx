import { Helmet } from 'react-helmet-async';
import RecieptsInfoView from 'src/sections/unit-service/accounting/reciepts/view/info'
// ----------------------------------------------------------------------

export default function RecieptsInfoPage() {
  return (
    <>
      <Helmet>
        <title>Reciept Info</title>
      </Helmet>

      <RecieptsInfoView />
    </>
  );
}
