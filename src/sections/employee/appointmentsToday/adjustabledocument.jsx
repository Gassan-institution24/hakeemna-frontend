import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeAdjustabledocument } from 'src/api/adjustabledocument';

export default function Adjustabledocument({ patient, unit_service_patient }) {
  const { t } = useTranslate();
  const dialog = useBoolean();
  const { user } = useAuthContext();
  const { adjustabledocument } = useGetEmployeeAdjustabledocument(user?.employee?._id);
  const [adjustabledocumentId, setadjustabledocumentId] = useState(null);

  const onSubmit = async () => {
    try {
      await axiosInstance.post(`/api/instructions`, {
        patient: patient?._id,
        unit_service_patient,
        adjustable_documents: adjustabledocumentId,
      });
      enqueueSnackbar('adjustable document sent successfully', { variant: 'success' });
      dialog.onFalse();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleButtonClick = (id) => {
    setadjustabledocumentId((prevId) => (prevId === id ? null : id));
  };

  return (
    <Card sx={{ mt: 2 }}>
      <Box>
        <Typography sx={{ m: 2 }}>
          {t('Choose an Adjustable document And send it to the patients')}
        </Typography>
        {adjustabledocument?.map((adjustabledocumentdata, i) => (
          <Button
            onClick={() => handleButtonClick(adjustabledocumentdata?._id)}
            sx={{
              m: 1,
              backgroundColor:
                adjustabledocumentId === adjustabledocumentdata?._id ? 'info.main' : 'initial',
              color: adjustabledocumentId === adjustabledocumentdata?._id ? 'white' : 'initial',
            }}
            key={i}
          >
            - {adjustabledocumentdata?.title}
          </Button>
        ))}
      </Box>

      <Button
        type="submit"
        variant="contained"
        onClick={onSubmit}
        disabled={!adjustabledocumentId} 
        sx={{ m: 2 }}
      >
        {t('Upload')}
      </Button>
    </Card>
  );
}

Adjustabledocument.propTypes = {
  patient: PropTypes.object,
  unit_service_patient: PropTypes.string,
};
