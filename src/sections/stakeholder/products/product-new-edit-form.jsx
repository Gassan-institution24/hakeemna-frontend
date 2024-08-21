import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetTaxes, useGetDeductions } from 'src/api';
import { useGetProductCategories } from 'src/api/product';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFUpload,
  RHFCheckbox,
  RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const { taxesData } = useGetTaxes();
  const { deductionsData } = useGetDeductions();
  const { productCat } = useGetProductCategories();

  const NewProductSchema = Yup.object().shape({
    name_english: Yup.string().required('Name is required'),
    name_arabic: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    description_english: Yup.string().required('Description is required'),
    description_arabic: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    quantity: Yup.number().moreThan(0, 'Price should not be 0'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    // currency: Yup.string(0).required('required field'),
    taxes: Yup.number(),
    status: Yup.string(),
    to_patients: Yup.bool(),
    to_unit_service: Yup.bool(),
  });

  const defaultValues = useMemo(
    () => ({
      stakeholder: currentProduct?.stakeholder || user?.stakeholder?._id,
      name_english: currentProduct?.name_english || '',
      name_arabic: currentProduct?.name_arabic || '',
      description_english: currentProduct?.description_english || '',
      description_arabic: currentProduct?.description_arabic || '',
      category: currentProduct?.category?._id || null,
      images: currentProduct?.images || [],
      //
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      // currency: currentProduct?.currency?._id || null,
      taxes: currentProduct?.taxes || 0,
      status: currentProduct?.status || 'published',
      to_patients: currentProduct?.to_patients || true,
      to_unit_service: currentProduct?.to_unit_service || true,
    }),
    [currentProduct, user?.stakeholder]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'images' && Array.isArray(data[key])) {
          data[key].forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        } else {
          formData.append(key, data[key]);
        }
      });
      if (currentProduct) {
        await axiosInstance.patch(endpoints.products.one(currentProduct?._id), formData);
      } else {
        await axiosInstance.post(endpoints.products.all, formData);
      }
      reset();
      enqueueSnackbar(currentProduct ? t('Update success!') : t('Create success!'));
      router.push(paths.stakeholder.products.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('details')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('Title, short description, image...')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('details')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name_english" label={t('product Name')} />
            <RHFTextField name="name_arabic" label={t('product Name in arabic')} />

            <RHFTextField
              name="description_english"
              label={t('english description')}
              multiline
              rows={4}
            />
            <RHFTextField
              name="description_arabic"
              label={t('arabic description')}
              multiline
              rows={4}
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">{t('images')}</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('properties')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('Additional functions and attributes...')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('properties')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFCheckbox
                name="to_patients"
                label={t('to patients')}
                onClick={() => setValue('to_patients', !values.to_patients)}
              />
              <RHFCheckbox
                name="to_unit_service"
                label={t('to units of service')}
                onClick={() => setValue('to_unit_service', !values.to_unit_service)}
              />
              <RHFTextField
                name="quantity"
                label={t('quantity')}
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect name="category" label={t('category')} InputLabelProps={{ shrink: true }}>
                {productCat.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {t('pricing')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('price related inputs')}
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title={t('pricing')} />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label={t('price')}
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      JOD
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction={{ md: 'row' }} gap={1}>
              <RHFSelect name="tax" label={t('tax')}>
                {taxesData.map((one, idx) => (
                  <MenuItem lang="ar" key={idx} value={one._id}>
                    {curLangAr ? one.name_arabic : one.name_english} {one.percentage}%
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="deduction" label={t('deduction')}>
                {deductionsData.map((one, idx) => (
                  <MenuItem lang="ar" key={idx} value={one._id}>
                    {curLangAr ? one.name_arabic : one.name_english} {one.percentage}%
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
            {/* <RHFSelect name="currency" label={t('currency')} InputLabelProps={{ shrink: true }}>
              {currencies.map((one) => (
                <MenuItem key={one._id} value={one._id}>
                  {one.symbol || one.name_english}
                </MenuItem>
              ))}
            </RHFSelect> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={values.status === 'published'}
              onChange={() =>
                setValue('status', values.status === 'published' ? 'draft' : 'published')
              }
              defaultChecked
            />
          }
          label={t('publish')}
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? t('create product') : t('save changes')}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
