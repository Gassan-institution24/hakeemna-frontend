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
        fontSize: 14,
        fontWeight: 500,
       
      }}
    >
      {/* Globe Icon */}
      <LanguageOutlined  onClick={() => handleChangeLang(currentLang.value === 'en' ? 'ar' : 'en')} sx={{ fontSize: 20, color: 'text.primary' }} />

      {/* LanguageOutlined Title */}
      <Typography
        onClick={() => handleChangeLang(currentLang.value === 'en' ? 'ar' : 'en')}
        sx={{
          ml: 1,
          color: 'text.primary',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        {currentLang.value === 'en' ? 'عربي' : 'English'}
      </Typography>
    </Box>
  );
}
