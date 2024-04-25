import { m } from 'framer-motion';
// import React, { useState, useCallback } from 'react';

// import { Button } from '@mui/material';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { varFade } from 'src/components/animate';

export default function Mymentalhealth() {
  const { t } = useTranslate();
  return (
    <m.div variants={varFade().inRight}>
      <Typography variant="h5">
        {' '}
        {t('my mental health')} - {t('Coming Soon!')}{' '}
      </Typography>
    </m.div>
  );
}
