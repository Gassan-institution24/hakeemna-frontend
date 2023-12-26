import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useEffect, useCallback, useState, useRef } from 'react';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { _tags, _tourGuides, TOUR_SERVICE_OPTIONS } from 'src/_mock';
import { MenuItem } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
  RHFMultiCheckbox,
  RHFSelect,
} from 'src/components/hook-form';
import axiosHandler from 'src/utils/axios-handler';
import { useGetCities } from 'src/api/tables';
import { useGetStackholder } from 'src/api/user';
// ----------------------------------------------------------------------

export default function TourNewEditForm({ currentTour }) {
  const ref = useRef();
  const [error, setError] = useState();
  const [city, setCity] = useState();
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();
  const editfunc = (data) => {
    axiosHandler({
      setError,
      method: 'PATCH',
      path: `/api/suppliersoffers/${currentTour._id}`,
      data,
    });
  };
  const addfunc = (data) => {
    axiosHandler({
      setError,
      method: 'POST',
      path: '/api/suppliersoffers/',
      data,
    });
  };

  const { tableData } = useGetCities();
  const { stakeholder } = useGetStackholder();
  const stakeholdersMultiSelectOptions = stakeholder?.reduce((acc, data) => {
    acc.push({ value: data._id, label: data.stakeholder_name });
    return acc;
  }, []);

  const NewTourSchema = Yup.object().shape({
    Offer_name: Yup.string().required('Name is required'),
    Offer_comment: Yup.string().required('Content is required'),
    Offer_img: Yup.string().min(1, 'Images is required'),
    cities: Yup.string().nullable(),
    Offer_price: Yup.number(),
    //
    // tourGuides: Yup.array().min(1, 'Must have at least 1 guide'),
    Stakeholder: Yup.string().nullable(),
    Offer_start_date: Yup.date().required('Start date is required'),
    Offer_end_date: Yup.date().required('End date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      Offer_name: currentTour?.Offer_name || '',
      Offer_comment: currentTour?.Offer_comment || '',
      Offer_img: currentTour?.Offer_img || '',
      Offer_price: currentTour?.Offer_price || '',
      cities: currentTour?.cities?._id || null,
      //
      durations: currentTour?.durations || '',
      Stakeholder: currentTour?.Stakeholder?._id || null,
      Offer_start_date: currentTour?.Offer_start_date || null,
      Offer_end_date: currentTour?.Offer_end_date || null,
    }),
    [currentTour]
  );

  const methods = useForm({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTour) {
      reset(defaultValues);
    }
  }, [currentTour, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTour) {
        editfunc(data);
      } else {
        addfunc(data);
      }
      reset();
      enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.tour.root);
    } catch (err) {
      console.error(err);
    }
  });

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
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Name</Typography>
              <RHFTextField name="Offer_name" placeholder="Offer Name..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Price</Typography>
              <RHFTextField name="Offer_price" placeholder="Price..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFTextField name="Offer_comment" placeholder="Content..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              {/* <RHFUpload
                multiple
                thumbnail
                name="Offer_img"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />  */}
              {/* <RHFEditor simple name="" /> */}
              <RHFTextField name="Offer_img" placeholder="image..." />
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
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Available</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <DatePicker
                  name="Offer_start_date"
                  label="offer date"
                  onChange={(date) =>
                    methods.setValue('Offer_start_date', date, { shouldValidate: true })
                  }
                  // Parse the UTC date string to a JavaScript Date object
                  value={
                    methods.getValues('Offer_start_date')
                      ? new Date(methods.getValues('Offer_start_date'))
                      : null
                  }
                />
                <DatePicker
                  name="Offer_end_date"
                  label="offer date"
                  onChange={(date) =>
                    methods.setValue('Offer_end_date', date, { shouldValidate: true })
                  }
                  // Parse the UTC date string to a JavaScript Date object
                  value={
                    methods.getValues('Offer_end_date')
                      ? new Date(methods.getValues('Offer_end_date'))
                      : null
                  }
                />
              </Stack>
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">City</Typography>
              <RHFSelect
                fullWidth
                name="cities"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {tableData.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Stackholder</Typography>
              <RHFSelect
                fullWidth
                name="stakeholder"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {stakeholder.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.stakeholder_name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        /> */}

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentTour ? 'Create Tour' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

TourNewEditForm.propTypes = {
  currentTour: PropTypes.object,
};
