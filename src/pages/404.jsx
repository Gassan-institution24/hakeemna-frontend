import { Helmet } from 'react-helmet-async';

import NotFoundView from 'src/sections/404';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found!</title>
        <meta name="description" content="meta" />
      </Helmet>

      <NotFoundView />
    </>
  );
}
