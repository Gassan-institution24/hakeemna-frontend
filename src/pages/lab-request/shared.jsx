import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import SharedLabRequestView from 'src/sections/shared/lab-requests/shared-lab-request-view';

// ----------------------------------------------------------------------

// Public: opened by a dental lab from the link a clinic shared. No login.
export default function SharedLabRequestPage() {
  const { token } = useParams();

  return (
    <>
      <Helmet>
        <title>Lab Request | Hakeemna</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <SharedLabRequestView token={token} />
    </>
  );
}
