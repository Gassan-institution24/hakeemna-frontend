import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';

import { fMonth } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function EmployeeInfoContent({ employeeData }) {
  const {
    name_english,
    name_arabic,
    nationality,
    profrssion_practice_num,
    birth_date,
    gender,
    department,
    identification_num,
    employee_type,
    Bachelor_year_graduation,
    University_graduation_Bachelor,
    unit_service,
    tax_num,
    address,
    web_page,
    University_graduation_Specialty,
    phone,
    mobile_num,
    email,
    speciality,
  } = employeeData.employee;

  const settings = useSettingsContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        {[
          {
            label: t('Full name in English'),
            value: name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('Full name in Arabic'),
            value: name_arabic,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('gender'),
            value: t(gender),
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('nationality'),
            value: curLangAr ? nationality?.name_arabic : nationality?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('unit service'),
            value: curLangAr ? unit_service?.name_arabic : unit_service?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('department'),
            value: curLangAr ? department?.name_arabic : department?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('employee type'),
            value: curLangAr ? employee_type?.name_arabic : employee_type?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('specialty'),
            value: curLangAr ? speciality?.name_arabic : speciality?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('email'),
            value: email,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('ID number'),
            value: identification_num,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('profrssion practice number'),
            value: profrssion_practice_num,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('tax number'),
            value: tax_num,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('address'),
            value: address,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('webpage'),
            value: web_page,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('phone'),
            value: phone,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('mobile Number'),
            value: mobile_num,
            icon: <Iconify icon="solar:clock-circle-bold" />,
          },
          {
            label: t('birth date'),
            value: fMonth(birth_date),
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
          {
            label: t('bachelor year graduation'),
            value: Bachelor_year_graduation,
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
          {
            label: t('university graduation bachelor'),
            value: University_graduation_Bachelor,
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
          {
            label: t('university graduation specialty'),
            value: University_graduation_Specialty,
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
        ].map((item, idx) => (
          <>
            {item.value && (
              <Stack key={idx} spacing={1.5}>
                {/* {item.icon} */}
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.secondary',
                    mb: 0.5,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.primary',
                    component: 'span',
                  }}
                />
              </Stack>
            )}
          </>
        ))}
      </Box>
    </Stack>
  );
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          {renderOverview}
        </Grid>
      </Grid>
    </Container>
  );
}

EmployeeInfoContent.propTypes = {
  employeeData: PropTypes.object,
};
