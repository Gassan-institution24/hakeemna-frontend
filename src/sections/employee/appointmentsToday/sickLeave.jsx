import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import { DatePicker } from '@mui/x-date-pickers';
// import { Controller } from 'react-hook-form';
// import { RHFTextField } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';

export default function SickLeave() {
  const dialog = useBoolean();
  return (
    <>
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ mt: 1 }}>
        Add sick leave
        <Iconify icon="mingcute:add-line" />
      </Button>
      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            {/* {t('IMPORTANT')} */}IMPORTANT
          </DialogTitle>
          <DialogContent>
            {/* <Typography sx={{ mb: 5, fontSize: 14 }}>
            {curLangAr
              ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
              : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
          </Typography> */}
            {/* <Controller
            name="Medical_sick_leave_start"
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label='Date of making the medical report*'
                sx={{ mb: 2 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          /> */}
            {/* <Controller
            name="Medical_sick_leave_end"
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label='Date of making the medical report*'
                sx={{ mb: 2 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          /> */}
            {/* <RHFTextField lang="en" name="description" label='description' /> */}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={dialog.onFalse}>
              {/* {t('Cancel')} */}
              Cancel
            </Button>
            {/* loading={isSubmitting} */}
            <Button type="submit" variant="contained">
              {/* {t('Upload')} */}
              Upload
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
