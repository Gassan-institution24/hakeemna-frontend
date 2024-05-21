import PropTypes from 'prop-types';

import Main from './main';
import NavEmployee from './nav-department';

// ----------------------------------------------------------------------

export default function WorkGroupsNavLayout({ children }) {
  return (
    <>
      <NavEmployee />
      <Main>{children}</Main>
    </>
  );
}

WorkGroupsNavLayout.propTypes = {
  children: PropTypes.node,
};
