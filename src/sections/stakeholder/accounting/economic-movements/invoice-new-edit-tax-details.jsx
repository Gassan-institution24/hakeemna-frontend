import { useFieldArray, useFormContext } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { fCurrency } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetStakeholderProducts } from 'src/api/product';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { productsData } = useGetStakeholderProducts(user?.stakeholder?._id, {
    populate: 'tax deduction',
  });

  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'products',
  });

  const values = watch();

  const [taxSums, setTaxSums] = useState({});
  const [deductionSums, setDeductionSums] = useState({});

  useEffect(() => {
    const newTaxSums = {};
    const newDeductionSums = {};

    productsData.forEach((product) => {
      const matchingItems = values.products.filter((item) => item.product === product._id);
      if (matchingItems.length) {
        matchingItems.forEach((item) => {
          const taxId = product?.tax?._id;
          const taxAmount =
            ((product.tax ? product.tax.percentage : 0) / 100) *
            (item.price_per_unit * item.quantity - item.discount_amount);
          if (taxAmount) {
            if (!newTaxSums[taxId]) {
              newTaxSums[taxId] = {
                name: curLangAr ? product?.tax?.name_arabic : product.tax?.name_english,
                value: 0,
              };
            }

            newTaxSums[taxId].value += taxAmount;
          }
          if (product.deduction) {
            const deductionId = product?.deduction?._id;
            const deductionAmount =
              ((product.deduction ? product.deduction.percentage : 0) / 100) *
              (item.price_per_unit * item.quantity - item.discount_amount);

            if (!newDeductionSums[deductionId]) {
              newDeductionSums[deductionId] = {
                name: curLangAr ? product.deduction?.name_arabic : product.deduction?.name_english,
                value: 0,
              };
            }

            newDeductionSums[deductionId].value += deductionAmount;
          }
        });
      }
    });

    setTaxSums(newTaxSums);
    setDeductionSums(newDeductionSums);
  }, [values, productsData, curLangAr]);

  const summedTaxes = useMemo(
    () =>
      Object.keys(taxSums).map((taxId) => ({
        name: taxSums[taxId].name,
        value: taxSums[taxId].value,
      })),
    [taxSums]
  );

  const summedDeductions = useMemo(
    () =>
      Object.keys(deductionSums).map((deductionId) => ({
        name: deductionSums[deductionId].name,
        value: deductionSums[deductionId].value,
      })),
    [deductionSums]
  );
  console.log('summedTaxes', summedTaxes);
  console.log('summedTaxes', summedDeductions);

  // useEffect(() => { setValue('taxSums', taxSums) }, [taxSums, setValue])
  // useEffect(() => { setValue('deductionSums', deductionSums) }, [deductionSums, setValue])

  // when add item from address component - from activities -
  useEffect(() => {
    update();
  }, [values.products.length, update]);

  const subTotal = values.products?.reduce((acc, one) => acc + one.subtotal, 0);
  const discountTotal = values.products?.reduce((acc, one) => acc + one.discount_amount, 0);
  const taxesTotal = values.products?.reduce(
    (acc, one) => acc + (one.tax / 100) * (one.subtotal - one.discount_amount),
    0
  );
  const deductiontotal = values.products?.reduce(
    (acc, one) => acc + (one.deduction / 100) * (one.subtotal - one.discount_amount),
    0
  );
  const totalAmount = values.products?.reduce((acc, one) => acc + one.total, 0);

  useEffect(() => {
    setValue('subtotal', subTotal);
  }, [subTotal, setValue]);
  useEffect(() => {
    setValue('discount', discountTotal);
  }, [discountTotal, setValue]);
  useEffect(() => {
    setValue('taxes', taxesTotal);
  }, [taxesTotal, setValue]);
  useEffect(() => {
    setValue('deduction', deductiontotal);
  }, [deductiontotal, setValue]);
  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [totalAmount, setValue]);

  const handleAdd = () => {
    append({
      product: null,
      quantity: 1,
      price_per_unit: 0,
      subtotal: 0,
      discount_amount: 0,
      deduction: 0,
      tax: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleSelectProduct = useCallback(
    (index, option) => {
      const selected = productsData?.find((product) => product._id === option);
      setValue(`products[${index}].price_per_unit`, selected?.price);
      setValue(
        `products[${index}].subtotal`,
        values.products[index].quantity * values.products[index].price_per_unit
      );
      setValue(`products[${index}].tax`, selected?.tax?.percentage || 0);
      setValue(`products[${index}].deduction`, selected?.deduction?.percentage || 0);
      const amountAfterDiscount =
        values.products[index].subtotal - values.products[index].discount_amount;
      const tax = amountAfterDiscount * (values.products[index].tax / 100);
      const deduction = amountAfterDiscount * (values.products[index].deduction / 100);
      const total = amountAfterDiscount + tax + deduction;
      // const total = amountAfterDiscount + tax;
      setValue(`products[${index}].total`, total);
    },
    [setValue, values.products, productsData]
  );

  const handleChange = useCallback(
    (event, index) => {
      setValue(event.target.name, Number(event.target.value));
      setValue(
        `products[${index}].subtotal`,
        values.products[index].quantity * values.products[index].price_per_unit
      );
      const amountAfterDiscount =
        values.products[index].subtotal - values.products[index].discount_amount;
      const tax = amountAfterDiscount * (values.products[index].tax / 100);
      const deduction = amountAfterDiscount * (values.products[index].deduction / 100);
      const total = amountAfterDiscount + tax + deduction;
      // const total = amountAfterDiscount + tax;
      setValue(`products[${index}].total`, total);
    },
    [setValue, values.products]
  );

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      {[
        { name: 'subtotal', value: values.subtotal },
        { name: 'discount', value: -values.discount, color: 'red' },
        ...summedTaxes,
        ...summedDeductions,
        // { name: 'taxes', value: values.taxes },
        // { name: 'deduction', value: values.deduction },
        {
          name: 'total',
          value: values.totalAmount,
          textColor: 'text.primary',
          typography: 'subtitle1',
        },
      ].map((one) => (
        <Stack direction="row">
          <Box sx={{ color: one.textColor || 'text.secondary', typography: one.typography }}>
            {t(one.name)}
          </Box>
          <Box sx={{ width: 160, typography: 'subtitle2', color: one.color }}>
            {one.value ? fCurrency(one.value) : '-'}
          </Box>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        {t('details')}:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={2}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-start" spacing={1.5}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="flex-end"
              spacing={2}
              sx={{ width: 1 }}
            >
              {/* <RHFAutocomplete
                placeholder="type"
                name={`products[${index}].product`}
                label="product"
                sx={{ width: { md: 300 } }}
                size="small"
                InputLabelProps={{ shrink: true }}
                options={productsData.map((speciality) => speciality._id)}
                getOptionLabel={(option) =>
                  productsData?.find((one) => one._id === option)?.[
                  curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
                renderOption={(props, option, idx) => (
                  <li lang='ar' {...props} key={idx} value={option}>
                    {
                      productsData.find((one) => one._id === option)?.[
                      curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                  </li>
                )}
              /> */}
              <RHFSelect
                name={`products[${index}].product`}
                size="small"
                label={t('product')}
                sx={{ maxWidth: { md: 300 } }}
                InputLabelProps={{ shrink: true }}
              >
                {productsData?.map((product) => (
                  <MenuItem
                    lang="ar"
                    key={product._id}
                    value={product._id}
                    onClick={() => handleSelectProduct(index, product._id)}
                  >
                    {curLangAr ? product.name_arabic : product.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField
                size="small"
                type="number"
                name={`products[${index}].quantity`}
                label={t('quantity')}
                placeholder="0"
                onChange={(event) => handleChange(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  maxWidth: { md: 200 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />

              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`products[${index}].price_per_unit`}
                label={t('price')}
                placeholder="0.00"
                // onChange={(event) => handleChange(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 200 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`products[${index}].subtotal`}
                label={t('subtotal')}
                placeholder="0.00"
                value={
                  values.products[index].subtotal === 0
                    ? ''
                    : values.products[index].subtotal.toFixed(2)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 200 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <Box width={65} />
            </Stack>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="flex-end"
              spacing={2}
              sx={{ width: 1 }}
            >
              <RHFTextField
                size="small"
                type="number"
                name={`products[${index}].discount_amount`}
                label={t('discount')}
                onChange={(event) => handleChange(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 200 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`products[${index}].tax`}
                label={t('tax')}
                placeholder="00"
                onChange={(event) => handleChange(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 200 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`products[${index}].deduction`}
                label={t('deduction')}
                placeholder="00"
                onChange={(event) => handleChange(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 200 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`products[${index}].total`}
                label={t('total')}
                placeholder="0.00"
                value={
                  values.products[index].total === 0 ? '' : values.products[index].total.toFixed(2)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 200 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
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

      {renderTotal}
    </Box>
  );
}
