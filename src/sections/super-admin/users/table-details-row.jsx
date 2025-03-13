import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';

import Box from '@mui/material/Box';
import { ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function CountriesTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onInactivate,
  onActivate,
}) {
  const {
    code,
    userName,
    email,
    role,
    status,
    online,
    last_online,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const DDL = usePopover();
  const popover = usePopover();
  const router = useRouter();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="center">
        <Box>{code}</Box>
      </TableCell>

      <TableCell align="center">{userName}</TableCell>
      <TableCell align="center">{email}</TableCell>
      <TableCell align="center">{role}</TableCell>
      <TableCell align="center">
        <Iconify
          icon={online ? 'noto:green-circle' : 'noto:red-circle'}
          style={{ width: '10px' }}
        />
      </TableCell>
      <TableCell align="center">
        <ListItemText
          primary={
            isValid(new Date(last_online)) && format(new Date(last_online), 'dd MMMMMMMM yyyy')
          }
          secondary={isValid(new Date(last_online)) && format(new Date(last_online), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        {/* <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton> */}
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* {status === 'active' ? (
          <MenuItem lang="ar" 
            onClick={() => {
              onInactivate();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="ic:baseline-pause" />
            Inactivate
          </MenuItem>
        ) : (
          <MenuItem lang="ar" 
            onClick={() => {
              onActivate();
              popover.onClose();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="bi:play-fill" />
            activate
          </MenuItem>
        )} */}

        {/* <MenuItem
          lang="ar"
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="fluent:edit-32-filled" />
          Edit
        </MenuItem> */}
        <MenuItem
          lang="ar"
          onClick={() => {
            router.push(`${paths.call}?userId=${row?._id}`);
          }}
        >
          <Iconify icon="material-symbols:call-sharp" />
          Call
        </MenuItem>
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          DDL
        </MenuItem>
      </CustomPopover>

      <CustomPopover
        open={DDL.open}
        onClose={DDL.onClose}
        arrow="right-top"
        sx={{
          padding: 2,
          fontSize: '14px',
        }}
      >
        <Box sx={{ fontWeight: 600 }}>Creation Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(created_at)}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{fDateTime(updated_at)}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_modification?.email}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editor IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ip_address_user_modification}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Modifications No: {modifications_nums}</Box>
      </CustomPopover>
    </>
  );
}

CountriesTableRow.propTypes = {
  onInactivate: PropTypes.func,
  onActivate: PropTypes.func,
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
