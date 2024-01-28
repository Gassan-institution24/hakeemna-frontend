import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Iconify from 'src/components/iconify';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'src/utils/axios';
import { paths } from 'src/routes/paths';
import { _mock } from 'src/_mock';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function Oldpatientsdata() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [oldpatientsdata, setOldpatientsdata] = useState([]);
  const [oldData, setOlddata] = useState();
  console.log(oldData, 'sdsdsdsdsdsdsd');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/oldpatientsdata/details', {
          identification_num: user?.patient?.identification_num,
        });
        setOldpatientsdata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user?.patient?.identification_num]);

  useEffect(() => {
    const mappedData = oldpatientsdata.map((Data) => Data);
    setOlddata(mappedData);
  }, [oldpatientsdata]);

  return (
    <>
      {user.patient.identification_num ? (
        <>
          <Box
            sx={{
              py: 5,
              bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
              
            }}
          >
            <Container sx={{display:{md:'grid', xs:'inline-flex'} }}>
              <CustomBreadcrumbs
           
                heading="Please confirm your data"
                links={[{ name: 'Home', href: paths.dashboard.root }, { name: 'Confirming Data' }]}
              />
              <Box sx={{ display: 'block' }}>
                <Typography sx={{ mb: 1, padding: 1, fontSize: { md: 16, xs: 14 } }}>
                  Click{' '}
                  <Button
                    variant="contained"
                    sx={{ border: 1, height: { md: '25px', xs: '20px' }, bgcolor: 'success.main' }}
                  >
                    Yes
                  </Button>{' '}
                  if this is your data{' '}
                </Typography>
                <Typography sx={{ mb: 1, padding: 1, fontSize: { md: 16, xs: 14 } }}>
                  Click{' '}
                  <Button
                    variant="contained"
                    sx={{ border: 1, height: { md: '25px', xs: '20px' } }}
                  >
                    No
                  </Button>{' '}
                  if not{' '}
                </Typography>
              </Box>
            </Container>
          </Box>

          <Container sx={{ my: 7, }}>
            <Stack spacing={5}>
              <ComponentBlock>
                {oldData?.map((info) => (
                  <Box sx={{display:'block', position:'absolute', left: '28%'}}>
                    <Typography sx={{padding:'10px'}}> <span style={{border:'1px dashed black', padding:7, backgroundColor:'gray', color:'white'}}>first_name</span> &#160; &#160; {info.first_name}</Typography>
                    <Typography sx={{padding:'10px'}}> <span style={{border:'1px dashed black', padding:7, backgroundColor:'gray', color:'white'}}>last_name</span>&#160; &#160; {info.last_name}</Typography>
                    <Typography sx={{padding:'10px'}}> <span style={{border:'1px dashed black', padding:7, backgroundColor:'gray', color:'white'}}>Middle_name</span> &#160; &#160;{info.Middle_name}</Typography>
                    <Typography sx={{padding:'10px'}}> <span style={{border:'1px dashed black', padding:7, backgroundColor:'gray', color:'white'}}>identification_num</span> &#160; &#160;{info.identification_num}</Typography>
                  </Box>
                ))}
              </ComponentBlock>
            </Stack>
          </Container>
        </>
      ) : (
        "Sorry we couldn't find your data"
      )}
    </>
  );
}
