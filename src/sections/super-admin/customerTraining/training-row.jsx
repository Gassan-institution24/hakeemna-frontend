import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TrainingsTableRow({
  row,
  selected,
  onChangeStatus,

}) {
  const {
    _id,
    code,
    full_name,
    topic,
    email,
    mobile_num1,
    status,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const { t } = useTranslate();

  const popover = usePopover();
  const DDL = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{code}</TableCell>
        <TableCell align="center">{full_name}</TableCell>
        <TableCell align="center">{topic}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center">{mobile_num1}</TableCell>
        <TableCell align="center">
          <Select
            size='small'
            value={status}
            onChange={(e) => onChangeStatus(_id, e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 240 },
              },
            }}
            sx={{
              backgroundColor:
                (status === 'underreview' && 'warning.lighter') ||
                (status === 'accepted' && 'info.lighter') ||
                (status === 'processing' && 'secondary.lighter') ||
                (status === 'finished' && 'success.lighter') ||
                (status === 'rejected' && 'error.lighter') ||
                'default',
              color:
                (status === 'underreview' && 'warning.dark') ||
                (status === 'accepted' && 'info.dark') ||
                (status === 'processing' && 'secondary.dark') ||
                (status === 'finished' && 'success.dark') ||
                (status === 'rejected' && 'error.dark') ||
                'default'
            }}
          >
            <MenuItem lang="ar" sx={{ color: 'warning.dark' }} value="underreview">
              {t('underreview')}
            </MenuItem>
            <MenuItem lang="ar" sx={{ color: 'info.dark' }} value="accepted">
              {t('accepted')}
            </MenuItem>
            <MenuItem lang="ar" sx={{ color: 'secondary.dark' }} value="processing">
              {t('processing')}
            </MenuItem>
            <MenuItem lang="ar" sx={{ color: 'success.dark' }} value="finished">
              {t('finished')}
            </MenuItem>
            <MenuItem lang="ar" sx={{ color: 'error.dark' }} value="rejected">
              {t('rejected')}
            </MenuItem>
          </Select>
          {/* <Label
            variant="soft"
            color={
              (status === 'underreview' && 'warning') ||
              (status === 'accepted' && 'info') ||
              (status === 'processing' && 'secondary') ||
              (status === 'finished' && 'success') ||
              (status === 'rejected' && 'error') ||
              'default'
            }
          >
            {t(status)}
          </Label> */}
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 155 }}
      >
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
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
        <Box sx={{ fontWeight: 600 }}>{t('creation time')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={format(new Date(created_at), 'dd MMM yyyy')}
            secondary={format(new Date(created_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={format(new Date(updated_at), 'dd MMM yyyy')}
            secondary={format(new Date(updated_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_modification?.email}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ip_address_user_modification}
        </Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>
          {t('modifications no')}: {modifications_nums}
        </Box>
      </CustomPopover>
    </>
  );
}

TrainingsTableRow.propTypes = {
  onChangeStatus: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
