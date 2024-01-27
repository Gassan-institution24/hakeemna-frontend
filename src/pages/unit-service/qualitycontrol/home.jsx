import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';
import QualityControlView from 'src/sections/unit-service/qualitycontrol/view/home';
// ----------------------------------------------------------------------

export default function QualityControlPage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="read">
        <Helmet>
          <title>Quality Control</title>
        </Helmet>

        <QualityControlView />
      </ACLGuard>
    </>
  );
}
