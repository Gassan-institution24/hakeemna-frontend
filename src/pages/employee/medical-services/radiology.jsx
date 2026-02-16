import { Helmet } from 'react-helmet-async';

import Radiology from "src/sections/employee/medical-services/radiology";

// ----------------------------------------------------------------------

export default function RadiologyPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: radiology</title>
        <meta name="description" content="meta" />
      </Helmet>

        <Radiology />
    </>
  );
}