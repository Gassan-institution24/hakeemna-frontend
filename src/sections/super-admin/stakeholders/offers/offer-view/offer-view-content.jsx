import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';

import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function StakeholderInfoContent({ stakeholderData, offerData }) {
  const {
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
    services,
    unit_services_beneficiary,
    employee_beneficiary,
    patients_beneficiary,
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
          label: 'unit of service',
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
          value: services.map((service, idx) => service.name_english).join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'units of service Beneficiary',
          value: unit_services_beneficiary
            .map((unitService, idx) => unitService.name_english)
            .join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Employee Beneficiary',
          value: employee_beneficiary.map((employee, idx) => employee.name_english).join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Patients Beneficiary',
          value: patients_beneficiary.map((patient, idx) => patient.name_english).join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
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
  offerData: PropTypes.object,
};
