import PropTypes from 'prop-types';

import Main from './main';
import NavEmployee from './nav-department';

// ----------------------------------------------------------------------

export default function PermissionsNavLayout({ children }) {
  return (
    <>
      <NavEmployee />
      <Main>{children}</Main>
    </>
  );
}

PermissionsNavLayout.propTypes = {
  children: PropTypes.node,
};
