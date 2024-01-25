import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useGetEmployeeEngagement } from 'src/api/tables';

import EmployeeACLView from 'src/sections/unit-service/acl/view/acl';

// ----------------------------------------------------------------------

export default function EmployeeACLPage() {
  const {id} = useParams()
  const acl = useGetEmployeeEngagement(id).data?.acl;
  return (
    <>
      <Helmet>
        <title>Access control list</title>
      </Helmet>

      {acl&&<EmployeeACLView acl={acl} />}
    </>
  );
}
