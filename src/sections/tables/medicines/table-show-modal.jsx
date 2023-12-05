import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';

// ----------------------------------------------------------------------

export default function DetailsModal({
  title = 'Upload Files',
  open,
  onClose,
  row,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  ...other
}) {
  // const [files, setFiles] = useState([]);

  // useEffect(() => {
  //   if (!open) {
  //     setFiles([]);
  //   }
  // }, [open]);

  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );

  //     setFiles([...files, ...newFiles]);
  //   },
  //   [files]
  // );

  // const handleUpload = () => {
  //   onClose();
  //   console.info('ON UPLOAD');
  // };

  // const handleRemoveFile = (inputFile) => {
  //   const filtered = files.filter((file) => file !== inputFile);
  //   setFiles(filtered);
  // };

  // const handleRemoveAllFiles = () => {
  //   setFiles([]);
  // };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogContent dividers sx={{ p: 4, border: 'none' }}>
        <Stack spacing={2}>
          <Typography variant="h5">{row.trade_name} Details</Typography>
          <Typography variant="h6">General Info</Typography>
          <Stack spacing={1}>
            <Typography variant="p">code: {row.code}</Typography>
            <Typography variant="p">trade name: {row.trade_name}</Typography>
            <Typography variant="p">scientific_name: {row.scientific_name}</Typography>
            <Typography variant="p">country: {row.country?.name_english}</Typography>
            <Typography variant="p">concentrations: {row.concentrations}</Typography>
            <Typography variant="p">agent: {row.agent}</Typography>
            <Typography variant="p">price_1: {row.price_1}</Typography>
            <Typography variant="p">price_2: {row.price_2}</Typography>
            <Typography variant="p">ATCCODE: {row.ATCCODE}</Typography>
            <Typography variant="p">barcode: {row.barcode}</Typography>
            <Typography variant="p">packaging: {row.packaging}</Typography>
            <Typography variant="p">family: {row.family?.name_english}</Typography>
            <Typography variant="p">
              {' '}
              <Label
                variant="soft"
                color={
                  (row.status === 'active' && 'success') ||
                  (row.status === 'inactive' && 'error') ||
                  'default'
                }
              >
                {row.status}
              </Label>
            </Typography>
          </Stack>
          <Typography variant="h6">Side Effects</Typography>
          <Stack spacing={1}>
            {row.side_effects?.map((effect)=><Typography variant="p">{effect.name_english}</Typography>)}
          </Stack>
          <Typography variant="h6">Creatin Info</Typography>
          <Stack spacing={1}>
          <Typography variant="p">Creator:{row.user_creation?.first_name}</Typography>
          <Typography variant="p">Creator IP:{row.ip_address_user_creation}</Typography>
          <Typography variant="p">Modifier:{row.user_modification}</Typography>
          <Typography variant="p">Modifier IP:{row.ip_address_user_modification}</Typography>
          <Typography variant="p">Modifications No:{row.modifications_nums}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

DetailsModal.propTypes = {
  row: PropTypes.object,
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};
