import PropTypes from 'prop-types';

import Main from './main';
import NavEmployee from './nav-employee';

// ----------------------------------------------------------------------

export default function EmployeePermissionWGLayout({ children }) {
  return (
    <>
      <NavEmployee />
      <Main>{children}</Main>
    </>
  );
}

EmployeePermissionWGLayout.propTypes = {
  children: PropTypes.node,
};
