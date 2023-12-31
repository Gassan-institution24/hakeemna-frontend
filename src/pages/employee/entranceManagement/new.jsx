import { Helmet } from 'react-helmet-async';
import NewEntranceManagementView from 'src/sections/employee/entranceManagement/view/new'
// ----------------------------------------------------------------------

export default function EntranceManagementNewPage() {
  return (
    <>
      <Helmet>
        <title>New Entrance Management</title>
      </Helmet>

      <NewEntranceManagementView />
    </>
  );
}
