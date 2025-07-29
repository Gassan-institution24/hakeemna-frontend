import { Helmet } from 'react-helmet-async';

import QrCodePage from 'src/sections/employee/appointmentsToday/qr-code-page';

// ----------------------------------------------------------------------

export default function QrCodePageWrapper() {
  return (
    <>
      <Helmet>
        <title>Employee : QR Code</title>
        <meta name="description" content="QR Code for patient arrival confirmation" />
      </Helmet>
      <QrCodePage />
    </>
  );
} 