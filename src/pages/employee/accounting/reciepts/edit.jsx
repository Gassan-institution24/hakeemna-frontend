import { Helmet } from 'react-helmet-async';
import RecieptsEditView from 'src/sections/employee/accounting/reciepts/view/edit'
// ----------------------------------------------------------------------

export default function RecieptsEditPage() {
  return (
    <>
      <Helmet>
        <title>Edit Reciept</title>
      </Helmet>

      <RecieptsEditView />
    </>
  );
}
