import React, { useState } from 'react';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Radio from '@mui/material/Radio';
import Image from 'src/components/image';
import { useSnackbar } from 'src/components/snackbar';
import axios from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { Rating, Input } from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
// ----------------------------------------------------------------------

export default function MaxWidthDialog() {
  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    Body: Yup.string(),
    // Rate: Yup.number(),
    selection: Yup.string(),
  });
  const defaultValues = {
    Body: '',
    // Rate: '',
    selection: '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    getValues,
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const dialog = useBoolean();
  const [rating, setRating] = useState(5);

  const handleRatingClick = (e) => {
    setRating(e.target.value);
  };

  const [selectedValue, setSelectedValue] = React.useState('');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const RATEELEMENTS = ['Neglectful treatment', 'Employee Behavior', 'Cleanliness', 'Price'];
  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('xs');

  const onSubmit = async (data) => {
    try {
      const selectedValues = getValues('selection');
  
      const newData = {
        ...data,
        selection: selectedValues,
      };
  
      const response = await axios.post('api/feedback', newData);
  
      if (response.status === 200) {
        enqueueSnackbar('Prescription uploaded successfully', { variant: 'success' });
        console.log('data', newData);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
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
      <Button variant="outlined" onClick={dialog.onTrue}>
        Max Width Dialog
      </Button>

      <Dialog
        open={dialog.value}
        maxWidth={maxWidth}
        onClose={dialog.onFalse}
        fullWidth={fullWidth}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              margin: '20px',
              gap: '10px',
            }}
          >
            <DialogTitle>Rate your appointment</DialogTitle>
            <Image
              src="https://cdn.altibbi.com/cdn/large/0/10/logo_1296490409_651.gif"
              sx={{ width: '60px', height: '60px', border: 1, borderRadius: '50px' }}
            />
            <Typography sx={{ color: 'black' }}>Department Name</Typography>
            <Rating size="large" precision={1} max={5} name="Rate" onClick={handleRatingClick} />
          </div>

          {rating < 5 ? (
            <DialogContent>
              <Box component="form" noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  {RATEELEMENTS.map((info, index) => (
                    <div key={index}>
                      <Box
                        sx={{
                          fontSize: { md: '15px', xs: '9px' },
                          fontWeight: { md: '400', xs: 'bolder' },
                        }}
                      >
                        <Radio {...controlProps(info)} {...register('selection')}/>
                        {info}
                      </Box>
                    </div>
                  ))}
                </div>
                <FormControl sx={{ my: 3, minWidth: '100%' }}>
                  <InputLabel htmlFor="max-width">More issues</InputLabel>
                  <Input id="max-width" {...register('Body')} />
                </FormControl>
              </Box>
            </DialogContent>
          ) : (
            <Typography sx={{ ml: 2, mb: 1, fontSize: 15 }}>
              We hope that everything was to your satisfaction
            </Typography>
          )}

          <DialogActions>
            <Button
              onClick={dialog.onFalse}
              loading={isSubmitting}
              variant="outlined"
              color="inherit"
            >
              Skip
            </Button>
            <Button type="submit" variant="contained">
              Upload
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
// , `&lsquo;`, `&#39;`, `&rsquo;
