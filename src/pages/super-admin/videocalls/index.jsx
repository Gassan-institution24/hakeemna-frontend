import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet-async';

import VideoCallsTableView from 'src/sections/super-admin/videocalls/view';
// ----------------------------------------------------------------------

export default function VideoCallsHomePage({unitServiceId=null}) {
  return (
    <>
      <Helmet>
        <title>Video calls</title>
        <meta name="description" content="meta" />
      </Helmet>

      <VideoCallsTableView unitServiceId={unitServiceId} />
    </>
  );
}

VideoCallsHomePage.propTypes = {
  unitServiceId: PropTypes.string,
};