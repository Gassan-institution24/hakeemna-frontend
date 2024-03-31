import { m } from 'framer-motion';
import { useEffect, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const popover = usePopover();

  const { user } = useAuthContext();

  const { onChangeLang } = useTranslate();

  const { allLangs, currentLang } = useLocales();

  const handleChangeLang = useCallback(
    (newLang) => {
      onChangeLang(newLang);
      popover.onClose();
    },
    [onChangeLang, popover]
  );

  useEffect(() => {
    if (user?.role === 'superadmin' && currentLang.value !== 'en') {
      onChangeLang('en');
    }
  }, [user, onChangeLang, currentLang]);

  return (
    <>
      {user?.role !== 'superadmin' && (
        <Button
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={popover.onOpen}
          sx={{
            fontSize: 13,
            fontWeight: 600,
            width: 40,
            height: 40,
            ...(popover.open && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          {currentLang.label}
          {/* <Iconify icon={currentLang.icon} sx={{ borderRadius: 0.65, width: 28 }} /> */}
        </Button>
      )}

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {allLangs.map((option, idx) => (
          <MenuItem
            lang="ar"
            key={idx}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
