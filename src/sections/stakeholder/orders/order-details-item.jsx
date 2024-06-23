import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function OrderDetailsItems({
  items,
  onChangeQuantity,
  taxes,
  shipping,
  discount,
  subTotal,
  totalAmount,
}) {
  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [quantities, setQuantities] = useState({})

  const total = items?.reduce((acc, one) => acc + one.price * one.real_delieverd_quantity, 0)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onChangeQuantity(quantities);
      setQuantities({});
    }
  };
  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ my: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>{t('total')}</Box>
        <Box sx={{ width: 160 }}>{fCurrency(total, items?.[0].currency?.symbol) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader
        title={t("details")}
      />

      <Stack
        sx={{
          px: 3,
        }}
      >
        <Scrollbar>
          {items?.map((item) => (
            <Stack
              key={item._id}
              direction="row"
              alignItems="center"
              sx={{
                py: 3,
                minWidth: 640,
                borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
              }}
            >
              <Avatar src={item?.product?.images?.[0]} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

              <ListItemText
                primary={curLangAr ? item?.product?.name_arabic : item?.product?.name_english}
                secondary={curLangAr ? item?.product?.category?.name_arabic : item?.product?.category?.name_english}
                primaryTypographyProps={{
                  typography: 'body2',
                }}
                secondaryTypographyProps={{
                  component: 'span',
                  color: 'text.disabled',
                  mt: 0.5,
                }}
              />

              {!quantities[item._id] &&
                <Box onClick={() => setQuantities({ [item._id]: item.real_delieverd_quantity })}
                  sx={{ typography: 'body2' }}>x{item.real_delieverd_quantity}</Box>
              }
              {quantities[item._id] && <TextField
                sx={{ width: 140 }}
                type='number'
                size='small'
                autoFocus
                value={quantities[item._id]}
                onChange={(e) => setQuantities({ [item._id]: e.target.value })}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => {
                        onChangeQuantity(quantities)
                        setQuantities({})
                      }} color='success' edge="end">
                        <Iconify
                          icon='ic:baseline-check'
                        />
                      </IconButton>
                      <IconButton onClick={() => setQuantities([])} edge="end">
                        <Iconify
                          icon='ic:twotone-close'
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />}

              <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
                {fCurrency(item.price, item.currency?.symbol)}
              </Box>
            </Stack>
          ))}
        </Scrollbar>

        {renderTotal}
      </Stack >
    </Card >
  );
}

OrderDetailsItems.propTypes = {
  discount: PropTypes.number,
  onChangeQuantity: PropTypes.func,
  items: PropTypes.array,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  taxes: PropTypes.number,
  totalAmount: PropTypes.number,
};
