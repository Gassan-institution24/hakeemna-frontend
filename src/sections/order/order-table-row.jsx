import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency,fData } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function OrderTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const {
    tableName,
    documents,
    status,
    orderNumber,
    createdAt,
    customer,
    totalQuantity,
    subTotal,
  } = row;
  console.log(row);

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  function stackComponent ({arr,idx})  {
    return(
      <Stack
        key={idx}
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
          '&:not(:last-of-type)': {
            borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
          },
        }}
      >
        {arr?.map((item)=> <Box>{item}</Box>)}
        
      </Stack>
    )
  };

  function timeFormatte(time) {
    // Extracting date
    const formattedDate = time.split('T')[0];

    // Extracting time without seconds
    const formattedTime = time.split('T')[1].slice(0, 5);
    return `${formattedTime} || ${formattedDate}`;
  }

  const renderPrimary = (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}

      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {tableName}
        </Box>
      </TableCell>

      <TableCell>
        <Box>Note</Box>
      </TableCell>

      {/* <TableCell>
        <ListItemText
          primary={format(new Date(createdAt), 'dd MMM yyyy')}
          secondary={format(new Date(createdAt), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center"> {totalQuantity} </TableCell>

      <TableCell> {fCurrency(subTotal)} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'completed' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell> */}

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'}>
          <Iconify icon="majesticons:open" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          {tableName === 'countries' && <Stack component={Paper} sx={{ m: 1.5 }}>
              {documents.map((item, idx) => stackComponent({idx:{idx},arr:[item.name_english,item.status,fData(item.created_at),fData(item.updated_at)]}))}
          </Stack>}
          {tableName === 'cities' && <Stack component={Paper} sx={{ m: 1.5 }}>
              {documents.map((item, idx) => stackComponent({idx:{idx},arr:[item.name_english,item.status,item.country?.name_english,item.user_creation?.firstname,item.user_modification?.firstname,timeFormatte(item.created_at),timeFormatte(item.updated_at)]}))}
          </Stack>}
          {tableName === 'surgeries' && <Stack component={Paper} sx={{ m: 1.5 }}>
              {documents.map((item, idx) => stackComponent({idx:{idx},arr:[item.name,item.description,item.user_creation?.firstname,item.user_modification?.firstname,timeFormatte(item.created_at),timeFormatte(item.updated_at)]}))}
          </Stack>}
          {tableName === 'diseases' && <Stack component={Paper} sx={{ m: 1.5 }}>
              {documents.map((item, idx) => stackComponent({idx:{idx},arr:[item.name,item.description,item.category?.name,item.user_creation?.firstname,item.user_modification?.firstname,timeFormatte(item.created_at),timeFormatte(item.updated_at)]}))}
          </Stack>}
          {tableName === 'specialities' && <Stack component={Paper} sx={{ m: 1.5 }}>
              {documents.map((item, idx) => stackComponent({idx:{idx},arr:[item.name_english,item.description,item.user_creation?.firstname,item.user_modification?.firstname,timeFormatte(item.created_at),timeFormatte(item.updated_at)]}))}
          </Stack>}
          {tableName === 'sub_specialities' && <Stack component={Paper} sx={{ m: 1.5 }}>
              {documents.map((item, idx) => stackComponent({idx:{idx},arr:[item.name_english,item.description,item.user_creation?.firstname,item.user_modification?.firstname,timeFormatte(item.created_at),timeFormatte(item.updated_at)]}))}
          </Stack>}
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="majesticons:open" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover> */}

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

OrderTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
