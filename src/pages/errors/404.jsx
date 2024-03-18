import { Helmet } from 'react-helmet-async';

import NotFoundView from 'src/sections/errors/404';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: 404 Page Not Found!</title>
        <meta name="description" content="meta" />
      </Helmet>

      <NotFoundView />
    </>
  );
}
