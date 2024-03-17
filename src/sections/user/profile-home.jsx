import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ReactCardFlip from 'react-card-flip';

import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientInsurance } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
// ----------------------------------------------------------------------

export default function ProfileHome() {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { patientInsuranseData } = useGetPatientInsurance(user?.patient?.[user.index_of]?._id);
  console.log(patientInsuranseData,"patientInsuranseData");
  console.log(user?.patient?.[user.index_of]?._id);
  const tokenPlaceholder =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjhlZDQxNTJhYWQ5MjY2NGMxN2ZkNyIsImlhdCI6MTcxMDA0ODQzNCwiZXhwIjoxNzE3ODI0NDM0fQ.pI645Yv07aWxMh6k1gz6ogt30aSRhQ_y1dUQX0PgHrY';

  // Replace the placeholder with the actual token (you need to get or generate the token)
  const qrCodeLink = `http://localhost:3006/dashboard/user/myprofile/${user?.patient?.[user.index_of]?._id}?token=${tokenPlaceholder}`;
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  function calculateAge(birthDate) {
    if (birthDate) {
      const today = new Date();
      const dob = new Date(birthDate);

      const age = today.getFullYear() - dob.getFullYear();
      return age;
    }
    return '';
  }
  const [qr, setQr] = useState(false);
  const flipCard = () => {
    setQr(!qr);
  };
  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      {user?.patient?.[user.index_of]?.drug_allergies?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="guidance:no-drug-or-substance"
            />
            &nbsp;
            {t('Drug Allergies')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.[user.index_of]?.drug_allergies?.map((drug, drugkey, idx) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={idx}>
                -&nbsp; {drug?.trade_name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.[user.index_of]?.diseases?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="ph:virus"
            />
            &nbsp;
            {t('Diseases')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.[user.index_of]?.diseases?.map((disease, diseasekey, idx) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={idx}>
                -&nbsp; {disease?.name_english}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.[user.index_of]?.surgeries?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="guidance:surgery"
            />
            &nbsp;
            {t('Surgeries')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.[user.index_of]?.surgeries?.map((surgery, surgerykey, idx) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={idx}>
                -&nbsp; {surgery.name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.[user.index_of]?.medicines?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="healthicons:medicines-outline"
            />
            &nbsp;
            {t('Medicines')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.[user.index_of]?.medicines?.map((data, datakey, idx) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={idx}>
                -&nbsp; {data?.medicine?.trade_name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {patientInsuranseData?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="streamline:insurance-hand"
            />
            &nbsp;
            {t('Insurance')}
          </Typography>
          <Stack spacing={1} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {patientInsuranseData?.map((company, companykey) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={companykey}>
                -&nbsp; {company?.insurance?.name_english}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}

      {user?.patient?.[user.index_of].sport_exercises && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="icon-park-outline:sport"
            />
            &nbsp;
            {t('Sport Exercises')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {user?.patient?.[user.index_of]?.sport_exercises}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.[user.index_of]?.eating_diet && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="fluent:food-apple-20-regular"
            />
            {t('Eating Diet')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {user?.patient?.[user.index_of]?.eating_diet?.name_english}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.[user.index_of]?.alcohol_consumption && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="healthicons:alcohol"
            />
            &nbsp;
            {t('Alcohol Consumption')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {user?.patient?.[user.index_of]?.alcohol_consumption}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.[user.index_of]?.smoking && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="healthicons:smoking-outline"
            />
            &nbsp;
            {t('Smoking')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {user?.patient?.[user.index_of]?.smoking}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.[user.index_of]?.other_medication_notes?.length > 0 ? (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="charm:notes"
            />
            &nbsp;
            {t('Notes')}
          </Typography>

          {user.patient.other_medication_notes[0].split(',').map((info, infokey) => (
            <li key={infokey} style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
              -&nbsp; {info.trim()} {/* trim to remove extra whitespaces */}
            </li>
          ))}
        </Stack>
      ) : (
        ''
      )}
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={4} sx={{ p: 3, marginBottom: 2 }}>
      <div>
        <Image
          alt="profile"
          src={user?.patient?.[user.index_of]?.profile_picture?.replace(/\\/g, '/')}
          sx={{
            height: '150px',
            width: '100px',
            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        />
        <Iconify
          icon="subway:pin"
          style={{
            position: 'absolute',
            top: 15,
            left: 108,
            height: '27px',
            width: '27px',
            color: 'rgb(0, 156, 0)',
            zIndex: 1,
            display: curLangAr ? 'none' : 'flex',
          }}
        />
        <Typography variant="h4" sx={{ mt: 2 }}>
          {curLangAr
            ? user?.patient?.[user.index_of].name_arabic
            : `${user?.patient?.[user.index_of]?.first_name} ${user?.patient?.[user.index_of]?.last_name}`}
        </Typography>
      </div>
      {[
        {
          label: t('Gender'),
          value: user?.patient?.[user.index_of]?.gender,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Age'),
          value: calculateAge(user?.patient?.[user.index_of]?.birth_date),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Height'),
          value: user?.patient?.[user.index_of]?.height,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Weight'),
          value: user?.patient?.[user.index_of]?.weight,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
      ].map((item, i, idx) => (
        <>
          {item.value && (
            <Stack key={idx}>
              <Typography sx={{ color: 'gray' }} variant="body1">
                {item.label} : &nbsp;
                <span
                  style={{
                    color: 'black',
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </span>
              </Typography>
            </Stack>
          )}
        </>
      ))}
    </Stack>
  );
  const renderMoreInfo = (
    <Stack component={Card} spacing={4} sx={{ p: 3, marginBottom: 2 }}>
      {[
        {
          label: t('Identification Number'),
          value: user?.patient?.[user.index_of]?.identification_num,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Blood Type'),
          value: user?.patient?.[user.index_of]?.blood_type,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Marital Status'),
          value: user?.patient?.[user.index_of]?.marital_status,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Address'),
          value: user?.patient?.[user.index_of]?.address,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: t('Mobile Number'),
          value: user?.patient?.[user.index_of]?.mobile_num1,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
        {
          label: t('Second Mobile Number'),
          value: user?.patient?.[user.index_of]?.mobile_num2,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
      ].map((item, ii, idx) => (
        <>
          {item.value && (
            <Stack key={idx}>
              <Typography sx={{ color: 'gray' }} variant="body1">
                {item.label} : &nbsp;
                <span
                  style={{
                    color: 'black',
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </span>
              </Typography>
            </Stack>
          )}
        </>
      ))}
    </Stack>
  );

  const renderMoreInfoPregnant = (
    <Stack component={Card} spacing={4} sx={{ p: 3, marginBottom: 2 }}>
      {[
        {
          label: t('Identification Number'),
          value: user?.patient?.[user.index_of]?.identification_num,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Blood Type'),
          value: user?.patient?.[user.index_of]?.blood_type,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Pregnant'),
          value: user?.patient?.[user.index_of]?.pregnant ? 'Yes' : 'No',
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Marital Status'),
          value: user?.patient?.[user.index_of]?.marital_status,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Address'),
          value: user?.patient?.[user.index_of]?.address,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: t('Mobile Number'),
          value: user?.patient?.[user.index_of]?.mobile_num1,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
        {
          label: t('Second Mobile Number'),
          value: user?.patient?.[user.index_of]?.mobile_num2,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
      ].map((item, iii, idx) => (
        <>
          {item.value && (
            <Stack key={idx} spacing={2}>
              <Typography sx={{ color: 'gray' }} variant="body1">
                {item.label} : &nbsp;
                <span
                  style={{
                    color: 'black',
                    fontWeight: 600,
                  }}
                >
                  {item.value}
                </span>
              </Typography>
            </Stack>
          )}
        </>
      ))}
    </Stack>
  );
  const renderCard = (
    <ReactCardFlip flipDirection="horizontal" isFlipped={qr}>
      <>
        <Box
          sx={{
            bgcolor: 'orange',
            borderRadius: '100%',
            zIndex: 1,
            position: 'relative',
            top: 45,
            right: { lg: -190, xl: -230, md: -175, sm: -500, xs: -230 },
            width: 40,
            height: 40,
          }}
        >
          <Typography sx={{ position: 'relative', left: 20, top: 5 }} variant="body2">
            Hakeemna
          </Typography>
          <Typography sx={{ position: 'relative', left: 20 }} variant="body2">
            card
          </Typography>
          <Iconify
            onClick={flipCard}
            width={30}
            sx={{
              position: 'relative',
              left: { lg: -180, xl: -210, md: -160, sm: -490, xs: -200 },
              top: -35,
              '&:hover': {
                color: 'success.main',
              },
            }}
            icon="bx:qr"
          />
        </Box>

        <Divider sx={{ borderWidth: 25, borderColor: '##EBE7E7', borderStyle: 'solid' }} />
        <Stack component={Card} spacing={1} sx={{ p: 3, bgcolor: '#00F67F', borderRadius: 0 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', color: '#fff' }}>
            {user?.patient?.[user.index_of]?.first_name} {user?.patient?.[user.index_of]?.middle_name} {user?.patient?.[user.index_of]?.family_name}
          </Typography>
          <Typography variant="h5" sx={{ textAlign: 'center', color: '#fff' }}>
            {user?.patient?.[user.index_of]?.identification_num}
          </Typography>
          <Typography variant="h3" sx={{ textAlign: 'left' }}>
            {user?.patient?.[user.index_of]?.blood_type}
          </Typography>
        </Stack>
      </>

      <>
        <Box
          sx={{
            bgcolor: 'orange',
            borderRadius: '100%',
            zIndex: 1,
            position: 'relative',
            top: 45,
            right: { lg: -190, xl: -230, md: -175, sm: -500, xs: -230 },
            width: 40,
            height: 40,
          }}
        >
          <Typography sx={{ position: 'relative', left: 20, top: 5 }} variant="body2">
            Hakeemna
          </Typography>
          <Typography sx={{ position: 'relative', left: 20 }} variant="body2">
            card
          </Typography>
          <Iconify
            onClick={flipCard}
            width={30}
            sx={{
              position: 'relative',
              left: { lg: -180, xl: -210, md: -160, sm: -490, xs: -200 },
              top: -35,
              '&:hover': {
                color: 'success.main',
              },
            }}
            icon="mdi:smart-card-outline"
          />
        </Box>

        <Divider sx={{ borderWidth: 25, borderColor: '#EBE7E7', borderStyle: 'solid' }} />
        <Stack component={Card} spacing={1} sx={{ p: 3, bgcolor: '#00F67F', borderRadius: 0 }}>
          <QRCodeSVG value={qrCodeLink} bgColor="none" />
        </Stack>
      </>
    </ReactCardFlip>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        {renderOverview}
        {user?.patient?.[user.index_of].gender === 'male' ? [renderMoreInfo] : [renderMoreInfoPregnant]}
        <Box sx={{ display: { md: 'block', xs: 'none' } }}>{renderCard}</Box>
      </Grid>

      <Grid xs={12} md={7}>
        {renderContent}
        <Box sx={{ display: { md: 'none', xs: 'block' } }}>{renderCard}</Box>
      </Grid>
    </Grid>
  );
}
