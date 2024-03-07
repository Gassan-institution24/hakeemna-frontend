import React from 'react';

import { Typography } from '@mui/material';

export default function home() {
  return (
    <div style={{ display: 'grid', placeContent: 'center' }}>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Select One Employee to start
      </Typography>
    </div>
  );
}
