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

import { paths } from 'src/routes/paths';

import { useNewScreen } from 'src/hooks/use-new-screen';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetTaxes,
  // useGetDeductions,
  useGetUSActivities,
  useGetUSActiveServiceTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { handleAddNew } = useNewScreen();
  const { user } = useAuthContext();

  const myUS =
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service;

  const { serviceTypesData } = useGetUSActiveServiceTypes(myUS?._id, {
    select: '_id name_english name_arabic Price_per_unit',
  });
  const { activitiesData } = useGetUSActivities(myUS?._id);

  const { taxesData } = useGetTaxes();
  // const { deductionsData } = useGetDeductions();

  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  });

  const handleAdd = () => {
    append({
      service_type: null,
      activity: null,
      quantity: 1,
      price_per_unit: 0,
      subtotal: 0,
      discount_amount: 0,
      // deduction: 0,
      tax: 0,
      total: 0,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const values = watch();

  // when add item from address component - from activities -
  useEffect(() => {
    update();
  }, [values.items.length, update]);

  const subtotalOnRow = values.items.map((item) => item.subtotal);
  const subTotal = sum(subtotalOnRow);

  useEffect(() => {
    setValue('subtotal', subTotal);
  }, [setValue, subTotal]);

  const amountAfterDiscount = values.subtotal - values.discount;
  const taxData = taxesData.find((one) => one._id === values.taxes_type);
  // const deductionData = deductionsData.find((one) => one._id === values.deduction_type);
  const taxes = amountAfterDiscount * (taxData ? (taxData.percentage || 0) / 100 : 0);
  // const deduction =
  //   amountAfterDiscount * (deductionData ? (deductionData.percentage || 0) / 100 : 0);
  // const Amount = amountAfterDiscount + taxes + deduction;
  const Amount = amountAfterDiscount + taxes;

  useEffect(() => {
    setValue('taxes', taxes);
  }, [setValue, taxes]);
  // useEffect(() => {
  //   setValue('deduction', deduction);
  // }, [setValue, deduction]);
  useEffect(() => {
    setValue('totalAmount', Amount);
  }, [setValue, Amount]);

  const handleChangeItemDetails = useCallback(
    (event, index) => {
      if (event.target.name === `items[${index}].service_type`) {
        setValue(event.target.name, event.target.value);
        const selected = serviceTypesData?.find((service) => service._id === event.target.value);
        setValue(`items[${index}].price_per_unit`, selected?.Price_per_unit);
      } else {
        setValue(event.target.name, Number(event.target.value));
      }
      setValue(
        `items[${index}].subtotal`,
        values.items[index].quantity * values.items[index].price_per_unit
      );
      setValue(
        `items[${index}].total`,
        values.items[index].quantity * values.items[index].price_per_unit
      );
    },
    [setValue, values.items, serviceTypesData]
  );

  const renderTotal = (
    <>
      <Divider />
      <Stack
        my={1}
        gap={{ md: 2, xs: 1 }}
        direction={{ md: 'row' }}
        alignItems={{ md: 'center', xs: 'flex-end' }}
        sx={{ textAlign: 'right', typography: 'body2' }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={{ color: 'text.secondary' }}>{t('subtotal')}:</Box>
          <Box sx={{ typography: 'subtitle2' }}>
            <RHFTextField
              disabled
              type="number"
              name="subtotal"
              size="small"
              sx={{
                width: 160,
                [`& .${inputBaseClasses.input}`]: {
                  textAlign: { md: 'right' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Box sx={{ color: 'text.secondary' }}>{t('discount')}:</Box>
          <Box
            sx={{
              ...(values.discount && { color: 'error.main' }),
            }}
          >
            <RHFTextField
              type="number"
              name="discount"
              size="small"
              sx={{
                width: 160,
                [`& .${inputBaseClasses.input}`]: {
                  textAlign: { md: 'right' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        {myUS?.has_tax && (
          <Stack direction="row" alignItems="center" gap={1}>
            <Box sx={{ color: 'text.secondary' }}>{t('tax')}:</Box>
            <Box>
              <RHFSelect
                name="taxes_type"
                size="small"
                sx={{
                  width: 160,
                  [`& .${inputBaseClasses.input}`]: {
                    textAlign: { md: 'left' },
                  },
                }}
                // onChange={handleChangeOverall}
              >
                {taxesData.map((one, idx) => (
                  <MenuItem lang="ar" key={idx} value={one._id}>
                    {curLangAr ? one.name_arabic : one.name_english} {one.percentage}%
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>
          </Stack>
        )}

        {/* <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t('deduction')}</Box>
        <Box sx={{ width: 180 }}>
          <RHFSelect
            name="deduction_type"
            size="small"
            sx={{
              width: 160,
              [`& .${inputBaseClasses.input}`]: {
                textAlign: { md: 'left' },
              },
            }}
          // onChange={handleChangeOverall}
          >
            {deductionsData.map((one, idx) => (
              <MenuItem lang="ar" key={idx} value={one._id}>
                {curLangAr ? one.name_arabic : one.name_english} {one.percentage}%
              </MenuItem>
            ))}
          </RHFSelect>
        </Box>
      </Stack> */}

        <Stack direction="row" sx={{ typography: 'subtitle1' }} alignItems="center" gap={1}>
          <Box>{t('total')}:</Box>
          <Box>
            <RHFTextField
              disabled
              type="number"
              name="totalAmount"
              size="small"
              sx={{
                width: 160,
                [`& .${inputBaseClasses.input}`]: {
                  textAlign: { md: 'right' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>JOD</Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>
      </Stack>
      <Divider />
    </>
  );

  return (
    <>
      <Divider />
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
          {t('details')}:
        </Typography>

        <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={2}>
          {fields.map((item, index) => (
            <Stack key={item.id} alignItems="flex-start" spacing={1.5}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="flex-start"
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFSelect
                  name={`items[${index}].service_type`}
                  size="small"
                  label={t('service')}
                  sx={{ maxWidth: { md: 400 } }}
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => handleChangeItemDetails(event, index)}
                >
                  {serviceTypesData?.map((service) => (
                    <MenuItem lang="ar" key={service._id} value={service._id}>
                      {curLangAr ? service.name_arabic : service.name_english}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    lang="ar"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      fontWeight: 600,
                      // color: 'error.main',
                    }}
                    onClick={() => handleAddNew(paths.unitservice.tables.services.new)}
                  >
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      {t('Add new')}
                    </Typography>
                    <Iconify icon="material-symbols:new-window-sharp" />
                  </MenuItem>
                </RHFSelect>
                <RHFSelect
                  name={`items[${index}].activity`}
                  size="small"
                  label={t('activity')}
                  sx={{ maxWidth: { md: 200 } }}
                  InputLabelProps={{ shrink: true }}
                >
                  {activitiesData?.map((one) => (
                    <MenuItem lang="ar" key={one._id} value={one._id}>
                      {curLangAr ? one.name_arabic : one.name_english}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    lang="ar"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      fontWeight: 600,
                      // color: 'error.main',
                    }}
                    onClick={() => handleAddNew(paths.unitservice.tables.activities.new)}
                  >
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      {t('Add new')}
                    </Typography>
                    <Iconify icon="material-symbols:new-window-sharp" />
                  </MenuItem>
                </RHFSelect>

                <RHFTextField
                  size="small"
                  type="number"
                  name={`items[${index}].quantity`}
                  label={t('quantity')}
                  placeholder="0"
                  onChange={(event) => handleChangeItemDetails(event, index)}
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
                  label={t('price')}
                  placeholder="0.00"
                  // onChange={(event) => handleChangeItemDetails(event, index)}
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
                  name={`items[${index}].total`}
                  label={t('total')}
                  placeholder="0.00"
                  value={
                    values.items[index]?.total === 0 ? '' : values.items[index]?.total?.toFixed(2)
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
                <Button
                  size="small"
                  color="error"
                  tabIndex={-1}
                  onClick={() => handleRemove(index)}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ mt: 2, mb: 1, borderStyle: 'dashed' }} />

        <Stack
          spacing={3}
          mb={2}
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="flex-end"
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
    </>
  );
}
