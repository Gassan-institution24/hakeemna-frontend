import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EditPatient from 'src/sections/super-admin/stakeholders/edit/edit-patient';
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
