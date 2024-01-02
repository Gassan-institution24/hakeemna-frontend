import { Helmet } from 'react-helmet-async';

import RoomEditView from 'src/sections/unit-service/tables/rooms/view/edit';
import { useGetRoom } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function RoomEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetRoom(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>Edit {name||''} Room</title>
      </Helmet>

      {data && <RoomEditView roomData={data} />}
    </>
  );
}
