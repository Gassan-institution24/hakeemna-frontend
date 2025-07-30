import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// const loginPaths = {
//   jwt: paths.auth.login,
//   auth0: paths.auth.auth0.login,
//   amplify: paths.auth.amplify.login,
//   firebase: paths.auth.firebase.login,
// };

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container> {children}</Container>}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function Container({ children }) {
  const router = useRouter();

  const { authenticated } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      const currentPath = url.pathname;
      const currentSearch = url.search;

      const searchParams = new URLSearchParams();
      searchParams.set('returnTo', currentPath + currentSearch);

      const loginPath = paths.auth.login;

      const href = `${loginPath}?${searchParams.toString()}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

Container.propTypes = {
  children: PropTypes.node,
};
