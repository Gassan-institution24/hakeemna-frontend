import PropTypes from 'prop-types';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  console.log('product', product);
  const { onAddToCart } = useCheckoutContext();

  const {
    _id,
    name_english,
    // name_arabic,
    description_english,
    // description_arabic,
    stakeholder,
    category,
    images,
    price,
    currency,
    quantity,
    priceSale,
    newLabel,
    saleLabel,
  } = product;

  const linkTo = paths.unitservice.products.info(_id);

  const handleAddCart = async () => {
    const newProduct = {
      ...product,
      quantity: 1,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabels = (newLabel?.enabled || saleLabel?.enabled) && (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
    >
      {newLabel?.enabled && (
        <Label variant="filled" color="info">
          {newLabel?.content}
        </Label>
      )}
      {saleLabel?.enabled && (
        <Label variant="filled" color="error">
          {saleLabel?.content}
        </Label>
      )}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {quantity > 0 && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={quantity <= 0 && 'Out of stock'} placement="bottom-end">
        <Image
          alt={name_english}
          src={images[0]}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(quantity <= 0 && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Stack direction='row' justifyContent='space-between' sx={{ width: 1 }}>
        <Stack>
          <Link component={RouterLink} href={linkTo} color="inherit" variant="subtitle1" noWrap>
            {name_english}
          </Link>
          <Typography variant="caption" pt={0} >
            {description_english}
          </Typography>
        </Stack>
        {category?.name_english && <Typography variant="body2" pt={0} >
          {category?.name_english}
        </Typography>}
      </Stack>
      {stakeholder?.name_english && <Typography variant="body2" pt={0} >
        {stakeholder?.name_english}
      </Typography>}

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* <ColorPreview colors={colors} /> */}

        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {priceSale && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(priceSale, currency?.symbol)}
            </Box>
          )}

          <Box component="span">{fCurrency(price, currency?.symbol)}</Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {renderLabels}

      {renderImg}

      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
