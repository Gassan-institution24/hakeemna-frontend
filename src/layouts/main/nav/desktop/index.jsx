import PropTypes from 'prop-types';

import NavList from './nav-list';


// ----------------------------------------------------------------------

export default function NavDesktop({ data }) {
  return (
    <>
      {data?.map((list, idx) => (list.title ? <NavList key={idx} data={list} /> : ''))}
    </>
  );
}

NavDesktop.propTypes = {
  data: PropTypes.array,
};
