import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useModal } from 'src/context/Modal';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Stack, TextField, ListItemText, InputAdornment, Button } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
function CompanyNoteModalContent({ initialValue, onChange, value, setValue }) {
  useEffect(() => {
    setValue(initialValue);
    // eslint-disable-next-line
  }, []);
  return (
    <TextField
      autoFocus
      fullWidth
      multiline
      minRows={3}
      value={value}
      sx={{ mt: 2 }}
      onChange={onChange}
      label="Company Note"
    />
  );
}
CompanyNoteModalContent.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
};

export default function TableDetailsRow({
  row,
  index,
  selected,
  onEditRow,
  showAll,
  onSelectRow,
  displayedColumns,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [text, setText] = useState(row?.com_note || '');
  const popover = usePopover();
  const DDL = usePopover();
  const { showModal } = useModal();
  // Add null check for row
  if (!row) {
    return null;
  }

  const {
    code,
    unit_service_type,
    country,
    city,
    email,
    insurance,
    info,
    sector,
    commercial_name,
    province,
    address,
    phone_number_1,
    Phone_number_2,
    work_shift,
    constitution_objective,
    type_of_specialty_1,
    type_of_specialty_2,
    status,
    com_note,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
    notes,
    subscribe_to,
    social_network,
  } = row || {};

  const handleChangeStatus = async (event) => {
    try {
      await axiosInstance.patch(endpoints.companies.one(row?._id), { status: event.target.value });
      enqueueSnackbar('done');
    } catch (e) {
      enqueueSnackbar('error', { variant: 'error' });
    }
  };

  // Custom hook to set initial value only once
  function useInitialValue(setValue, value) {
    useEffect(() => {
      setValue(value);
      // eslint-disable-next-line
    }, []);
  }

  const handleOpenNoteModal = () => {
    const initialValue = text || '';
    showModal(
      text ? 'Edit Note' : 'Add Note',
      (props) => <CompanyNoteModalContent initialValue={initialValue} {...props} />,
      (onClose, noteValue) => ({
        onSave: async () => {
          await handleSubmitText(noteValue);
          setText(noteValue);
          onClose();
        },
        onCancel: onClose,
      })
    );
  };

  // Update handleSubmitText to accept a value
  const handleSubmitText = async (value) => {
    try {
      await axiosInstance.patch(endpoints.companies.one(row?._id), { com_note: value });
      enqueueSnackbar('done');
    } catch (e) {
      enqueueSnackbar('error', { variant: 'error' });
    }
  };
    const handleAddress = ()=>{
      if (!address) return null;
      const words = address.split(' ');
      if( words.length > 1) {
      const firstWord = words[0];
      const fullAddress = address
        return (
          <Box
            component="span"
            title={fullAddress} // Tooltip on hover
            sx={{
              cursor: 'default',
              maxWidth: '150px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {firstWord}...
          </Box>
      )}
      return (
        <Box
          component="span"
          title={address} // Tooltip on hover
          sx={{
            cursor: 'default',
            maxWidth: '150px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {address}
        </Box>
      );
    }




  const renderCell = (columnId) => {
    switch (columnId) {
      case 'code':
        return <Box>{code || ''}</Box>;
      case 'unit_service_type':
        return unit_service_type || '';
      case 'country':
        return country || '';
      case 'city':
        return city || '';
      case 'email':
        return email || '';
      case 'sector':
        return sector || '';
      case 'commercial_name':
        return commercial_name || '';
      case 'province':
        return province || '';
      case 'address':
        return handleAddress();

      case 'phone_number_1':
        return phone_number_1 ? (
          <a href={`tel:${phone_number_1}`} target="_blank" rel="noreferrer">
            {phone_number_1}
          </a>
        ) : '';
      case 'Phone_number_2':
        return Phone_number_2 ? (
          <a href={`tel:${Phone_number_2}`} target="_blank" rel="noreferrer">
            {Phone_number_2}
          </a>
        ) : '';
      case '':
        return phone_number_1 ? (
          <Stack direction="row" justifyContent="space-between">
            <a
              rel="noreferrer"
              target="_blank"
              style={{ color: 'green' }}
              href={`tel:${phone_number_1}`}
            >
              <Iconify icon="material-symbols:call" />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              style={{ color: 'green' }}
              href={`sms:${phone_number_1}`}
            >
              <Iconify icon="solar:chat-round-dots-bold" />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              style={{ color: 'green' }}
              href={`https://wa.me/ ${phone_number_1}`}
            >
              <Iconify icon="flowbite:whatsapp-solid" />
            </a>
          </Stack>
        ) : '';
      case 'status':
        return (
          <TextField select fullWidth value={status || ''} onChange={handleChangeStatus}>
            <MenuItem value="not contact">لم يتم التواصل</MenuItem>
            <MenuItem value="agreed">قبول</MenuItem>
            <MenuItem value="refused">رفض</MenuItem>
            <MenuItem value="no number">لا يوجد رقم للتواصل</MenuItem>
            <MenuItem value="wrong number">الرقم خاطئ</MenuItem>
          </TextField>
        );
      case 'com_note':
        return (
          <Button
            variant="outlined"
            startIcon={<Iconify icon={text ? 'mdi:pencil' : 'mdi:plus'} />}
            onClick={handleOpenNoteModal}
            title={text}  
            color={text ? 'primary' : 'success'}
          >
            {text ? 'Edit Note' : 'Add Note'}
          </Button>
        );
      case 'insurance':
        return showAll && (insurance || '');
      case 'info':
        return showAll && (info || '');
      case 'work_shift':
        return showAll && (work_shift || '');
      case 'constitution_objective':
        return showAll && (constitution_objective || '');
      case 'type_of_specialty_1':
        return showAll && (type_of_specialty_1 || '');
      case 'type_of_specialty_2':
        return showAll && (type_of_specialty_2 || '');
      case 'subscribe_to':
        return showAll && subscribe_to;
      case 'social_network':
        return showAll && social_network;
      case 'notes':
        return showAll && notes;
      default:
        return null;
    }
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          backgroundColor: index % 2 ? 'background.lightgray' : '',
          cursor: 'pointer',
        }}
        selected={selected}
        onClick={onSelectRow}
      >

        {displayedColumns.map((col) => (
          <TableCell key={col.id} align="center">
            {renderCell(col.id)}
          </TableCell>
        ))}

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>


      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          lang="ar"
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="fluent:edit-32-filled" />
          تعديل
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
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={fDate(created_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(created_at, 'p')}
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
            primary={fDate(updated_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(updated_at, 'p')}
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
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
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
  showAll: PropTypes.bool,
  index: PropTypes.number,
  displayedColumns: PropTypes.array.isRequired,
};
