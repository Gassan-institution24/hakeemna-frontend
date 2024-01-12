import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Iconify from 'src/components/iconify/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import * as Yup from 'yup';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { MenuItem, Typography, Button } from '@mui/material';
import FormProvider, { RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';

import axios from 'axios';

// ----------------------------------------------------------------------

export default function FormDialog() {
  const [files, setFiles] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const router = useRouter();
  const oldPresctiptionSchema = Yup.object().shape({
    type: Yup.string(),
    date: Yup.date(),
    file: Yup.string(),
  });

  const TYPE = ['Blod Test', 'X-ray', 'Health Check'];

  const defaultValues = {
    type: '',
    date: '',
    file: '',
  };

  const methods = useForm({
    resolver: yupResolver(oldPresctiptionSchema),
    defaultValues,
  });
  const {
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const fuser = (fuserSize) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif'];

    const isValidFile = (fileName) => {
      const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
      const isExtensionAllowed = allowedExtensions.includes(fileExtension);
      return isExtensionAllowed;
    };
    const isValidSize = (fileSize) => fileSize <= 3145728;

    return {
      validateFile: isValidFile,
      validateSize: isValidSize,
    };
  };
  // Inside the AccountGeneral component
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Validate file before setting the profile picture
    const fileValidator = fuser(file.size);

    if (fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)) {
      setFiles(file); // Save the file in state
    } else {
      // Handle invalid file type or size
      enqueueSnackbar('Invalid file type or size', { variant: 'error' });
    }
  };

  const dialog = useBoolean();

  const onSubmit = async (data) => {
    console.log('data', data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (files) {
      formData.append('prescriptions', files);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/oldDrugsPerscription', formData);

      if (response.status === 200) {
        enqueueSnackbar('Prescription uploaded successfully', { variant: 'success' });
        // router.push(paths.dashboard.user.profile);
      } else {
        throw new Error('Failed to upload prescription');
      }
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Failed to upload prescription', { variant: 'error' });
    }
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ gap: 1 }}>
        Upload Your Old Perscription
        <Iconify icon="mingcute:add-line" />
      </Button>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            IMPORTANT
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              The interpretation and evaluation of the results should not be done individually, but
              rather in the presence of a physician who is consulted on those results and taking
              into account the full medical context of the patient’s condition.
            </Typography>
            <RHFSelect
              label="type"
              fullWidth
              name="type"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1}}
            >
              {TYPE.map((test) => (
                <MenuItem value={test} key={test._id}>
                  {test}
                </MenuItem>
              ))}
            </RHFSelect>
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  sx={{ mb: 1}}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
            <RHFUpload
              autoFocus
              fullWidth
              name="file"
              margin="dense"
              variant="outlined"
              onDrop={handleDrop}
              // label="File"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              Upload
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
