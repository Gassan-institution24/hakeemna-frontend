import { Helmet } from 'react-helmet-async';

import BookAppointment from 'src/sections/stakeholders/history/book-appointment/book-appointment';
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
        <title> {stakeholderName}: Book an appointment </title>
      </Helmet>

      {data && <BookAppointment stakeholderData={data} />}
    </>
  );
}
