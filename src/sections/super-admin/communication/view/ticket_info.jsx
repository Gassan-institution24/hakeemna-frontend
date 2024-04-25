import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

// import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import OrderDetailsHistory from '../order-details-history';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ ticket }) {
    const settings = useSettingsContext();

    const { enqueueSnackbar } = useSnackbar()

    const [status, setStatus] = useState(ticket.status);

    const handleChangeStatus = useCallback((newValue) => {
        try {
            axiosInstance.patch(endpoints.tickets.one(ticket._id), { status: newValue })
            setStatus(newValue);
            enqueueSnackbar('changed successfully!')
        } catch (error) {
            enqueueSnackbar(error.message)
        }
    }, [ticket._id, enqueueSnackbar]);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <OrderDetailsToolbar
                backLink={paths.superadmin.communication.root}
                ticket={ticket}
                status={status}
                onChangeStatus={handleChangeStatus}
                statusOptions={['pending', 'processing', 'waiting', 'completed', 'closed']}
            />

            <Grid container spacing={3}>
                <Grid xs={12} md={7}>
                    <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
                        <OrderDetailsInfo ticket={ticket} />
                        <OrderDetailsHistory history={ticket.history} />
                    </Stack>
                </Grid>

                <Grid xs={12} md={5}>
                    <OrderDetailsItems
                        items={ticket.items}
                        taxes={ticket.taxes}
                        shipping={ticket.shipping}
                        discount={ticket.discount}
                        subTotal={ticket.subTotal}
                        totalAmount={ticket.totalAmount}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

OrderDetailsView.propTypes = {
    ticket: PropTypes.object,
};
