import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetOrder } from 'src/api';
// import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';

import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';

// ----------------------------------------------------------------------

const ORDER_STATUS_OPTIONS = [
  // { value: 'pending', label: 'Pending' },
  // { value: 'processing', label: 'processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]
// ----------------------------------------------------------------------

export default function OrderDetailsView() {
  const { id } = useParams()
  const { orderData, refetch } = useGetOrder(id)
  const settings = useSettingsContext();

  const handleChangeStatus = useCallback(async (newValue) => {
    await axiosInstance.patch(endpoints.orders.one(id), { status: newValue })
    refetch()
  }, [id, refetch]);

  const handleChangeQuantity = useCallback(async (newValue) => {
    await axiosInstance.patch(endpoints.orders.one(id), { products: orderData.products.map((one) => Object.keys(newValue).includes(one._id) ? ({ ...one, real_delieverd_quantity: newValue[one._id] }) : one) })
    refetch()
  }, [id, refetch, orderData]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.unitservice.orders.root}
        orderNumber={orderData?.sequence_number}
        createdAt={orderData?.created_at}
        status={orderData?.status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={orderData?.products}
              onChangeQuantity={handleChangeQuantity}
              taxes={orderData?.taxes}
              shipping={orderData?.shipping}
              discount={orderData?.discount}
              subTotal={orderData?.subTotal}
              totalAmount={orderData?.totalAmount}
            />

            {/* <OrderDetailsHistory history={orderData?.history} /> */}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={orderData?.stakeholder}
            note={orderData?.note}
          // delivery={orderData?.delivery}
          // payment={orderData?.payment}
          // shippingAddress={orderData?.shippingAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

// OrderDetailsView.propTypes = {
//   orderData: PropTypes.object,
// };
