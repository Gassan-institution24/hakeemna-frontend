import { m } from 'framer-motion';
import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import axios, { endpoints } from 'src/utils/axios';
import Image from 'src/components/image';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ServiceUnitPopover() {
  const popover = usePopover();

  const { user } = useAuthContext();

  const selected = user.employee.employee_engagements[user.employee.selected_engagement];

  const handleChangeUS = useCallback(
    async (newUS) => {
      await axios.patch(endpoints.tables.employee(user.employee._id), {
        selected_engagement: newUS,
      });
      popover.onClose();
    },
    [user.employee, popover]
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          {selected.unit_service.name_english.split(' ').map(word => word.charAt(0).toUpperCase()).join('')}
        </Typography>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {user.employee.employee_engagements.map((option,index) => (
          <MenuItem
            key={option.unit_service._id}
            selected={option.unit_service._id === selected.unit_service._id}
            onClick={() => handleChangeUS(index)}
          >
            {option.unit_service.name_english}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
