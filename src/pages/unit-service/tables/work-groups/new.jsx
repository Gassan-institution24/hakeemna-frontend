import { Helmet } from 'react-helmet-async';

import WorkGroupNewView from 'src/sections/unit-service/tables/work-groups/view/new';

// ----------------------------------------------------------------------

export default function WorkGroupNewPage() {
  return (
    <>
      <Helmet>
        <title>New Work Group</title>
      </Helmet>

      <WorkGroupNewView />
    </>
  );
}
