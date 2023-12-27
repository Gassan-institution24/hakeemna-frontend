import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useGetPaymentmethods } from 'src/api/user';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PaymentCardItem() {
  const popover = usePopover();
  const { paymentmethods } = useGetPaymentmethods();
  return (
    <>
      <Stack
        spacing={1}
        component={Paper}
        variant="outlined"
        sx={{
          p: 2.5,
          width: 1,
          position: 'relative',
          // ...sx,
        }}
        // {...other}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon='logos:visa'
            width={36}
          />

          {/* {card.primary && <Label color="info">Default</Label>} */}
          <Label color="info">Default</Label>
        </Stack>
        {
          paymentmethods.map((paymentmethod)=>(
             <Typography variant="subtitle2">{paymentmethod.identification_num}</Typography>
          ))
        }
       

        <IconButton
          onClick={popover.onOpen}
          sx={{
            top: 8,
            right: 8,
            position: 'absolute',
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem onClick={popover.onClose} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

// PaymentCardItem.propTypes = {
//   card: PropTypes.object,
//   sx: PropTypes.object,
// };
