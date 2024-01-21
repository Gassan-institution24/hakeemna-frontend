import PropTypes from 'prop-types';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function UnitServiceInfoContent({ unitServiceData }) {
  console.log('unitServiceData', unitServiceData);
  const {
    code,
    name_english,
    country,
    city,
    US_type,
    sector_type,
    tax,
    identification_num,
    address,
    email,
    web_page,
    company_logo,
    phone,
    mobile_num,
    ip_address,
    introduction_letter,
    other_information,
    speciality,
    users_num,
    subscriptions,
    insurance,
    last_internet_connection,
  } = unitServiceData;

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
          label: 'City',
          value: city?.userName,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Unit Service Type',
          value: US_type?.name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Sector Type',
          value: sector_type?.name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Identification Number',
          value: identification_num,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Tax Number',
          value: tax,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'insurance',
          value: insurance?.map((company) => company.name_english).join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Subscriptions',
          value: subscriptions?.map((subscription) => `${subscription?.name_english}`).join(', '),
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
          label: 'Users Number',
          value: users_num,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Specialty',
          value: speciality?.name_english,
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

UnitServiceInfoContent.propTypes = {
  unitServiceData: PropTypes.object,
};
