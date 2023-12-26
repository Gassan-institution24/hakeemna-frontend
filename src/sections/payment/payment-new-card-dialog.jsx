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
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PaymentNewCardDialog({ onClose, ...other }) {
  const popover = usePopover();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const [card, setCard] = useState({
    cardno: "",
    cardtype: "far fa-credit-card",
    expirydt: ""
  });
  const onChangeExp = (e) => {
    setCard({
      ...card,
      expirydt: e.target.value
    });
  };
  const newCard = useBoolean();
  const { setError } = useForm();
  const expriy_format = (value) => {
    const expdate = value;
    const expDateFormatter =
      expdate.replace(/\//g, "").substring(0, 2) +
      (expdate.length > 2 ? "/" : "") +
      expdate.replace(/\//g, "").substring(2, 4);

    return expDateFormatter;
  };
  const PaymentSchema = Yup.object().shape({
    identification_num: Yup.number().required('identification number is required'),
    // card_holder: Yup.string().required('card holder is required'),
    cvv_cvc: Yup.number().required('cvv_cvc is required'),
    // expiration_date: Yup.date().required('expiration date is required'),
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
    console.log('heeloo from submit');
    try {
      console.log('data', data);
      const response = await axiosHandler({
        setError,
        method: 'POST',
        path: `/api/paymentmethods`,
        data,
      });
      if (response) {
        console.log(response)
        enqueueSnackbar('Your message sent successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Something went wrong, please try again later', { variant: 'error' });
      }
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      enqueueSnackbar('Something went wrong, please try again later', { variant: 'error' });
    }
  });
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
                {...methods.register('card_holder ')}
              />

              <Stack spacing={2} direction="row">
                {/* <TextField
                  label="Expiration Date"
                  placeholder="MM/YY"
                  InputLabelProps={{ shrink: true }}
                  {...methods.register('expiration_date ')}
                /> */}
                  <input
                  type="text"
                  name="expiration_date"
                  className="cardetails-input"
                  placeholder="mm / yy"
                  onChange={onChangeExp}
                  value={expriy_format(card.expirydt)}
                />
                <TextField
                  label="CVV/CVC"
                  placeholder="***"
                  InputLabelProps={{ shrink: true }}
                  {...methods.register('cvv_cvc')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" edge="end" onClick={popover.onOpen}>
                          <Iconify icon="eva:data-outline" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                sx={{ typography: 'caption', color: 'text.disabled' }}
              >
                <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} />
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
