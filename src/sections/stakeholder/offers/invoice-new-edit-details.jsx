import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetStakeholderProducts } from 'src/api/product';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
// import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { t } = useTranslate()
  // const { currentLang } = useLocales();
  // const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();
  const { productsData } = useGetStakeholderProducts(user?.stakeholder?._id);

  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  // const values = watch();

  const handleAdd = () => {
    append({
      service: null,
      quantity: 1,
      price: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        {t('products')}:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={2}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="center"
              spacing={2}
              sx={{ width: 1 }}
            >
              <RHFSelect
                name={`products[${index}].product`}
                size="small"
                label={t("product")}
                sx={{ maxWidth: '450px' }}
                InputLabelProps={{ shrink: true }}
              >
                {productsData?.map((one) => (
                  <MenuItem key={one._id} value={one._id}>
                    {one.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                size="small"
                type="number"
                name={`products[${index}].price`}
                label={t("price")}
                placeholder="0"
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 150 } }}
              />
              <Button size="small" color="error" onClick={() => handleRemove(index)}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          {t('add item')}
        </Button>
      </Stack>
    </Box>
  );
}
