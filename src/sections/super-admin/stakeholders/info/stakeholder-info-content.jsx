import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function StakeholderInfoContent({ stakeholderData }) {
  // console.log('stakeholderData', stakeholderData);
  const {
    code,
    name_english,
    identification_num,
    stakeholder_type,
    country,
    stakeholder_registration,
    unit_service,
    tax_num,
    address,
    web_page,
    company_logo,
    phone,
    mobile_num,
    specialty,
    bank_acc,
    city,
    email,
    insurance,
    status,
  } = stakeholderData;

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: 'Name',
          value: name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Country',
          value: country?.userName,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Unit Service',
          value: unit_service?.name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Stakeholder Type',
          value: stakeholder_type?.name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'insurance',
          value: insurance.map((company) => company.name_english).join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Registration',
          value: stakeholder_registration,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Identification Number',
          value: identification_num,
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
          label: 'email',
          value: email,
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
          label: 'Specialty',
          value: specialty?.name_english,
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
    </Stack>
  );
  return (
    <Grid container spacing={3}>
      <Grid xs={12} maxWidth="md">
        {renderOverview}
      </Grid>
    </Grid>
  );
}

StakeholderInfoContent.propTypes = {
  stakeholderData: PropTypes.object,
};
