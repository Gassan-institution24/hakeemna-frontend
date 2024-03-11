// import * as Yup from 'yup';
// import { useMemo } from 'react';
// import PropTypes from 'prop-types';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

// import Box from '@mui/material/Box';
// import Alert from '@mui/material/Alert';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import MenuItem from '@mui/material/MenuItem';
// import LoadingButton from '@mui/lab/LoadingButton';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';

// import { countries } from 'src/assets/data';
// // import { USER_STATUS_OPTIONS } from 'src/_mock';

// import Iconify from 'src/components/iconify';
// import { useSnackbar } from 'src/components/snackbar';
// import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// // ----------------------------------------------------------------------

// export default function UserQuickEditForm({ currentUser, open, onClose }) {
//   const { enqueueSnackbar } = useSnackbar();

//   const NewUserSchema = Yup.object().shape({
//     name: Yup.string().required('Name is required'),
//     email: Yup.string().required('Email is required').email('Email must be a valid email address'),
//     phoneNumber: Yup.string().required('Phone number is required'),
//     address: Yup.string().required('Address is required'),
//     country: Yup.string().required('Country is required'),
//     company: Yup.string().required('Company is required'),
//     state: Yup.string().required('State is required'),
//     city: Yup.string().required('City is required'),
//     role: Yup.string().required('Role is required'),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       name: currentUser?.name || '',
//       email: currentUser?.email || '',
//       phoneNumber: currentUser?.phoneNumber || '',
//       address: currentUser?.address || '',
//       country: currentUser?.country || '',
//       state: currentUser?.state || '',
//       city: currentUser?.city || '',
//       zipCode: currentUser?.zipCode || '',
//       status: currentUser?.status,
//       company: currentUser?.company || '',
//       role: currentUser?.role || '',
//     }),
//     [currentUser]
//   );

//   const methods = useForm({
// mode: 'onTouched',
//     resolver: yupResolver(NewUserSchema),
//     defaultValues,
//   });
//   const handleArabicInputChange = (event) => {
//     // Validate the input based on Arabic language rules
//     const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

//     if (arabicRegex.test(event.target.value)) {
//       methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
//     }
//   };

//   const handleEnglishInputChange = (event) => {
//     // Validate the input based on English language rules
//     const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

//     if (englishRegex.test(event.target.value)) {
//       methods.setValue(event.target.name, event.target.value, { shouldValidate: true });
//     }
//   };

//   const {
//     reset,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       reset();
//       onClose();
//       enqueueSnackbar(t('updated successfully!'));
//
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   return (
//     <Dialog
//       fullWidth
//       maxWidth={false}
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: { maxWidth: 720 },
//       }}
//     >
//       <FormProvider methods={methods} onSubmit={onSubmit}>
//         <DialogTitle>Quick Update</DialogTitle>

//         <DialogContent>
//           <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
//             Account is waiting for confirmation
//           </Alert>

//           <Box
//             rowGap={3}
//             columnGap={2}
//             display="grid"
//             gridTemplateColumns={{
//               xs: 'repeat(1, 1fr)',
//               sm: 'repeat(2, 1fr)',
//             }}
//           >
//             <RHFSelect name="status" label="Status">
//               {USER_STATUS_OPTIONS.map((status, idx)  => (
//                 <MenuItem key={idx} value={status.value}>
//                   {status.label}
//                 </MenuItem>
//               ))}
//             </RHFSelect>

//             <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

//             <RHFTextField name="name" label="Full Name" />
//             <RHFTextField name="email" label="Email Address" />
//             <RHFTextField name="phoneNumber" label="Phone Number" />

//             <RHFAutocomplete
//               name="country"
//               label={t("country")}
//               options={countries.map((country, idx)  => country.label)}
//               getOptionLabel={(option) => option}
//               renderOption={(props, option) => {
//                 const { code, label, phone } = countries.filter(
//                   (country) => country.label === option
//                 )[0];

//                 if (!label) {
//                   return null;
//                 }

//                 return (
//                   <li {...props} key={idx}>
//                     <Iconify
//                       key={idx}
//                       icon={`circle-flags:${code.toLowerCase()}`}
//                       width={28}
//                       sx={{ mr: 1 }}
//                     />
//                     {label} ({code}) +{phone}
//                   </li>
//                 );
//               }}
//             />

//             <RHFTextField name="state" label="State/Region" />
//             <RHFTextField name="city" label="City" />
//             <RHFTextField name="address" label="Address" />
//             <RHFTextField name="zipCode" label="Zip/Code" />
//             <RHFTextField name="company" label="Company" />
//             <RHFTextField name="role" label="Role" />
//           </Box>
//         </DialogContent>

//         <DialogActions>
//           <Button variant="outlined" onClick={onClose}>
//             Cancel
//           </Button>

//           <LoadingButton type="submit" tabIndex={-1} variant="contained" loading={isSubmitting}>
//             Update
//           </LoadingButton>
//         </DialogActions>
//       </FormProvider>
//     </Dialog>
//   );
// }

// UserQuickEditForm.propTypes = {
//   currentUser: PropTypes.object,
//   onClose: PropTypes.func,
//   open: PropTypes.bool,
// };
