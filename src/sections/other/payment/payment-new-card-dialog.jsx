import { useState } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { useSnackbar } from 'notistack';
import axiosHandler from 'src/utils/axios-handler';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';

export default function PaymentNewCardDialog({ onClose, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const popover = usePopover();
  const [card, setCard] = useState({
    cardno: '',
    expirydt: '',
  });

  const onChangeExp = (e) => {
    const { value } = e.target;
    const formattedExpDate = expriy_format(value); 
    setCard({
      ...card,
      expirydt: value, 
    });
    methods.setValue('expiration_date', formattedExpDate); 
  };

  const expriy_format = (value) => {
    const expdate = value;
    const expDateFormatter =
      expdate.replace(/\//g, '').substring(0, 2) +
      (expdate.length > 2 ? '/' : '') +
      expdate.replace(/\//g, '').substring(2, 4);

    return expDateFormatter;
  };

  const PaymentSchema = Yup.object().shape({
    identification_num: Yup.number().required('identification number is required'),
    card_holder: Yup.string().required('card holder is required'),
    cvv_cvc: Yup.number().required('cvv_cvc is required'),
    expiration_date: Yup.string().required('expiration date is required'),
  });

  const defaultValues = {
    identification_num: '',
    card_holder: '',
    cvv_cvc: '',
    expiration_date: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("data",data)
      const newData = {...data,'expiration_date':expriy_date_format(data.expiration_date)}
      console.log("data",newData)
      const response = await axiosHandler({
        method: 'POST',
        path: `/api/paymentmethods`,
        data:newData,
      });
      if (response) {
        console.log(response);
        enqueueSnackbar('Your message sent successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Something went wrong, please try again later', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong, please try again later', { variant: 'error' });
    }
  });



  const expriy_date_format = (value) => {
    const [month, year] = value.split('/'); // Splitting month and year
    const currentYear = new Date().getFullYear(); // Getting the current year
    const formattedYear = `20${year}`; // Assuming the year is in the 21st century

    // Creating a string in the format 'YYYY-MM-DD' for a proper Date object
    const formattedDate = `${formattedYear}-${month}-01`;
    const result = new Date(formattedDate)
    return result;
  };

  return (
    <>
      <Dialog maxWidth="sm" onClose={onClose} {...other}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle> New Card </DialogTitle>

          <DialogContent sx={{ overflow: 'unset' }}>
            <Stack spacing={2.5}>
              <TextField
                autoFocus
                label="Card Number"
                placeholder="XXXX XXXX XXXX XXXX"
                InputLabelProps={{ shrink: true }}
                {...methods.register('identification_num')}
              />

              <TextField
                label="Card Holder"
                placeholder="JOHN DOE"
                InputLabelProps={{ shrink: true }}
                {...methods.register('card_holder')}
              />

              <Stack spacing={2} direction="row">
                <TextField
                  label="CVV/CVC"
                  placeholder="***"
                  InputLabelProps={{ shrink: true }}
                  {...methods.register('cvv_cvc')}
                />

                <TextField
                  label="Expiration Date"
                  placeholder="MM/YY"
                  InputLabelProps={{ shrink: true }}
                  {...methods.register('expiration_date')}
                  onChange={onChangeExp}
                  value={expriy_format(card.expirydt)}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                Your transaction is secured with SSL encryption
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button variant="contained" type="submit">
              Add
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: 'body2', textAlign: 'center' }}
      >
        Three-digit number on the back of your VISA card
      </CustomPopover> 
    </>
  );
}

PaymentNewCardDialog.propTypes = {
  onClose: PropTypes.func,
};
