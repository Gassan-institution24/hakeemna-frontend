import { Helmet } from 'react-helmet-async';
import EntranceManagement from 'src/sections/employee/entranceManagement/view/home'
// ----------------------------------------------------------------------

export default function EntranceManagementHomePage() {
  return (
    <>
      <Helmet>
        <title>Entrance Management</title>
      </Helmet>

      <EntranceManagement />
    </>
  );
}
