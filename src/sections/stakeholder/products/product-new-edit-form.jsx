import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

// import {
//   _tags,
//   PRODUCT_SIZE_OPTIONS,
//   PRODUCT_GENDER_OPTIONS,
//   PRODUCT_COLOR_NAME_OPTIONS,
//   PRODUCT_CATEGORY_GROUP_OPTIONS,
// } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFUpload,
  RHFTextField,
} from 'src/components/hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useGetCurrencies } from 'src/api';
import { MenuItem } from '@mui/material';
import { useGetProductCategories } from 'src/api/product';

// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  // const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const { currencies } = useGetCurrencies()
  const { productCat } = useGetProductCategories()

  const NewProductSchema = Yup.object().shape({
    name_english: Yup.string().required('Name is required'),
    name_arabic: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    description_english: Yup.string().required('Description is required'),
    description_arabic: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    quantity: Yup.number().moreThan(0, 'Price should not be 0'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    currency: Yup.string(0).required('required field'),
    taxes: Yup.number(),
    status: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name_english: currentProduct?.name_english || '',
      name_arabic: currentProduct?.name_arabic || '',
      description_english: currentProduct?.description_english || '',
      description_arabic: currentProduct?.description_arabic || '',
      category: currentProduct?.category?._id || null,
      images: currentProduct?.images || [],
      //
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      // priceSale: currentProduct?.priceSale || 0,
      currency: currentProduct?.currency?._id || null,
      taxes: currentProduct?.taxes || 0,
      status: currentProduct?.status || 'draft',
      // sizes: currentProduct?.sizes || [],
    }),
    [currentProduct]
  );

  const methods = useForm({
    mode: 'onTouched',
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
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData()
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
        await axiosInstance.patch(endpoints.products.one(currentProduct?._id, formData))
      } else {
        await axiosInstance.post(endpoints.products.all, formData)
      }
      reset();
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
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

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name_english" label="Product Name" />
            <RHFTextField name="name_arabic" label="Product Name in arabic" />

            <RHFTextField name="description_english" label="English description" multiline rows={4} />
            <RHFTextField name="description_arabic" label="Arabic description" multiline rows={4} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              // onUpload={() => console.info('ON UPLOAD')}
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
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

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
              {/* <RHFTextField name="code" label="Product Code" />

              <RHFTextField name="sku" label="Product SKU" /> */}

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect name="category" label="Category" InputLabelProps={{ shrink: true }}>
                {productCat.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              /> */}

              {/* <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} /> */}
            </Box>

            {/* <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            {/* <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack> */}

            {/* <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack> */}
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
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Regular Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            <RHFSelect name="currency" label="currency" InputLabelProps={{ shrink: true }}>
              {currencies.map((one) => (
                <MenuItem key={one._id} value={one._id}>
                  {one.symbol || one.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            {/* <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            /> */}

            <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            />

            {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
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
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
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
