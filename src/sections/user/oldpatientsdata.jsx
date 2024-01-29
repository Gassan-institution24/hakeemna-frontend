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
          identification_num: user.patient.identification_num,
        });
        setOldpatientsdata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user.patient.identification_num]);

  useEffect(() => {
    const mappedData = oldpatientsdata.map((Data) => Data);
    setOlddata(mappedData);
  }, [oldpatientsdata]);

  return (
    <>
      {user.patient?.identification_num ? (
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

          {oldData && (
            <div>
              {oldData.map((item, index) => (
                <Stack
                  component={Card}
                  spacing={1}
                  sx={{ p: 3, mt: 5, width: { md: '90%', xs: '100%' } }}
                  key={index}
                >
                  <Stack
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' },

                      p: 1,
                      ml: 1,
                      mt: 1,
                    }}
                  >
                    {item?.drug_allergies.length > 0 && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="guidance:no-drug-or-substance"
                          />{' '}
                          Drug Allergies{' '}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.drug_allergies?.map((drug) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={drug?._id}
                            >
                              -&nbsp; {drug.trade_name}
                            </li>
                          ))}
                        </Stack>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}
                    {item?.diseases.length > 0 && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="ph:virus"
                          />{' '}
                          Diseases{' '}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.diseases?.map((disease) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={disease._id}
                            >
                              {' '}
                              -&nbsp; {disease.name_english}
                            </li>
                          ))}
                        </Stack>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}

                    {item?.surgeries.length > 0 && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="guidance:surgery"
                          />{' '}
                          Surgeries{' '}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.surgeries.map((surgery) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={surgery._id}
                            >
                              {' '}
                              -&nbsp; {surgery.name}
                            </li>
                          ))}
                        </Stack>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}
                    {item?.medicines.length > 0 && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="healthicons:medicines-outline"
                          />{' '}
                          Medicines{' '}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.medicines.map((data) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={data._id}
                            >
                              {' '}
                              -&nbsp; {data?.frequently}
                            </li>
                          ))}
                        </Stack>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}

                    {item?.insurance.length > 0 && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="streamline:insurance-hand"
                          />{' '}
                          Insurance{' '}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.insurance.map((company) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={company._id}
                            >
                              -&nbsp; {company?.name_english}
                            </li>
                          ))}
                        </Stack>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}

                    {item?.sport_exercises && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="icon-park-outline:sport"
                          />{' '}
                          Sport Exercises
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
                          {' '}
                          -&nbsp; {item?.sport_exercises}
                        </li>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}

                    {item?.eating_diet && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="fluent:food-apple-20-regular"
                          />{' '}
                          Eating Diet{' '}
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
                          {' '}
                          -&nbsp; {item?.eating_diet?.name_english}
                        </li>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}
                    {item?.alcohol_consumption && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="healthicons:alcohol"
                          />{' '}
                          Alcohol Consumption{' '}
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
                          {' '}
                          -&nbsp; {item?.alcohol_consumption}
                        </li>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}

                    {item?.smoking && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="healthicons:smoking-outline"
                          />{' '}
                          Smoking
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
                          {' '}
                          -&nbsp; {item?.smoking}
                        </li>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}
                  </Stack>

                  {item?.other_medication_notes.length > 0 && (
                    <Stack spacing={2} sx={{ mt: 1, ml: 2 }}>
                      <Typography style={{ color: 'gray' }} variant="body1">
                        <Iconify
                          style={{
                            color: 'rgb(0,156,0)',
                            position: 'relative',
                            left: '-3px',
                            top: '2px',
                          }}
                          icon="charm:notes"
                        />{' '}
                        Notes
                      </Typography>
                      {item?.other_medication_notes.map((note, indexnumtwo) => (
                        <li
                          key={indexnumtwo}
                          style={{
                            fontWeight: 500,
                            fontSize: '17px',
                            listStyle: 'none',
                            width: { md: '60%', xs: '100%' },
                          }}
                        >
                          -&nbsp; {note}
                        </li>
                      ))}
                    </Stack>
                  )}
                </Stack>
              ))}
            </div>
          )}
        </>
      ) : (
        "Sorry we couldn't find your data"
      )}
    </>
  );
}