import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import PatientHistory from 'src/sections/super-admin/stakeholders/history/stakeholder-history';
// ----------------------------------------------------------------------

export default function StakeholderHistoryPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetStakeholder(id);
  const stakeholderName = data.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} History </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <PatientHistory stakeholderData={data} />}
    </>
  );
}
