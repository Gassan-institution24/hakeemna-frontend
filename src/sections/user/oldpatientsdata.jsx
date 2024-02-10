import React, { useState, useEffect, useMemo } from 'react';

import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Iconify from 'src/components/iconify';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { useAuthContext } from 'src/auth/hooks';
import axios, { endpoints } from 'src/utils/axios';
import { paths } from 'src/routes/paths';

import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';

export default function Oldpatientsdata() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [oldpatientsdata, setOldpatientsdata] = useState();
  const [oldDataId, setOlddataID] = useState();
  const { t } = useTranslate();
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
  }, [user.patient.identification_num]);

  useEffect(() => {
    if (oldpatientsdata?.length > 0) {
      const mapdData = oldpatientsdata?.map((Data) => Data);
      setOlddataID(mapdData[0]._id);
    }
  }, [oldpatientsdata, oldDataId]);

  const yesFunction = async () => {
    try {
      const existingDataResponse = await axios.get(endpoints.tables.patient(user.patient._id));
      const existingData = existingDataResponse.data;

      const newData = { ...oldpatientsdata[0] };

      Object.keys(user.patient).forEach((prop) => {
        if (user.patient[prop] !== '') {
          newData[prop] = user.patient[prop];
        }
      });

      const response = await axios.patch(endpoints.tables.patient(user.patient._id), newData);

      enqueueSnackbar(t('Thanks for your cooperation, data saved to profile successfully'), {
        variant: 'success',
      });
      setTimeout(() => {
        router.push(paths.dashboard.user.profile);
      }, 1000);
    } catch (error) {
      enqueueSnackbar(t('Failed to update data.'), {
        variant: 'error',
      });
    }
  };

  const noFunction = async () => {
    try {
      const response = await axios.patch(`/api/oldpatientsdata/${oldDataId}/updateonboard`, {
        is_onboarded: false,
      });
      enqueueSnackbar(t(`Thanks for your cooperation`), { variant: 'success' });
    } catch (error) {
      console.error('Error updating data:', error);
    }

    enqueueSnackbar(t(`Thanks for your cooperation`), { variant: 'success' });
    setTimeout(() => {
      router.push(paths.dashboard.root);
    }, 1000);
  };

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
            <Container>
              <CustomBreadcrumbs
                heading={t('Please confirm your data')}
                links={[
                  { name: t('Home'), href: paths.dashboard.root },
                  { name: t('Confirming Data') },
                ]}
              />
              <Box sx={{ display: 'block' }}>
                <Typography sx={{ mb: 1, padding: 1, fontSize: { md: 16, xs: 14 } }}>
                  {t('Click')}
                  <Button
                    onClick={yesFunction}
                    variant="contained"
                    sx={{ border: 1, height: { md: '25px', xs: '20px' }, bgcolor: 'success.main' }}
                  >
                    {t('Yes')}
                  </Button>
                  {t('if this is your data')}
                </Typography>
                <Typography sx={{ mb: 1, padding: 1, fontSize: { md: 16, xs: 14 } }}>
                  {t('Click')}
                  <Button
                    onClick={noFunction}
                    variant="contained"
                    sx={{ border: 1, height: { md: '25px', xs: '20px' } }}
                  >
                    {t('No')}
                  </Button>
                  {t('if not')}
                </Typography>
              </Box>
            </Container>
          </Box>

          {oldpatientsdata && (
            <div>
              {oldpatientsdata?.map((item, index) => (
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
                    {item?.identification_num?.length > 0 && (
                      <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography style={{ color: 'gray' }} variant="body1">
                          <Iconify
                            style={{
                              color: 'rgb(0,156,0)',
                              position: 'relative',
                              left: '-3px',
                              top: '2px',
                            }}
                            icon="heroicons:identification"
                          />
                          {t('Identification Number')}
                        </Typography>
                        <Stack spacing={1}>
                          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
                            -&nbsp; {item?.identification_num}
                          </li>
                        </Stack>
                        <Divider
                          sx={{
                            borderStyle: 'dashed',
                            borderColor: 'rgba(128, 128, 128, 0.512)',
                          }}
                        />
                      </Stack>
                    )}
                    {item?.drug_allergies?.length > 0 && (
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
                          />
                          {t('Drug Allergies')}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.drug_allergies?.map((drug) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={drug?._id}
                            >
                              -&nbsp; {drug?.trade_name}
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
                    {item?.diseases?.length > 0 && (
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
                          />
                          {t('Diseases')}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.diseases?.map((disease) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={disease._id}
                            >
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

                    {item?.surgeries?.length > 0 && (
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
                          />
                          {t('Surgeries')}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.surgeries?.map((surgery) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={surgery._id}
                            >
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
                    {item?.medicines?.length > 0 && (
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
                          />
                          {t('Medicines')}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.medicines?.map((data) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={data._id}
                            >
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

                    {item?.insurance?.length > 0 && (
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
                          />
                          {t('Insurance')}
                        </Typography>
                        <Stack spacing={1}>
                          {item?.insurance?.map((company) => (
                            <li
                              style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                              key={company?._id}
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
                          />
                          {t('Sport Exercises')}
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
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
                          />
                          {t('Eating Diet')}
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
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
                          />
                          {t('Alcohol Consumption')}
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
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
                          />
                          {t('Smoking')}
                        </Typography>
                        <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
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

                  {item?.other_medication_notes?.length > 0 && (
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
                        />
                        {t('Notes')}
                      </Typography>
                      {item?.other_medication_notes?.map((note, indexnumtwo) => (
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
        t("Sorry we couldn't find your data")
      )}
    </>
  );
}
