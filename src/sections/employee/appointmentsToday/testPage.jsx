import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Dialog, Checkbox, DialogActions, DialogContent } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

// defaultChecked
export default function TestPage() {
  const onSubmit = async (submitdata) => {
    try {
      await axiosInstance.post('/api/generlaCL', submitdata);
      enqueueSnackbar('new question created successfully', { variant: 'success' });
      dialog.onFalse();
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };
  const questionSchema = Yup.object().shape({
    question_arabic: Yup.string(),
    question_english: Yup.string(),
  });
  const defaultValues = {
    question_arabic: '',
    question_english: '',
  };

  const dialog = useBoolean();
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(questionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  return (
    <>
      <FormControlLabel label="Diabetes" control={<Checkbox size="small" />} />
      <br />
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ mt: 1 }}>
        Edit Check list
        <Iconify icon="ic:outline-edit-note" sx={{ ml: 0.5 }} />
      </Button>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <br />
            <br />
            <RHFTextField lang="ar" name="question_arabic" label="question_arabic" />
            <br />
            <br />
            <RHFTextField lang="en" name="question_english" label="question_english" />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={dialog.onFalse}>
              {/* {t('Cancel')} */}Cancel
            </Button>

            <Button type="submit" variant="contained" loading={isSubmitting}>
              {/* {t('Upload')} */}Upload
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
