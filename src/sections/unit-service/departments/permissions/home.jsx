import React from 'react';

import { Typography } from '@mui/material';
import { useTranslate } from 'src/locales';

export default function Home() {
  const { t } = useTranslate();
  return (
    <div style={{ display: 'grid', placeContent: 'center' }}>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {t('Select One Employee to start')}
      </Typography>
    </div>
  );
}
