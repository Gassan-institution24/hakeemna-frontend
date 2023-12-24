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

import { fDate, fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function StakeholderInfoContent({ stakeholderData,offerData }) {
  const {
    code,
    employee_type,
    unit_service,
    country,
    city,
    stakeholder,
    name_english,
    comment,
    quantity,
    currency,
    price,
    start_date,
    end_date,
    img,
    services,
    status,



    identification_num,
    stakeholder_type,
    stakeholder_registration,
    tax_num,
    address,
    web_page,
    company_logo,
    phone,
    mobile_num,
    specialty,
    bank_acc,
    email,
    insurance,
  } = offerData;
  
  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: 'Name',
          value: name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Start Date',
          value: fDateTime(start_date),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'End Date',
          value: fDateTime(end_date),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Employee Type',
          value: employee_type?.name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Unit Service',
          value: unit_service?.name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Country',
          value: country?.name_english,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'city',
          value: city?.userName,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Stakeholder',
          value: stakeholder?.userName,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Comment',
          value: comment,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Quantity',
          value: quantity,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Price',
          value: `${currency.symbol}${price}`,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Services',
          value: services.map((service)=>service.name_english).join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
       
      ].map((item) => (
        <>
        {item.value && <Stack key={item.label} spacing={1.5}>
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
        </Stack>}
        </>
      ))}
    </Stack>
  );
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderOverview}
      </Grid>
    </Grid>
  );
}

StakeholderInfoContent.propTypes = {
  stakeholderData: PropTypes.object,
  offerData: PropTypes.object,
};
