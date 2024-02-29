import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetRoom } from 'src/api';

import RoomEditView from 'src/sections/unit-service/tables/rooms/view/edit';

// ----------------------------------------------------------------------

export default function RoomEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetRoom(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>Edit {name || ''} Room</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <RoomEditView roomData={data} />}
    </>
  );
}
