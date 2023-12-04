import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import React,{ useMemo, useEffect, useCallback,useState } from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
// import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import FormControlLabel from '@mui/material/FormControlLabel';
import axiosHandler from 'src/utils/axios-handler';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';

import { countries } from 'src/assets/data';
import { _tags, _tourGuides, TOUR_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TourNewEditForm({ currentTour }) {

const [stakeholderInfo, setstakeholderInfo] = useState({});
const [errors, setError] = useState();
const [unitservice, setUnitservice] = useState([]);
const [cities, setCities] = useState([]);

function changeHandler(e) {
  const { name, value } = e.target;
  setstakeholderInfo({ ...stakeholderInfo, [name]: value });
}

useEffect(()=>{
  axiosHandler({setData:setUnitservice,setError,method:'GET',path:'employeetypes'})
},[])

useEffect(()=>{
  axiosHandler({setData:setCities,setError,method:'GET',path:'cities'})
},[])

const createOffer = async () => {
  await axiosHandler({
    setError,
    method: "POST",
    path: "suppliersoffers/",
    data: stakeholderInfo,
  });
};







  const router = useRouter();

  const mdUp = useResponsive('up', 'md');



  const NewTourSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    content: Yup.string().required('Content is required'),
    images: Yup.array().min(1, 'Images is required'),
    //
    tourGuides: Yup.array().min(1, 'Must have at least 1 guide'),
    durations: Yup.string().required('Duration is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    services: Yup.array().min(2, 'Must have at least 2 services'),
    destination: Yup.string().required('Destination is required'),
    startDate: Yup.date().nullable().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .test(
          'date-min',
          'End date must be later than start date',
          (value, { parent }) => value.getTime() > parent.startDate.getTime()
        ),
  });


  const defaultValues = useMemo(
    () => ({
      name: currentTour?.name || '',
      content: currentTour?.content || '',
      images: currentTour?.images || [],
      //
      tourGuides: currentTour?.tourGuides || [],
      tags: currentTour?.tags || [],
      durations: currentTour?.durations || '',
      destination: currentTour?.destination || '',
      services: currentTour?.services || [],
      available: {
        startDate: currentTour?.available.startDate || null,
        endDate: currentTour?.available.endDate || null,
      },
    }),
    [currentTour]
  );

  const methods = useForm({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    watch,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();


  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     reset();
  //     enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
  //     router.push(paths.dashboard.tour.root);
  //     console.info('DATA', data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });


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
          <Typography sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Add the offer details
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Name</Typography>
              <input name="Offer_name" onChange={changeHandler}/>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <input name="Offer_comment" onChange={changeHandler}/>
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Price</Typography>
              <input name="Offer_price" onChange={changeHandler}/>
            </Stack>

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
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
      {/* //////////////////////////////////////// */}
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
            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              employee type
              </Typography>
            
              <Box >
      <FormControl fullWidth>
        <Select>
          {unitservice.map((unit) => (
            <MenuItem key={unit._id} value={unit._id} name="employee_type">
              {unit.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>


            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Available</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                  name="Offer_start_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="Offer_end_date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">City</Typography>
              <Box >
      <FormControl fullWidth>
        <Select>
          {cities.map((unit) => (
            <MenuItem key={unit._id} value={unit._id}  name="cities">
              {unit.name_english}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
            </Stack>
          </Stack>
        </Card>
      </Grid>
      {/* ////////////////////////////////////////////////// */}
       {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentTour ? 'Create Offer' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );





  return (
    <FormProvider methods={methods} onSubmit={createOffer}>
      <Grid container spacing={3}>
        {renderDetails}
      </Grid>
    </FormProvider>
  );
}

TourNewEditForm.propTypes = {
  currentTour: PropTypes.object,
};




