// import { useRef, useEffect, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';
// import Fab from '@mui/material/Fab';
// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import { alpha } from '@mui/material/styles';
// import InputBase from '@mui/material/InputBase';
// import Grid from '@mui/material/Unstable_Grid2';
// import CardHeader from '@mui/material/CardHeader';
// import useSWR from 'swr';

// import { fetcher, endpoints } from 'src/utils/axios';
// import { fNumber } from 'src/utils/format-number';

// import { _socials } from 'src/_mock';

// import Iconify from 'src/components/iconify';

// import { useGetUser } from 'src/api/user';


// import ProfilePostItem from './profile-post-item';

// // ----------------------------------------------------------------------

// export default function ProfileHome({ info, posts }) {
//   const fileRef = useRef(null);
//   const { data } = useGetUser();

//   const handleAttach = () => {
//     if (fileRef.current) {
//       fileRef.current.click();
//     }
//   };

//   const renderAbout = (
//     <>
//       {' '}
//       <Card>
//         <CardHeader title="About" />
//         <Stack spacing={2} sx={{ p: 3 }}>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           name : {data.first_name} {data.second_name}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           gender : {data.gender}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           height : {data.height}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           weight :   {data.weight}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           blood_type :  {data.blood_type}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           marital_status :  {data.marital_status}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           address : {data.address}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           phone : {data.mobile_num1}
//           </Stack>
//           <Stack direction="row" sx={{ typography: 'body2' }}>
//           mobile : {data.mobile_num2}
//           </Stack>
//         </Stack>
//       </Card>
//     </>
//   );

//   // const renderPostInput = (
//   //   <Card sx={{ p: 3 }}>
//   //     <InputBase
//   //       multiline
//   //       fullWidth
//   //       rows={4}
//   //       placeholder="Share what you are thinking here..."
//   //       sx={{
//   //         p: 2,
//   //         mb: 3,
//   //         borderRadius: 1,
//   //         border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
//   //       }}
//   //     />

//   //     <Stack direction="row" alignItems="center" justifyContent="space-between">
//   //       <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
//   //         <Fab size="small" color="inherit" variant="softExtended" onClick={handleAttach}>
//   //           <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
//   //           Image/Video
//   //         </Fab>

//   //         <Fab size="small" color="inherit" variant="softExtended">
//   //           <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
//   //           Streaming
//   //         </Fab>
//   //       </Stack>

//   //       <Button variant="contained">Post</Button>
//   //     </Stack>

//   //     <input ref={fileRef} type="file" style={{ display: 'none' }} />
//   //   </Card>
//   // );

//   return (
//     <Grid container spacing={3}>
//       <Grid xs={12} md={4}>
//         <Stack spacing={3}>{renderAbout}</Stack>
//       </Grid>

//       <Grid xs={12} md={8}>
//         <Stack spacing={3}>
//           {/* {renderPostInput} */}

    
//             <ProfilePostItem/>
       
//         </Stack>
//       </Grid>
//     </Grid>
//   );
// }

// ProfileHome.propTypes = {
//   info: PropTypes.object,
//   posts: PropTypes.array,
// };
