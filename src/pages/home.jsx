import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import HomeView from 'src/sections/home/view/home-view';

// ----------------------------------------------------------------------

export default function HomePage({divRef}) {
  return (
    <>
      <Helmet>
        <title>Doctorna</title>
      </Helmet>

      <HomeView divRef={divRef} />
    </>
  );
}
HomePage.propTypes = {
  divRef: PropTypes.element,
};
