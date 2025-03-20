import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatientInsurance, useGetCurrentPatientMedicines } from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';

import patientCard from '../home/images/cardimage.png';
import patientCardAr from '../home/images/cardimagear.png';
// ----------------------------------------------------------------------

export default function ProfileHome() {
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { patientInsuranseData } = useGetPatientInsurance(user?.patient?._id);
  const { prescriptionData } = useGetCurrentPatientMedicines(user?.patient?._id);

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  function calculateAge(birthDate) {
    if (birthDate) {
      const today = new Date();
      const dob = new Date(birthDate);

      const age = today.getFullYear() - dob.getFullYear();
      const months = today.getMonth() - dob.getMonth();

      if (age === 0) {
        return curLangAr ? `${months} شهر` : `${months} months`;
      }
      return curLangAr ? `${age} سنة` : `${age} years`;
    }
    return '';
  }
  const toArabicNumerals = (num) => num?.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const hasData =
    user?.patient?.drug_allergies?.length > 0 ||
    user?.patient?.diseases?.length > 0 ||
    user?.patient?.surgeries?.length > 0 ||
    user?.patient?.medicines?.length > 0 ||
    patientInsuranseData?.length > 0 ||
    user?.patient?.sport_exercises ||
    user?.patient?.is_on_eating_diet ||
    user?.patient?.alcohol_consumption ||
    user?.patient?.smoking ||
    user?.patient?.other_medication_notes;
  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      {user?.patient?.drug_allergies?.length > 0 && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="guidance:no-drug-or-substance"
            />
            &nbsp;
            {t('Drug Allergies')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.drug_allergies?.map((drug, drugkey) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={drugkey}>
                -&nbsp; {drug?.trade_name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.diseases?.length > 0 && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="ph:virus"
            />
            &nbsp;
            {t('Diseases')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.diseases?.map((disease, diseasekey) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={diseasekey}>
                -&nbsp; {disease?.name_english}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.surgeries?.length > 0 && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="guidance:surgery"
            />
            &nbsp;
            {t('Surgeries')}
          </Typography>
          <Stack spacing={1}>
            {user?.patient?.surgeries?.map((surgery, surgerykey) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={surgerykey}>
                -&nbsp; {surgery.name}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {prescriptionData?.length > 0 && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="healthicons:medicines-outline"
            />
            &nbsp;
            {t('Medicines')}
          </Typography>
          <Stack spacing={1}>
            {prescriptionData?.map((data, datakey) => (
              <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }} key={datakey}>
                -&nbsp; {data?.medicines?.trade_name}{' '}
                {data?.chronic === true ? (
                  <span style={{ color: 'orange' }}>{t('CHRONIC')}</span>
                ) : (
                  ''
                )}
              </li>
            ))}
          </Stack>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {patientInsuranseData?.length > 0 && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
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

      {user?.patient?.sport_exercises && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="icon-park-outline:sport"
            />
            &nbsp;
            {t('Sport Exercises')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {t(user?.patient?.sport_exercises)}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.is_on_eating_diet && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="fluent:food-apple-20-regular"
            />
            {t('Eating Diet')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {t(user?.patient?.is_on_eating_diet)}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.alcohol_consumption && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
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
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="healthicons:smoking-outline"
            />
            &nbsp;
            {t('Smoking')}
          </Typography>
          <li style={{ fontWeight: 500, fontSize: '17px', listStyle: 'none' }}>
            -&nbsp; {t(user?.patient?.smoking)}
          </li>
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />
        </Stack>
      )}
      {user?.patient?.other_medication_notes && (
        <Stack spacing={2}>
          <Typography sx={{ color: 'gray' }} variant="body1">
            <Iconify
              sx={{ color: 'success.main', position: 'relative', left: '-3px', top: '2px' }}
              icon="charm:notes"
            />
            &nbsp;
            {t('Notes')}
          </Typography>

          {user?.patient?.other_medication_notes}
        </Stack>
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
          sx={{
            position: 'absolute',
            top: 15,
            left: 108,
            height: '27px',
            width: '27px',
            color: 'success.main',
            zIndex: 1,
            display: curLangAr ? 'none' : 'flex',
          }}
        />
        <Typography variant="h4" sx={{ mt: 2 }}>
          {curLangAr ? user?.patient.name_arabic : `${user?.patient?.name_english}`}
        </Typography>
      </div>
      {[
        {
          label: t('Gender'),
          value: t(user?.patient?.gender),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Age'),
          value: calculateAge(user?.patient?.birth_date),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Height'),
          value: curLangAr ? toArabicNumerals(user?.patient?.height) : user?.patient?.height,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('Weight'),
          value: curLangAr ? toArabicNumerals(user?.patient?.weight) : user?.patient?.weight,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
      ].map((item, idx) => (
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
          value: curLangAr
            ? toArabicNumerals(user?.patient?.identification_num)
            : user?.patient?.identification_num,
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
          label: t('nationality'),
          value: user?.patient?.nationality?.name_english,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: t('Address'),
          value: user?.patient?.address,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: t('Mobile Number'),
          value: curLangAr ? user?.patient?.mobile_num1 : user?.patient?.mobile_num1,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
        {
          label: t('Second Mobile Number'),
          value: curLangAr ? user?.patient?.mobile_num2 : user?.patient?.mobile_num2,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
      ].map((item, ii) => (
        <>
          {item.value && (
            <Stack key={ii}>
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
      ].map((item, idx) => (
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
    <Stack
      component={Card}
      spacing={4}
      sx={{
        p: 3,
        marginBottom: 2,
        backgroundImage: curLangAr ? `url(${patientCardAr})` : `url(${patientCard})`,
        backgroundSize: 'cover',
      }}
    >
      <Box sx={{ mt: 4, p: 3, ml: 3 }}>
        <Typography sx={{ mb: 2 }}>
          {t('Name')}:&nbsp;&nbsp;
          {curLangAr ? user?.patient?.name_arabic : user?.patient?.name_english}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {t('Age')}:&nbsp;&nbsp; {calculateAge(user?.patient?.birth_date)}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {t('IDno')}:&nbsp;&nbsp;
          {curLangAr
            ? toArabicNumerals(user?.patient?.identification_num)
            : user?.patient?.identification_num}
        </Typography>
        <Typography sx={{ mb: 2, mt: 0.5 }}>
          {t('Mobile Number')}:&nbsp;&nbsp;
          {user?.patient?.mobile_num1}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        {renderOverview}

        {user?.patient?.gender === 'male' ? [renderMoreInfo] : [renderMoreInfoPregnant]}
        <Box sx={{ display: { md: 'block', xs: 'none' } }}>{renderCard}</Box>
      </Grid>

      {hasData && (
        <Grid xs={12} md={7}>
          {renderContent}
          <Box sx={{ display: { md: 'none', xs: 'block' } }}>{renderCard}</Box>
        </Grid>
      )}
    </Grid>
  );
}
