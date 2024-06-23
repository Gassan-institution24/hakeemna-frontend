import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { useTranslate } from 'src/locales';

import CheckoutCartProduct from './checkout-cart-product';

// ----------------------------------------------------------------------

export default function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  const { t } = useTranslate()
  const TABLE_HEAD = [
    { id: 'product', label: t('product') },
    { id: 'price', label: t('price') },
    { id: 'quantity', label: t('quantity') },
    { id: 'totalAmount', label: t('total price'), align: 'right' },
    { id: '' },
  ];
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row) => (
              <CheckoutCartProduct
                key={row._id}
                row={row}
                onDelete={() => onDelete(row._id)}
                onDecrease={() => onDecreaseQuantity(row._id)}
                onIncrease={() => onIncreaseQuantity(row._id)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}

CheckoutCartProductList.propTypes = {
  onDelete: PropTypes.func,
  products: PropTypes.array,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};
