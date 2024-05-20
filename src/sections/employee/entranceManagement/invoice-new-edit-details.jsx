import sum from 'lodash/sum';
import { useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { fCurrency } from 'src/utils/format-number';

// import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useGetUSActiveServiceTypes } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
// import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  // const { currentLang } = useLocales();
  // const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();
  const { serviceTypesData } = useGetUSActiveServiceTypes(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id
  );

  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  const subtotalOnRow = values.items.map((item) => item.subtotal);
  const totalOnRow = values.items.map((item) => item.total);

  const subTotal = sum(subtotalOnRow);

  const totalAmount = sum(totalOnRow);

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  useEffect(() => {
    const total = values.items?.reduce((acc, one) => acc + (one.tax / 100) * one.subtotal, 0);
    setValue('taxes', total);

    const deductiontotal = values.items?.reduce(
      (acc, one) => acc + (one.deduction / 100) * one.subtotal,
      0
    );
    setValue('deduction', deductiontotal);

    const newTotal = values.items?.reduce((acc, one) => {
      const selected = serviceTypesData?.find((service) => service._id === one.service);
      return one.price !== Number(selected?.Price_per_unit) && selected
        ? acc + (Number(selected.Price_per_unit) - one.price) * one.quantity
        : acc;
    }, 0);
    setValue('discount', newTotal);
  }, [totalAmount, setValue, values.items, serviceTypesData]);

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

  // const handleClearService = useCallback(
  //   (index) => {
  //     resetField(`items[${index}].quantity`);
  //     resetField(`items[${index}].price`);
  //     resetField(`items[${index}].subtotal`);
  //     resetField(`items[${index}].tax`);
  //     resetField(`items[${index}].total`);
  //   },
  //   [resetField]
  // );

  const handleSelectService = useCallback(
    (index, option) => {
      const selected = serviceTypesData?.find((service) => service._id === option);
      setValue(`items[${index}].price`, selected?.Price_per_unit);
      setValue(
        `items[${index}].subtotal`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
      setValue(`items[${index}].tax`, selected?.tax?.percentage || 0);
      setValue(`items[${index}].deduction`, selected?.deduction?.percentage || 0);
      setValue(
        `items[${index}].total`,
        values.items.map(
          (item) =>
            item.subtotal * ((100 + item.tax) / 100) + item.subtotal * (item.deduction / 100)
        )[index]
      );
    },
    [setValue, values.items, serviceTypesData]
  );

  const handleChangeQuantity = useCallback(
    (event, index) => {
      setValue(`items[${index}].quantity`, Number(event.target.value));
      setValue(
        `items[${index}].subtotal`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
      setValue(
        `items[${index}].total`,
        values.items.map(
          (item) =>
            item.subtotal * ((100 + item.tax) / 100) + item.subtotal * (item.deduction / 100)
        )[index]
      );
    },
    [setValue, values.items]
  );

  const handleChangePrice = useCallback(
    (event, index) => {
      setValue(`items[${index}].price`, Number(event.target.value));
      setValue(
        `items[${index}].subtotal`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
      setValue(
        `items[${index}].total`,
        values.items.map(
          (item) =>
            item.subtotal * ((100 + item.tax) / 100) + item.subtotal * (item.deduction / 100)
        )[index]
      );
    },
    [setValue, values.items]
  );

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Discount</Box>
        <Box
          sx={{
            width: 160,
            ...(values.discount && { color: 'error.main' }),
          }}
        >
          {values.discount ? `- ${fCurrency(values.discount)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(subTotal) || '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{values.taxes ? fCurrency(values.taxes) : '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Deduction</Box>
        <Box sx={{ width: 160 }}>{values.deduction ? fCurrency(values.deduction) : '-'}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Details:
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
              {/* <RHFAutocomplete
                placeholder="type"
                name={`items[${index}].service`}
                label="Service"
                sx={{ width: '300px' }}
                size="small"
                InputLabelProps={{ shrink: true }}
                options={serviceTypesData.map((speciality) => speciality._id)}
                getOptionLabel={(option) =>
                  serviceTypesData?.find((one) => one._id === option)?.[
                    curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
                renderOption={(props, option, idx) => (
                  <li {...props} key={idx} value={option}>
                    {
                      serviceTypesData.find((one) => one._id === option)?.[
                        curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                  </li>
                )}
              /> */}
              <RHFSelect
                name={`items[${index}].service`}
                size="small"
                label="Service"
                sx={{ maxWidth: '450px' }}
                InputLabelProps={{ shrink: true }}
              >
                {serviceTypesData?.map((service) => (
                  <MenuItem
                    key={service._id}
                    value={service._id}
                    onClick={() => handleSelectService(index, service._id)}
                  >
                    {service.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].quantity`}
                label="Quantity"
                placeholder="0"
                onChange={(event) => handleChangeQuantity(event, index)}
                InputLabelProps={{ shrink: true }}
                sx={{ maxWidth: { md: 150 } }}
              />

              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].price`}
                label="Price"
                placeholder="0.00"
                onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 150 } }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`items[${index}].subtotal`}
                label="Subtotal"
                placeholder="0.00"
                value={
                  values.items[index].subtotal === 0 ? '' : values.items[index].subtotal.toFixed(2)
                }
                onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 150 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`items[${index}].tax`}
                label="tax"
                placeholder="00"
                // value={values.items[index].total === 0 ? '' : values.items[index].total.toFixed(2)}
                // onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 150 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`items[${index}].deduction`}
                label="deduction"
                placeholder="00"
                // value={values.items[index].total === 0 ? '' : values.items[index].total.toFixed(2)}
                // onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>%</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 150 },
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'right' },
                  },
                }}
              />
              <RHFTextField
                disabled
                size="small"
                type="number"
                name={`items[${index}].total`}
                label="Total"
                placeholder="0.00"
                value={values.items[index].total === 0 ? '' : values.items[index].total.toFixed(2)}
                // onChange={(event) => handleChangePrice(event, index)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { md: 150 },
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
          Add Item
        </Button>

        {/* <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1 }}
        >
          <RHFTextField
            disabled
            size="small"
            label="Discount"
            name="discount"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          />

          <RHFTextField
            disabled
            size="small"
            label="Tax"
            name="taxes"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          />
        </Stack> */}
      </Stack>

      {renderTotal}
    </Box>
  );
}
