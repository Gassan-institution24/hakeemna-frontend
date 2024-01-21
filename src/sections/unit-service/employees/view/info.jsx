import PropTypes from 'prop-types';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { useSettingsContext } from 'src/components/settings';

import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function EmployeeInfoContent({ employeeData }) {
  const {
    first_name,
    second_name,
    family_name,
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
            label: 'first_name',
            value: first_name,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'second_name',
            value: second_name,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'family_name',
            value: family_name,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'gender',
            value: gender,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'nationality',
            value: nationality?.userName,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'Unit Service',
            value: unit_service?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'department',
            value: department?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'employee_type',
            value: employee_type?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'speciality',
            value: speciality?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'email',
            value: email,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'Identification Number',
            value: identification_num,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'profrssion_practice_num',
            value: profrssion_practice_num,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'Tax Number',
            value: tax_num,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'address',
            value: address,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'Web Page',
            value: web_page,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'Phone Number',
            value: phone,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: 'Mobile Number',
            value: mobile_num,
            icon: <Iconify icon="solar:clock-circle-bold" />,
          },
          {
            label: 'birth_date',
            value: birth_date,
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
          {
            label: 'Bachelor_year_graduation',
            value: Bachelor_year_graduation,
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
          {
            label: 'University_graduation_Bachelor',
            value: University_graduation_Bachelor,
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
          {
            label: 'University_graduation_Specialty',
            value: University_graduation_Specialty,
            icon: <Iconify icon="solar:wad-of-money-bold" />,
          },
        ].map((item) => (
          <>
            {item.value && (
              <Stack key={item.label} spacing={1.5}>
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
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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
