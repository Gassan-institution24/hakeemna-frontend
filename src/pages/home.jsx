import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import HomeView from 'src/sections/home/view/home-view';

// ----------------------------------------------------------------------

export default function HomePage({ divRef, divRef2 }) {
  return (
    <>
      <Helmet>
        <title>Doctorna</title>
      </Helmet>

      <HomeView divRef={divRef} divRef2={divRef2} />
    </>
  );
}
HomePage.propTypes = {
  divRef: PropTypes.element,
  divRef2: PropTypes.element,
};
