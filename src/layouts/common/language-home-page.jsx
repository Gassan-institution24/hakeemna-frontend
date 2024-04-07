import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

// import { useAuthContext } from 'src/auth/hooks';
import { useTranslate, useLocalesHome } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function Language() {
  const popover = usePopover();

  // const { user } = useAuthContext();

  const { onChangeLang } = useTranslate();

  const { langs, currentLang } = useLocalesHome();

  const handleChangeLang = useCallback(
    (newLang) => {
      onChangeLang(newLang);
      popover.onClose();
    },
    [onChangeLang, popover]
  );

  return (
    <>
      <Button
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          // fontSize: 13,
          // fontWeight: 600,
          // width: 40,
          // height: 40,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {/* {currentLang.label} */}
        {currentLang?.value === 'ar' ? (
              <Iconify
                icon={currentLang.icon}
                sx={{ borderRadius: 0.65, width: 28, backgroundColor: '#007B3A', color: 'white' }}
              />
            ) : (
              <Iconify icon={currentLang.icon} sx={{ borderRadius: 0.65, width: 28 }} />
            )}
       
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {langs?.map((option, idx) => (
          <MenuItem
            lang="ar"
            key={idx}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            {option?.label === 'العربية' ? (
              <Iconify
                icon={option.icon}
                sx={{ borderRadius: 0.65, width: 28, backgroundColor: '#007B3A', color: 'white' }}
              />
            ) : (
              <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} />
            )}

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
