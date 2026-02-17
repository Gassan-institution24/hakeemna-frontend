import { Helmet } from 'react-helmet-async';

import RadiologyView from "src/sections/employee/medical-services/radiology/radiology_view";
// ----------------------------------------------------------------------

export default function RadiologyViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: radiology view</title>
        <meta name="description" content="meta" />
      </Helmet>

        <RadiologyView />
    </>
  );
}