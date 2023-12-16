// import * as Yup from 'yup';
// import { useCallback,useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// // import Button from '@mui/material/Button';
// import Grid from '@mui/material/Unstable_Grid2';
// // import Typography from '@mui/material/Typography';
// import LoadingButton from '@mui/lab/LoadingButton';

// // import { useMockedUser } from 'src/hooks/use-mocked-user';

// // import { fData } from 'src/utils/format-number';

// import Iconify from 'src/components/iconify';
// import { useSnackbar } from 'src/components/snackbar';
// import { MenuItem } from '@mui/material';

// import FormProvider, {
//   // RHFSwitch,
//   RHFTextField,
//   // RHFUploadAvatar,
//   RHFSelect,
//   RHFAutocomplete,
// } from 'src/components/hook-form';
// import { useGetCountries, useGetUser } from 'src/api/user';
// import { useGetCities } from 'src/api/tables';
// import axiosHandler from 'src/utils/axios-handler';
// // ----------------------------------------------------------------------

// export default function AccountGeneral() {
//   const { enqueueSnackbar } = useSnackbar();
//   const [error, setError] = useState();
//   const {countries} = useGetCountries()
//   const {tableData} = useGetCities();
//   const {data} = useGetUser();

//   const UpdateUserSchema = Yup.object().shape({
//     first_name: Yup.string(),
//     family_name: Yup.string(),
//     email: Yup.string(),
//     mobile_num1: Yup.number(),
//     nationality: Yup.string().nullable(),
//     // photoURL: Yup.mixed().nullable(),
//     // address: Yup.string().required('Address is required'),
//     // state: Yup.string().required('State is required'),
//     // city: Yup.string().required('City is required'),
//     // zipCode: Yup.string().required('Zip code is required'),
//     // about: Yup.string().required('About is required'),
//     // not required
//     // isPublic: Yup.boolean(),
//   });

//   const defaultValues = {
//     first_name: data?.first_name || '',
//     family_name: data?.family_name || '',
//     email: data?.email || '',
//     mobile_num1: data?.mobile_num1 || '',
//     // photoURL: data?.photoURL || null,
//     nationality: data?.nationality._id || null,
//     // address: data?.address || '',
//     // state: data?.state || '',
//     // city: data?.city || '',
//     // zipCode: data?.zipCode || '',
//     // about: data?.about || '',
//     // isPublic: data?.isPublic || false,
//   };

//   const methods = useForm({
//     resolver: yupResolver(UpdateUserSchema),
//     defaultValues,
//   });

//   const {
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

  






//   const onSubmit = handleSubmit(async (info) => {
//     try {
//       const response = await axiosHandler({
//         setError,
//         method: 'PATCH',
//         path: `/api/patient/656af6ccac70bc1aa4120dad`,
//         data : info,
//       });
  
//       // Handle the response accordingly
//       if (response) {
//         enqueueSnackbar('Profile updated successfully', { variant: 'success' });
//         // Optionally, you can update the local state or perform additional actions upon successful update
//         console.log(response);
//       }
//     } catch (err) {
//       setError(err.message);
//       enqueueSnackbar('Failed to update profile', { variant: 'error' });
//       console.log(err.message);
//     }
//   });

//   // const handleDrop = useCallback(
//   //   (acceptedFiles) => {
//   //     const file = acceptedFiles[0];

//   //     const newFile = Object.assign(file, {
//   //       preview: URL.createObjectURL(file),
//   //     });

//   //     if (file) {
//   //       setValue('photoURL', newFile, { shouldValidate: true });
//   //     }
//   //   },
//   //   [setValue]
//   // );

//   return (
//     <FormProvider methods={methods} onSubmit={onSubmit}>
//       <Grid container spacing={3}>
//         <Grid xs={12} md={4}>
//           {/* <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
//             <RHFUploadAvatar
//               name="photoURL"
//               maxSize={3145728}
//               onDrop={handleDrop}
//               helperText={
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     mt: 3,
//                     mx: 'auto',
//                     display: 'block',
//                     textAlign: 'center',
//                     color: 'text.disabled',
//                   }}
//                 >
//                   Allowed *.jpeg, *.jpg, *.png, *.gif
//                   <br /> max size of {fData(3145728)}
//                 </Typography>
//               }
//             />

//             <RHFSwitch
//               name="isPublic"
//               labelPlacement="start"
//               label="Public Profile"
//               sx={{ mt: 5 }}
//             />

//             <Button variant="soft" color="error" sx={{ mt: 3 }}>
//               Delete User
//             </Button>
//           </Card> */}
//         </Grid>

//         <Grid xs={12} md={8}>
//           <Card sx={{ p: 3 }}>
//             <Box
//               rowGap={3}
//               columnGap={2}
//               display="grid"
//               gridTemplateColumns={{
//                 xs: 'repeat(1, 1fr)',
//                 sm: 'repeat(2, 1fr)',
//               }}
//             >
//               <RHFTextField name="first_name" label="First Name" />
//               <RHFTextField name="family_name" label="Last Name" />
//               <RHFTextField name="email" label="Email Address" />
//               <RHFTextField name="mobile_num1" label="Phone Number" />
//               {/* <RHFTextField name="address" label="Address" /> */}



//               <RHFSelect
//                 label="nationality"
//                 fullWidth
//                 name="nationality"
//                 InputLabelProps={{ shrink: true }}
//                 PaperPropsSx={{ textTransform: 'capitalize' }}
//               >
//                 {countries.map((option) => (
//                   <MenuItem key={option._id} value={option._id}>
//                     {option.name_english}
//                   </MenuItem>
//                 ))}
//               </RHFSelect>
               
             

//               {/* <RHFTextField name="state" name_english="State/Region" /> */}
//               {/* <RHFTextField name="city" name_english="City" /> */}
//               {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
//             </Box>

//             <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
//               {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}
//               <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
//                 Save Changes
//               </LoadingButton>
//             </Stack>
//           </Card>
//         </Grid>
//       </Grid>
//     </FormProvider>
//   );
// }
