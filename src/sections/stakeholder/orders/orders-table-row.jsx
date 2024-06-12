import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Link, Stack, Avatar } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AppointmentsTableRow({
  row,
  selected,
  onSelectRow,
  refetch,
  onViewRow,
  onBookAppoint,
  onDelayRow,
  onCancelRow,
  onUnCancelRow,
  onDeleteRow,
}) {
  const {
    _id,
    code,
    name_english,
    name_arabic,
    description_english,
    description_arabic,
    quantity,
    category,
    currency,
    price,
    images,
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

  const router = useRouter();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const popover = usePopover();
  const DDL = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="center">{code}</TableCell>
        <TableCell align="center">
          <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
            <Avatar
              alt={curLangAr ? name_arabic : name_english}
              src={images[0]}
              variant="rounded"
              sx={{ width: 64, height: 64, mr: 2 }}
            />

            <ListItemText
              disableTypography
              primary={
                <Link
                  noWrap
                  color="inherit"
                  variant="subtitle2"
                  onClick={() => router.push(paths.stakeholder.products.edit(_id))}
                  sx={{ cursor: 'pointer' }}
                >
                  {curLangAr ? name_arabic : name_english}
                </Link>
              }
              secondary={
                <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
                  {curLangAr ? description_arabic : description_english}
                </Box>
              }
              sx={{ display: 'flex', flexDirection: 'column' }}
            />
          </Stack>
        </TableCell>
        <TableCell align="center">
          {curLangAr ? category?.name_arabic : category?.name_english}
        </TableCell>
        <TableCell align="center">{quantity}</TableCell>
        <TableCell align="center">{fCurrency(price, currency?.symbol)}</TableCell>
        <TableCell align="center">
          <Label
            variant="soft"
            color={
              (status === 'published' && 'success') ||
              (status === 'draft' && 'warning') ||
              'default'
            }
          >
            {t(status)}
          </Label>
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
        <MenuItem
          lang="ar"
          onClick={() => {
            router.push(paths.stakeholder.products.edit(_id));
            popover.onClose();
          }}
        >
          <Iconify icon="fluent:edit-32-filled" />
          {t('edit')}
        </MenuItem>
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

AppointmentsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onCancelRow: PropTypes.func,
  onUnCancelRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onBookAppoint: PropTypes.func,
  onViewRow: PropTypes.func,
  onDelayRow: PropTypes.func,
  refetch: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
