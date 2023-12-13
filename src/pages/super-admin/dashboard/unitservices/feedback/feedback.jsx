import { Helmet } from 'react-helmet-async';

import UnitServiceFeedback from 'src/sections/unitservices/feedback/feedback';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> Unit Service Feedback </title>
      </Helmet>

      <UnitServiceFeedback />
    </>
  );
}
