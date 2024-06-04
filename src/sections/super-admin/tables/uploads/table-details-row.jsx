import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TableDetailsRow({ row, selected, onEditRow, onSelectRow }) {
  const {
    _id,
    type,
    mustUpload,
    uploaded,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
  } = row;

  const router = useRouter();

  const popover = usePopover();
  const DDL = usePopover();

  const handleView = () => {
    if (type === 'companies') {
      router.push(`${paths.superadmin.tables.companies.root}?upload_record=${_id}`);
    } else if (type === 'countries') {
      router.push(`${paths.superadmin.tables.countries.root}?upload_record=${_id}`);
    } else if (type === 'cities') {
      router.push(`${paths.superadmin.tables.cities.root}?upload_record=${_id}`);
    } else if (type === 'analyses') {
      router.push(`${paths.superadmin.tables.analysis.root}?upload_record=${_id}`);
    } else if (type === 'currency') {
      router.push(`${paths.superadmin.tables.currency.root}?upload_record=${_id}`);
    } else if (type === 'diets') {
      router.push(`${paths.superadmin.tables.diets.root}?upload_record=${_id}`);
    } else if (type === 'hospitals') {
      router.push(`${paths.superadmin.tables.hospitallist.root}?upload_record=${_id}`);
    } else if (type === 'insurance_companies') {
      router.push(`${paths.superadmin.tables.insurancecomapnies.root}?upload_record=${_id}`);
    } else if (type === 'measurment_types') {
      router.push(`${paths.superadmin.tables.measurementtypes.root}?upload_record=${_id}`);
    } else if (type === 'medCategories') {
      router.push(`${paths.superadmin.tables.medcategories.root}?upload_record=${_id}`);
    } else if (type === 'medFamilies') {
      router.push(`${paths.superadmin.tables.medfamilies.root}?upload_record=${_id}`);
    } else if (type === 'medicines') {
      router.push(`${paths.superadmin.tables.medicines.root}?upload_record=${_id}`);
    } else if (type === 'specialities') {
      router.push(`${paths.superadmin.tables.specialities.root}?upload_record=${_id}`);
    } else if (type === 'subspecialities') {
      router.push(`${paths.superadmin.tables.subspecialities.root}?upload_record=${_id}`);
    } else if (type === 'surgeries') {
      router.push(`${paths.superadmin.tables.surgeries.root}?upload_record=${_id}`);
    } else if (type === 'symptoms') {
      router.push(`${paths.superadmin.tables.symptoms.root}?upload_record=${_id}`);
    }
  };

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">{type}</TableCell>
      <TableCell align="center">{mustUpload}</TableCell>

      <TableCell
        align="center"
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={handleView}
      >
        {uploaded}
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
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
        <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>
        <Box sx={{ pt: 1, fontWeight: 600 }}>Editing Time:</Box>
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

TableDetailsRow.propTypes = {
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
