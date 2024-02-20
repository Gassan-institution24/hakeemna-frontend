import PropTypes from 'prop-types';

import Main from './main';
import NavEmployee from './nav-department';

// ----------------------------------------------------------------------

export default function DepartmentNavLayout({ children }) {
  return (
    <>
      <NavEmployee />
      <Main>{children}</Main>
    </>
  );
}

DepartmentNavLayout.propTypes = {
  children: PropTypes.node,
};
