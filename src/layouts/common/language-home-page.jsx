import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { LanguageOutlined } from '@mui/icons-material';
import { useTranslate, useLocalesHome } from 'src/locales';

// ----------------------------------------------------------------------

export default function Language() {
  const { onChangeLang } = useTranslate();
  const { langs, currentLang } = useLocalesHome();

  const handleChangeLang = useCallback(
    (newLang) => {
      onChangeLang(newLang);
    },
    [onChangeLang]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={() => handleChangeLang(currentLang.value === 'en' ? 'ar' : 'en')}
    >
      {/* Globe Icon */}
      <LanguageOutlined sx={{ fontSize: 18, color: '#1F2C5C' }} />

      {/* LanguageOutlined Title */}
      <Typography
        sx={{
          ml: 1,
          color: '#1F2C5C',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 15,
        }}
      >
        {currentLang.value === 'en' ? 'عربي' : 'English'}
      </Typography>
    </Box>
  );
}
