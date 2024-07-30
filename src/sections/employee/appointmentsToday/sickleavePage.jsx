import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import { useGetOneSickLeaves } from 'src/api/sickleave';

export default function MdicalreportPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { data, refetch } = useGetOneSickLeaves(id);
  const medicalReportDialog = useBoolean();
  const navigate = useNavigate();
  const medicalReportSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    entrance_mangament: Yup.string(),
    description: Yup.string().required(t('Description is required')),
  });
  const defaultValues = {
    description: '',
  };
  console.log(data, 'data');
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(medicalReportSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const values = watch();

  const onSubmit = async (submitdata) => {
    try {
      await axiosInstance.patch(`/api/sickleave/${id}`, submitdata);

      enqueueSnackbar('Prescription updated successfully', { variant: 'success' });
      navigate(-1);
      refetch();
      reset();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error updating data', { variant: 'error' });
    }
  };

  return (
    // <>
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}
    //   >
    //     <Stack
    //       component={Card}
    //       sx={{
    //         p: 3,
    //         width: '80%',
    //         display: 'grid',
    //         gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },
    //       }}
    //     >
    //       <Box>
    //         <Typography variant="h3">{data?.patient?.name_english}</Typography>
    //         <Typography sx={{ fontWeight: 600, p: 2 }}>
    //           {t('Date')}:&nbsp; &nbsp;
    //           <span style={{ color: 'gray', fontWeight: 400 }}>{fDateTime(data?.created_at)}</span>
    //         </Typography>
    //         <Typography sx={{ fontWeight: 600, p: 2 }}>
    //           {t('Dr.')}&nbsp;
    //           <span style={{ color: 'gray', fontWeight: 400 }}>
    //             {data?.employee?.name_english}
    //           </span>{' '}
    //           &nbsp; added sick leave
    //         </Typography>
    //         <Typography sx={{ fontWeight: 600, p: 2 }}>
    //           {t('description')}:&nbsp;&nbsp;
    //           <span style={{ color: 'gray', fontWeight: 400 }}>{data?.description}</span>{' '}
    //         </Typography>
    //         <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
    //           <Iconify icon="icon-park:back" />
    //           &nbsp; {t('Back')}
    //         </Button>
    //       </Box>
    //       <Box>
    //         <Button variant="outlined" sx={{ mt: 2 }} onClick={medicalReportDialog.onTrue}>
    //           <Iconify icon="icon-park:edit-two" />
    //           &nbsp; {t('Update')}
    //         </Button>
    //       </Box>
    //     </Stack>
    //   </Box>

    //   <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
    //     <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    //       <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
    //         {t('IMPORTANT')}
    //       </DialogTitle>
    //       <DialogContent>
    //         <Typography sx={{ mb: 5, fontSize: 14 }}>
    //           {curLangAr
    //             ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
    //             : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
    //         </Typography>
    //         <RHFTextField
    //           lang="en"
    //           multiline
    //           name="description"
    //           label={t('description')}
    //           sx={{ mb: 2 }}
    //         />
    //         <Controller
    //           name="Start_time"
    //           control={control}
    //           render={({ field, fieldState: { error } }) => (
    //             <DatePicker
    //               {...field}
    //               label={t('Start time*')}
    //               sx={{ mb: 2 }}
    //               slotProps={{
    //                 textField: {
    //                   fullWidth: true,
    //                   error: !!error,
    //                   helperText: error?.message,
    //                 },
    //               }}
    //             />
    //           )}
    //         />
    //         <Controller
    //           name="End_time"
    //           control={control}
    //           render={({ field, fieldState: { error } }) => (
    //             <DatePicker
    //               {...field}
    //               label={t('End time*')}
    //               sx={{ mb: 2 }}
    //               slotProps={{
    //                 textField: {
    //                   fullWidth: true,
    //                   error: !!error,
    //                   helperText: error?.message,
    //                 },
    //               }}
    //             />
    //           )}
    //         />
    //       </DialogContent>
    //       <DialogActions>
    //         <Button variant="outlined" color="inherit" onClick={medicalReportDialog.onFalse}>
    //           {t('Cancel')}
    //         </Button>
    //         <Button type="submit" loading={isSubmitting} variant="contained">
    //           {t('Upload')}
    //         </Button>
    //       </DialogActions>
    //     </FormProvider>
    //   </Dialog>
    // </>
    <>soon</>
  );
}
