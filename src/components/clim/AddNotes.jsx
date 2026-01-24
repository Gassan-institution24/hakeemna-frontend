import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Box, TextField, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

export default function AddNotes({ onDataChange }) {
  const { t } = useTranslate();
  const [note, setNote] = useState('');

  useEffect(() => {
    if (onDataChange) {
      onDataChange(note.trim().length > 0);
    }
  }, [note, onDataChange]);

  return (
    <Box>
      <Typography fontWeight="bold" mb={1}>
        {t('Notes')}
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={4}
        placeholder={t('Write your notes here')}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </Box>
  );
}

AddNotes.propTypes = {
  onDataChange: PropTypes.func,
};
