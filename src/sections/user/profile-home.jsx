// import PropTypes from 'prop-types';
// import { renderToString, renderToStaticMarkup } from 'react-dom/server';

// import Chip from '@mui/material/Chip';
// import Card from '@mui/material/Card';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
// import Grid from '@mui/material/Unstable_Grid2';
// import Typography from '@mui/material/Typography';
// import ListItemText from '@mui/material/ListItemText';

// import { fDate } from 'src/utils/format-time';
// import { fCurrency } from 'src/utils/format-number';

// import Label from 'src/components/label/label';
// import Iconify from 'src/components/iconify';
// import Markdown from 'src/components/markdown';
// import { useAuthContext } from 'src/auth/hooks';

// // ----------------------------------------------------------------------

// export default function ProfileHome() {
  

//   const { user } = useAuthContext()
//   const renderContent = (
//     <Stack component={Card} spacing={3} sx={{ p: 3 }}>
//       <Typography variant="h4">
//         {user.patient.first_name} {user.patient.last_name}
//       </Typography>
//       <Typography
//         variant="h6"
//         style={{
//           position: 'absolute',
//           top: 0,
//           right: 0,
//           margin: '20px', // Optional: Add some margin to provide space from the edges
//         }}
//       >
//         {/* <Label
//           variant="soft"
//           color={
//             (status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'
//           }
//         >
//           {status}
//         </Label> */}
//       </Typography>

//       {drug_allergies.length &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Drug Allergies</Typography>
//         <Stack spacing={1}>
//           {drug_allergies?.map((drug) => (
//             <li key={drug._id}>{drug.scientific_name}</li>
//           ))}
//         </Stack>
//       </Stack>}
//       {diseases.length &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Diseases</Typography>
//         <Stack spacing={1}>
//           {diseases?.map((disease) => (
//             <li key={disease._id}>{disease.name_english}</li>
//           ))}
//         </Stack>
//       </Stack>}
//       {surgeries.length &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Surgeries</Typography>
//         <Stack spacing={1}>
//           {surgeries?.map((surgery) => (
//             <li key={surgery._id}>{surgery.name_english}</li>
//           ))}
//         </Stack>
//       </Stack>}
//       {medicines.length &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Medicines</Typography>
//         <Stack spacing={1}>
//           {medicines?.map((data) => (
//             <li key={data?.medicine._id} >{data?.medicine.trade_name}</li>
//           ))}
//         </Stack>
//       </Stack>}
//       {insurance.length &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Insurance</Typography>
//         <Stack spacing={1}>
//           {insurance?.map((company) => (
//             <li key={company._id}>{company?.name_english}</li>
//           ))}
//         </Stack>
//       </Stack>}

//       {sport_exercises &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Sport Exercises</Typography>
//         <li>{sport_exercises}</li>
//       </Stack>}
//       {eating_diet &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Eating Diet</Typography>
//         <li>{eating_diet?.name_english}</li>
//       </Stack>}
//        {alcohol_consumption &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Alcohol Consumption</Typography>
//         <li>{alcohol_consumption}</li>
//       </Stack>}
//       {smoking &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Smoking</Typography>
//         <li>{smoking}</li>
//       </Stack>}
//        {other_medication_notes &&<Stack spacing={2}>
//         <Typography style={{ fontWeight:600 }} variant="h6">Other Medication Notes</Typography>
//         <li>{other_medication_notes}</li>
//       </Stack>}
//     </Stack>
//   );

//   const renderOverview = (
//     <Stack component={Card} spacing={2} sx={{ p: 3 }}>
//       {[
//         {
//           label: 'Patient Father',
//           value: patient_father?.userName,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Gender',
//           value: gender,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Birth Place',
//           value: nationality?.name_english,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Birth Date',
//           value: fDate(birth_date),
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Identification Number',
//           value: identification_num,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Blood Type',
//           value: blood_type,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Pregnant',
//           value: pregnant ? 'Yes' : 'No',
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Height',
//           value: height,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Weight',
//           value: weight,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Marital Status',
//           value: marital_status,
//           icon: <Iconify icon="solar:calendar-date-bold" />,
//         },
//         {
//           label: 'Address',
//           value:user.patient.address,
//           icon: <Iconify icon="solar:clock-circle-bold" />,
//         },
//         // {
//         //   label: 'Email',
//         //   value: email,
//         //   icon: <Iconify icon="solar:wad-of-money-bold" />,
//         // },
//         {
//           label: 'Mobile Number',
//           value: user.patient.mobile_num1,
//           icon: <Iconify icon="carbon:skill-level-basic" />,
//         },
//         {
//           label: 'Second Mobile Number',
//           value: user.patient.mobile_num2,
//           icon: <Iconify icon="carbon:skill-level-basic" />,
//         },
//       ].map((item) => (
//         <>
//         {item.value && <Stack key={item.label} spacing={1.5}>
//           {/* {item.icon} */}
//           <ListItemText
//             primary={item.label}
//             secondary={item.value}
//             primaryTypographyProps={{
//               typography: 'body2',
//               color: 'text.secondary',
//               mb: 0.5,
//             }}
//             secondaryTypographyProps={{
//               typography: 'subtitle2',
//               color: 'text.primary',
//               component: 'span',
//             }}
//           />
//         </Stack>}
//         </>
//       ))}
//     </Stack>
//   );
//   return (
//     <Grid container spacing={3}>
//       <Grid xs={12} md={8}>
//         {renderContent}
//       </Grid>

//       <Grid xs={12} md={4}>
//         {renderOverview}
//       </Grid>
//     </Grid>
//   );
// }

