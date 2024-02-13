import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import BookAppointment from 'src/sections/super-admin/stakeholders/history/book-appointment/book-appointment';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetStakeholder(id);
  const stakeholderName = data.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> {stakeholderName}: Book an appointment </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <BookAppointment stakeholderData={data} />}
    </>
  );
}
