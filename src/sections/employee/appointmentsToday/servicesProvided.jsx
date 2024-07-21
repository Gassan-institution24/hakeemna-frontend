import { useState } from 'react';
import { useParams } from 'react-router';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, Checkbox, Typography } from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetUSServiceTypes } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

export default function ServicesProvided() {
  const params = useParams();
  const { id } = params;
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [services, setServices] = useState([]);
  const { serviceTypesData } = useGetUSServiceTypes(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );

  const handleCheckboxChange = (serviceType, checked) => {
    setServices((prevServices) => {
      if (checked) {
        return [...prevServices, serviceType?._id];
      }
      return prevServices.filter((service) => service !== serviceType._id);
    });
  };

  const onSubmit = async () => {
    try {
      await axiosInstance.patch(`/api/entrance/${id}`, {
        Provided_service: services,
      });
      enqueueSnackbar('Sick leave created successfully', { variant: 'success' });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <Box>
        <Typography sx={{ m: 2 }}>Select the services you provided to the patient</Typography>
        {serviceTypesData?.map((serviceType) => (
          <Box key={serviceType._id} sx={{ m: 2 }}>
            {serviceType?.name_english}
            <Checkbox
              size="small"
              name="Provided_service"
              color="success"
              sx={{ position: 'relative' }}
              onChange={(e) => handleCheckboxChange(serviceType, e.target.checked)}
            />
          </Box>
        ))}
      </Box>

      <Button type="submit" variant="contained" onClick={onSubmit} sx={{ m: 2 }}>
        {t('Upload')}
      </Button>
    </Card>
  );
}
