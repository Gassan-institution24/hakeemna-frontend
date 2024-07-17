// import * as Yup from 'yup';
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';

// import { Box, Stack } from '@mui/system';
// import { useParams } from 'src/routes/hooks';
// import { fDateTime, fDateAndTime } from 'src/utils/format-time';
// import { useLocales, useTranslate } from 'src/locales';
// import { useGePrescription, useGetMedicines } from 'src/api';

// import Iconify from 'src/components/iconify/iconify';
// import {
//   Card,
//   Button,
//   Dialog,
//   Checkbox,
//   MenuItem,
//   Typography,
//   DialogTitle,
//   DialogActions,
//   DialogContent,
// } from '@mui/material';
// import FormProvider, { RHFSelect, RHFTextField, RHFUpload } from 'src/components/hook-form';
// import { DatePicker } from '@mui/x-date-pickers';
// import { Controller, useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useBoolean } from 'src/hooks/use-boolean';
// import axiosInstance from 'src/utils/axios';
// import { enqueueSnackbar } from 'notistack';

// export default function MdicalreportPage() {
//   const { t } = useTranslate();
//   const { currentLang } = useLocales();
//   const curLangAr = currentLang.value === 'ar';
//   const { id } = useParams();
//   const { prescriptionData, refetch } = useGePrescription(id);
//   const { medicinesData } = useGetMedicines();
//   const [DoctorComment, setDoctorComment] = useState('');
//   const medicalReportDialog = useBoolean();

//   const [chronic, setChronic] = useState(false);
//   const navigate = useNavigate();

//   const medicalReportSchema = Yup.object().shape({
//     employee: Yup.string(),
//     patient: Yup.string(),
//     Start_time: Yup.date(),
//     End_time: Yup.date(),
//     file: Yup.array(),
//     Frequency_per_day: Yup.string(),
//     entrance_mangament: Yup.string(),
//     description: Yup.string(),
//     department: Yup.string(),
//     Drugs_report: Yup.string(),
//     medical_report: Yup.string(),
//     Medical_sick_leave_start: Yup.date(),
//     Medical_sick_leave_end: Yup.date(),
//   });

//   const defaultValues = {
//     medicines: '',
//     Frequency_per_day: '',
//     Num_days: '',
//     Start_time: null,
//     End_time: null,
//     Doctor_Comments: '',
//     chronic: false,
//   };

//   const methods = useForm({
//     mode: 'onTouched',
//     resolver: yupResolver(medicalReportSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     handleSubmit,
//     control,
//     watch,
//     setValue,
//     formState: { isSubmitting },
//   } = methods;

//   useEffect(() => {
//     if (prescriptionData) {
//       setChronic(prescriptionData.chronic);
//       setDoctorComment(prescriptionData.Doctor_Comments || '');
//       reset({
//         medicines: prescriptionData.medicines?._id || '',
//         Frequency_per_day: prescriptionData.Frequency_per_day || '',
//         Num_days: prescriptionData.Num_days || '',
//         Start_time: prescriptionData.Start_time ? new Date(prescriptionData.Start_time) : null,
//         End_time: prescriptionData.End_time ? new Date(prescriptionData.End_time) : null,
//         Doctor_Comments: prescriptionData.Doctor_Comments || '',
//         chronic: prescriptionData.chronic,
//       });
//     }
//   }, [prescriptionData, reset]);
 
//   const onSubmit = async (submitdata) => {
//     try {
//       submitdata.chronic = chronic;
//       submitdata.Doctor_Comments = DoctorComment;
//       await axiosInstance.patch(`/api/drugs/${id}`, submitdata);

//       enqueueSnackbar('Prescription updated successfully', { variant: 'success' });
//       navigate(-1);

//       refetch();
//       reset();
//     } catch (error) {
//       console.error(error.message);
//       enqueueSnackbar('Error uploading data', { variant: 'error' });
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//       >
//         <Stack
//           component={Card}
//           sx={{
//             p: 3,
//             width: '80%',
//             display: 'grid',
//             gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },
//           }}
//         >
//           <Box>
//             <Typography variant="h3">{prescriptionData?.patient?.name_english}</Typography>
//             <Typography sx={{ fontWeight: 600, p: 2 }}>
//               {t('Date')}:&nbsp; &nbsp;
//               <span style={{ color: 'gray', fontWeight: 400 }}>
//                 {fDateTime(prescriptionData?.created_at)}
//               </span>
//             </Typography>
//             <Typography sx={{ fontWeight: 600, p: 2 }}>
//               {t('Dr.')}&nbsp;
//               <span style={{ color: 'gray', fontWeight: 400 }}>
//                 {prescriptionData?.employee?.name_english}
//               </span>{' '}
//               &nbsp; added a new prescription
//             </Typography>
//             <Typography sx={{ fontWeight: 600, p: 2 }}>
//               {t('note')}:&nbsp;&nbsp;
//               <span style={{ color: 'gray', fontWeight: 400 }}>
//                 {prescriptionData?.Doctor_Comments}
//               </span>{' '}
//             </Typography>
//             <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
//               <Iconify icon="icon-park:back" />
//               &nbsp; {t('Back')}
//             </Button>
//           </Box>
//           <Box>
//             <Typography variant="h3">{prescriptionData?.medicines?.trade_name}</Typography>
//             <Typography sx={{ fontWeight: 600, p: 2 }}>
//               {t('Date')}:&nbsp; &nbsp;
//               <span style={{ color: 'gray', fontWeight: 400 }}>
//                 {fDateTime(prescriptionData?.created_at)}
//               </span>
//             </Typography>
//             <Typography sx={{ fontWeight: 600, p: 2 }}>
//               {t('Frequency')}:&nbsp; &nbsp;
//               <span style={{ color: 'gray', fontWeight: 400 }}>
//                 {prescriptionData?.Frequency_per_day}
//               </span>
//             </Typography>
//             {prescriptionData?.chronic ? (
//               <Typography sx={{ fontWeight: 600, p: 2 }}>{t('Chronic: Yes')}</Typography>
//             ) : (
//               <Typography sx={{ fontWeight: 600, p: 2 }}>
//                 {t('Duration')}:&nbsp;&nbsp;
//                 {prescriptionData?.Start_time && prescriptionData?.End_time ? (
//                   <>
//                     From {fDateAndTime(prescriptionData?.Start_time)} To{' '}
//                     {fDateAndTime(prescriptionData?.End_time)}
//                     <span style={{ color: '#2F88FF', fontWeight: 500 }}>
//                       &nbsp;{prescriptionData?.Num_days} day/s
//                     </span>
//                   </>
//                 ) : (
//                   `${prescriptionData?.Num_days} day/s`
//                 )}
//               </Typography>
//             )}

//             <Button variant="outlined" sx={{ mt: 2 }} onClick={medicalReportDialog.onTrue}>
//               <Iconify icon="icon-park:edit-two" />
//               &nbsp; {t('Update')}
//             </Button>
//           </Box>
//         </Stack>
//       </Box>

//        <Dialog open={medicalReportDialog.value} onClose={medicalReportDialog.onFalse}>
//         <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//           <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
//             {t('IMPORTANT')}
//           </DialogTitle>
//           <DialogContent>
//             <Typography sx={{ mb: 5, fontSize: 14 }}>
//               {curLangAr
//                 ? 'لا ينبغي أن يتم تفسير النتائج وتقييمها بشكل فردي، بل بحضور الطبيب الذي يتم استشارته بشأن تلك النتائج مع مراعاة السياق الطبي الكامل لحالة المريض'
//                 : 'The interpretation and evaluation of the results should not be done individually, but rather in the presence of a physician who is consulted on those results and taking into account the full medical context of the patient’s condition.'}
//             </Typography>
//             <RHFTextField
//               lang="en"
//               multiline
//               name="description"
//               label={t('description')}
//               sx={{ mb: 2 }}
//             />
//             <RHFUpload
//               autoFocus
//               fullWidth
//               name="file"
//               margin="dense"
//               sx={{ mb: 2 }}
//               variant="outlined"
//               onDrop={handleDrop}
//               multiple
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button variant="outlined" color="inherit" onClick={medicalReportDialog.onFalse}>
//               {t('Cancel')}
//             </Button>
//             <Button type="submit" loading={isSubmitting} variant="contained">
//               {t('Upload')}
//             </Button>
//           </DialogActions>
//         </FormProvider>
//       </Dialog>
//     </>
//   );
// }
