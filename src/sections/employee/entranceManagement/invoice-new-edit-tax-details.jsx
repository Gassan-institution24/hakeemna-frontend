import { useEffect, useCallback, useMemo, useState } from 'react';
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

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUSActivities, useGetUSActiveServiceTypes, useGetTaxes, useGetDeductions } from 'src/api';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { user } = useAuthContext();

  const { serviceTypesData } = useGetUSActiveServiceTypes(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id
  );
  const { activitiesData } = useGetUSActivities(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id
  );

  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  const [taxSums, setTaxSums] = useState({});
  const [deductionSums, setDeductionSums] = useState({});

  useEffect(() => {
    const newTaxSums = {};
    const newDeductionSums = {};

    serviceTypesData.forEach((service) => {
      const matchingItems = values.items.filter((item) => item.service_type === service._id);
      if (matchingItems.length) {
        matchingItems.forEach((item) => {
          const taxId = service.tax._id;
          const taxAmount = (service.tax.percentage / 100) * (item.price_per_unit - item.discount_amount) * item.quantity;

          if (!newTaxSums[taxId]) {
            newTaxSums[taxId] = {
              name: curLangAr ? service.tax.name_arabic : service.tax.name_english,
              value: 0
            };
          }

          newTaxSums[taxId].value += taxAmount;

          if (service.deduction) {
            const deductionId = service.deduction._id;
            const deductionAmount = (service.deduction.percentage / 100) * (item.price_per_unit - item.discount_amount) * item.quantity;

            if (!newDeductionSums[deductionId]) {
              newDeductionSums[deductionId] = {
                name: curLangAr ? service.deduction.name_arabic : service.deduction.name_english,
                value: 0
              };
            }

            newDeductionSums[deductionId].value += deductionAmount;
          }
        });
      }
    });

    setTaxSums(newTaxSums);
    setDeductionSums(newDeductionSums);

  }, [values, serviceTypesData, curLangAr]);

  const summedTaxes = useMemo(() => (
    Object.keys(taxSums).map((taxId) => ({
      name: taxSums[taxId].name,
      value: taxSums[taxId].value
    }))
  ), [taxSums]);

  const summedDeductions = useMemo(() => (
    Object.keys(deductionSums).map((deductionId) => ({
      name: deductionSums[deductionId].name,
      value: deductionSums[deductionId].value
    }))
  ), [deductionSums]);

  // useEffect(() => { setValue('taxSums', taxSums) }, [taxSums, setValue])
  // useEffect(() => { setValue('deductionSums', deductionSums) }, [deductionSums, setValue])


  // when add item from address component - from activities -
  useEffect(() => { update() }, [values.items.length, update])

  const subTotal = values.items?.reduce((acc, one) => acc + one.subtotal, 0);
  const discountTotal = values.items?.reduce((acc, one) => acc + one.discount_amount, 0);
  const taxesTotal = values.items?.reduce((acc, one) => acc + (one.tax / 100) * (one.subtotal - one.discount_amount), 0);
  const deductiontotal = values.items?.reduce((acc, one) => acc + (one.deduction / 100) * (one.subtotal - one.discount_amount), 0);
  const totalAmount = values.items?.reduce((acc, one) => acc + one.total, 0);

  useEffect(() => { setValue('subtotal', subTotal) }, [subTotal, setValue])
  useEffect(() => { setValue('discount', discountTotal) }, [discountTotal, setValue])
  useEffect(() => { setValue('taxes', taxesTotal) }, [taxesTotal, setValue])
  useEffect(() => { setValue('deduction', deductiontotal) }, [deductiontotal, setValue])
  useEffect(() => { setValue('totalAmount', totalAmount) }, [totalAmount, setValue])



  const handleAdd = () => {
    append({
      service_type: null,
      activity: null,
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

  const handleSelectService = useCallback(
    (index, option) => {
      const selected = serviceTypesData?.find((service) => service._id === option);
      setValue(`items[${index}].price_per_unit`, selected?.Price_per_unit);
      setValue(
        `items[${index}].subtotal`, values.items[index].quantity * values.items[index].price_per_unit
      );
      setValue(`items[${index}].tax`, selected?.tax?.percentage || 0);
      setValue(`items[${index}].deduction`, selected?.deduction?.percentage || 0);
      const amountAfterDiscount = values.items[index].subtotal - values.items[index].discount_amount
      const tax = amountAfterDiscount * (values.items[index].tax / 100)
      const deduction = amountAfterDiscount * (values.items[index].deduction / 100)
      const total = amountAfterDiscount + tax + deduction
      setValue(`items[${index}].total`, total);
    },
    [setValue, values.items, serviceTypesData]
  );

  const handleChange = useCallback(
    (event, index) => {
      setValue(event.target.name, Number(event.target.value));
      setValue(
        `items[${index}].subtotal`, values.items[index].quantity * values.items[index].price_per_unit
      );
      const amountAfterDiscount = values.items[index].subtotal - values.items[index].discount_amount
      const tax = amountAfterDiscount * (values.items[index].tax / 100)
      const deduction = amountAfterDiscount * (values.items[index].deduction / 100)
      const total = amountAfterDiscount + tax + deduction
      setValue(`items[${index}].total`, total);
    },
    [setValue, values.items]
  );

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      {[{ name: 'subtotal', value: values.subtotal },
      { name: 'discount', value: -values.discount, color: 'red' },
      ...summedTaxes,
      ...summedDeductions,
      // { name: 'taxes', value: values.taxes },
      // { name: 'deduction', value: values.deduction },
      { name: 'total', value: values.totalAmount, textColor: 'text.primary', typography: 'subtitle1' }].map((one) => (
        <Stack direction="row">
          <Box sx={{ color: one.textColor || 'text.secondary', typography: one.typography }}>{t(one.name)}</Box>
          <Box sx={{ width: 160, typography: 'subtitle2', color: one.color }}>{one.value ? fCurrency(one.value) : '-'}</Box>
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
                name={`items[${index}].service`}
                label="Service"
                sx={{ width: { md: 300 } }}
                size="small"
                InputLabelProps={{ shrink: true }}
                options={serviceTypesData.map((speciality) => speciality._id)}
                getOptionLabel={(option) =>
                  serviceTypesData?.find((one) => one._id === option)?.[
                  curLangAr ? 'name_arabic' : 'name_english'
                  ]
                }
                renderOption={(props, option, idx) => (
                  <li lang='ar' {...props} key={idx} value={option}>
                    {
                      serviceTypesData.find((one) => one._id === option)?.[
                      curLangAr ? 'name_arabic' : 'name_english'
                      ]
                    }
                  </li>
                )}
              /> */}
              <RHFSelect
                name={`items[${index}].service_type`}
                size="small"
                label={t("service")}
                sx={{ maxWidth: { md: 400 } }}
                InputLabelProps={{ shrink: true }}
              >
                {serviceTypesData?.map((service) => (
                  <MenuItem
                    lang='ar'
                    key={service._id}
                    value={service._id}
                    onClick={() => handleSelectService(index, service._id)}
                  >
                    {curLangAr ? service.name_arabic : service.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                name={`items[${index}].activity`}
                size="small"
                label={t("activity")}
                sx={{ maxWidth: { md: 200 } }}
                InputLabelProps={{ shrink: true }}
              >
                {activitiesData?.map((one) => (
                  <MenuItem
                    lang='ar'
                    key={one._id}
                    value={one._id}
                  >
                    {curLangAr ? one.name_arabic : one.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField
                size="small"
                type="number"
                name={`items[${index}].quantity`}
                label={t("quantity")}
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
                name={`items[${index}].price_per_unit`}
                label={t("price")}
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
                name={`items[${index}].subtotal`}
                label={t("subtotal")}
                placeholder="0.00"
                value={
                  values.items[index].subtotal === 0 ? '' : values.items[index].subtotal.toFixed(2)
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
                name={`items[${index}].discount_amount`}
                label={t("discount")}
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
                name={`items[${index}].tax`}
                label={t("tax")}
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
                name={`items[${index}].deduction`}
                label={t("deduction")}
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
                name={`items[${index}].total`}
                label={t("total")}
                placeholder="0.00"
                value={values.items[index].total === 0 ? '' : values.items[index].total.toFixed(2)}
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
