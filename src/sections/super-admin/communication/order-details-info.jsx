import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import { Grid, Tooltip, MenuItem, TextField, ListItemText } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetUsers, useGetTicketCategories } from 'src/api';

// ----------------------------------------------------------------------

const priorityOptions = ['very urgent', 'urgent', 'normal'];

export default function OrderDetailsInfo({ ticket, refetch }) {
  const { enqueueSnackbar } = useSnackbar();

  const { ticketCategoriesData } = useGetTicketCategories();
  const { usersData } = useGetUsers({ role: 'superadmin' });

  const [priority, setPriority] = useState(ticket.priority);
  const [category, setCategory] = useState(ticket.category._id);
  const [assignedTo, setAssignedTo] = useState(ticket.assigned_to?._id);

  const handleCategoryChange = (e) => {
    try {
      axiosInstance.patch(endpoints.tickets.one(ticket._id), { category: e.target.value });
      setCategory(e.target.value);
      enqueueSnackbar('changed successfully!');
      refetch();
    } catch (error) {
      enqueueSnackbar(error.message);
      refetch();
    }
  };
  const handlePriorityChange = (e) => {
    try {
      axiosInstance.patch(endpoints.tickets.one(ticket._id), { priority: e.target.value });
      setPriority(e.target.value);
      enqueueSnackbar('changed successfully!');
      refetch();
    } catch (error) {
      enqueueSnackbar(error.message);
      refetch();
    }
  };
  const handleAssignedToChange = (e) => {
    try {
      axiosInstance.patch(endpoints.tickets.one(ticket._id), { assigned_to: e.target.value });
      setAssignedTo(e.target.value);
      enqueueSnackbar('changed successfully!');
      refetch();
    } catch (error) {
      enqueueSnackbar(error.message);
      refetch();
    }
  };

  return (
    <Card>
      <CardHeader title="Ticket Info" />
      <Stack direction="row" sx={{ p: 3 }}>
        <Grid sx={{ p: 4 }} container spacing={3} rowGap={2}>
          {[
            {
              label: 'user',
              value: ticket?.user_creation?.email,
            },
            {
              label: 'role',
              value: ticket?.user_creation?.role,
            },
            {
              label: 'category',
              value: (
                <TextField
                  select
                  variant="standard"
                  size="small"
                  sx={{ width: 150 }}
                  value={category}
                  onChange={handleCategoryChange}
                >
                  {ticketCategoriesData.map((one, idx) => (
                    <MenuItem key={idx} value={one._id}>
                      {one.name_english}
                    </MenuItem>
                  ))}
                </TextField>
              ),
            },
            {
              label: 'priority',
              value: (
                <TextField
                  select
                  variant="standard"
                  size="small"
                  sx={{ width: 150 }}
                  value={priority}
                  onChange={handlePriorityChange}
                >
                  {priorityOptions.map((one, idx) => (
                    <MenuItem key={idx} value={one}>
                      {one}
                    </MenuItem>
                  ))}
                </TextField>
              ),
            },
            {
              label: 'URL',
              value: (
                <Tooltip title={ticket.URL.length > 20 && ticket.URL}>
                  {' '}
                  {ticket.URL.length > 20 ? `${ticket.URL.slice(0, 20)}..` : ticket.URL}
                </Tooltip>
              ),
            },
            {
              label: 'assigned to',
              value: (
                <TextField
                  select
                  variant="standard"
                  size="small"
                  sx={{ width: 150 }}
                  value={assignedTo}
                  onChange={handleAssignedToChange}
                >
                  {usersData.map((one, idx) => (
                    <MenuItem key={idx} value={one._id}>
                      {one.email}
                    </MenuItem>
                  ))}
                </TextField>
              ),
            },
          ].map((item, idx) => (
            <>
              {/* {item.value && ( */}
              <Grid xs={12} md={6}>
                {/* {item.icon} */}
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.secondary',
                    mb: 0.5,
                    mr: 2,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.primary',
                    component: 'span',
                  }}
                />
              </Grid>
              {/* )} */}
            </>
          ))}
          <Grid xs={12}>
            {/* {item.icon} */}
            <ListItemText
              primary="details"
              secondary={ticket.details}
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
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  ticket: PropTypes.object,
  refetch: PropTypes.func,
};
