import { Helmet } from 'react-helmet-async';

import EditPatient from 'src/sections/super-admin/stakeholders/edit/edit-patient';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetStakeholder(id);
  const stakeholderName = data.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: Edit {stakeholderName} </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EditPatient stakeholderData={data} />}
    </>
  );
}
