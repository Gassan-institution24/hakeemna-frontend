import { m } from 'framer-motion';
import { useCallback } from 'react';

import { Box } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import { Button, Typography } from '@mui/material';

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
          fontSize: 15,
          position: 'relative',
          top: -2,
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {' '}
        {currentLang.label}
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 130 }}
        arrow="top-left"
      >
        {langs?.map((option, idx) => (
          <MenuItem
            lang="ar"
            key={idx}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            {option?.label === 'العربية' ? (
              // <Iconify
              //   icon={option.icon}
              //   sx={{ borderRadius: 0.65, width: 28, backgroundColor: '#007B3A', color: 'white' }}
              // />
              <Box sx={{ borderRadius: 0.65, width: 30, backgroundColor: '#007B3A', color: 'white', textAlign:'center', mr:2 }}> 
                <Typography>ض</Typography>
              </Box>
              
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
