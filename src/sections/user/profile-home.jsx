import React from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
// ----------------------------------------------------------------------

export default function ProfileHome() {
  const { t } = useTranslate();
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
  const { user } = useAuthContext();

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      {user?.patient?.drug_allergies?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="guidance:no-drug-or-substance"
            />
            &nbsp;
            {t(' Drug Allergies')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.drug_allergies?.map((drug) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={drug?._id}>
                -&nbsp; {drug?.trade_name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.diseases?.length > 0 && (
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
            {user?.patient?.diseases?.map((disease) => (
              <li
                style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                key={disease?._id}
              >
                -&nbsp; {disease?.name_english}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.surgeries?.length > 0 && (
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
            {user?.patient?.surgeries?.map((surgery) => (
              <li
                style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                key={surgery._id}
              >
                -&nbsp; {surgery.name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.medicines?.length > 0 && (
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
            {user?.patient?.medicines?.map((data) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={data._id}>
                -&nbsp; {data?.medicine?.trade_name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.insurance?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="streamline:insurance-hand"
            />
            &nbsp;
            {t('Insurance')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.insurance?.map((company) => (
              <li
                style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}
                key={company._id}
              >
                -&nbsp; {company?.name_english}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}

      {user?.patient.sport_exercises && (
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
            -&nbsp; {user?.patient?.sport_exercises}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.eating_diet && (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="fluent:food-apple-20-regular"
            />
            {t('Eating Diet')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {user?.patient?.eating_diet?.name_english}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.alcohol_consumption && (
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
            -&nbsp; {user?.patient?.alcohol_consumption}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.smoking && (
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
            -&nbsp; {user?.patient?.smoking}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.other_medication_notes?.length > 0 ? (
        <Stack spacing={2}>
          <Typography style={{ color: 'gray' }} variant="body1">
            <Iconify
              style={{ color: 'rgb(0,156,0)', position: 'relative', left: '-3px', top: '2px' }}
              icon="charm:notes"
            />
            &nbsp;
            {t('Notes')}
          </Typography>
          {user?.patient?.other_medication_notes.map((info) => (
            <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>-&nbsp; {info}</li>
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
          src={user?.patient?.profile_picture?.replace(/\\/g, '/')}
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
            ? user?.patient.name_arabic
            : `${user?.patient?.first_name} ${user?.patient?.last_name}`}
        </Typography>
      </div>
      {[
        {
          label: t('Gender'),
          value: user?.patient?.gender,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Age'),
          value: calculateAge(user?.patient?.birth_date),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Height'),
          value: user?.patient?.height,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Weight'),
          value: user?.patient?.weight,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
      ].map((item) => (
        <>
          {item.value && (
            <Stack key={item.label}>
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
          value: user?.patient?.identification_num,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Blood Type'),
          value: user?.patient?.blood_type,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Marital Status'),
          value: user?.patient?.marital_status,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Address'),
          value: user?.patient?.address,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: t('Mobile Number'),
          value: user?.patient?.mobile_num1,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
        {
          label: t('Second Mobile Number'),
          value: user?.patient?.mobile_num2,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
      ].map((item) => (
        <>
          {item.value && (
            <Stack key={item.label}>
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
          value: user?.patient?.identification_num,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Blood Type'),
          value: user?.patient?.blood_type,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Pregnant'),
          value: user?.patient?.pregnant ? 'Yes' : 'No',
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Marital Status'),
          value: user?.patient?.marital_status,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Address'),
          value: user?.patient?.address,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: t('Mobile Number'),
          value: user?.patient?.mobile_num1,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
        {
          label: t('Second Mobile Number'),
          value: user?.patient?.mobile_num2,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
      ].map((item) => (
        <>
          {item.value && (
            <Stack key={item.label} spacing={2}>
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
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        {renderOverview}
        {user?.patient.gender === 'male' ? [renderMoreInfo] : [renderMoreInfoPregnant]}
      </Grid>

      <Grid xs={12} md={7}>
        {renderContent}
      </Grid>
    </Grid>
  );
}
