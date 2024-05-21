import PropTypes from 'prop-types';

import Main from './main';
import NavEmployee from './nav-department';

// ----------------------------------------------------------------------

export default function DepartmentsNavLayout({ children }) {
  return (
    <>
      <NavEmployee />
      <Main>{children}</Main>
    </>
  );
}

DepartmentsNavLayout.propTypes = {
  children: PropTypes.node,
};
