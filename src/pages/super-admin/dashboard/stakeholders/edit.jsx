import { Helmet } from 'react-helmet-async';

import EditPatient from 'src/sections/stakeholders/edit/edit-patient';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: Edit {stakeholderName} </title>
      </Helmet>

      {data && <EditPatient stakeholderData={data} />}
    </>
  );
}
