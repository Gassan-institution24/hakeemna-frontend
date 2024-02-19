import PropTypes from 'prop-types';

import Main from './main';
import NavEmployee from './nav-service-unit';

// ----------------------------------------------------------------------

export default function SecondaryNavLayout({ children }) {
  return (
    <>
      <NavEmployee />
      <Main>{children}</Main>
    </>
  );
}

SecondaryNavLayout.propTypes = {
  children: PropTypes.node,
};
