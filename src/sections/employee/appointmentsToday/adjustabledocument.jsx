import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeAdjustabledocument } from 'src/api/adjustabledocument';

import TestPage from './testPage';

export default function Adjustabledocument({ patient }) {
  const { t } = useTranslate();
  const dialog = useBoolean();
  const { user } = useAuthContext();
  const { adjustabledocument } = useGetEmployeeAdjustabledocument(user?.employee?._id);
  const [adjustabledocumentId, setadjustabledocumentId] = useState();
  console.log(adjustabledocumentId);

  const onSubmit = async () => {
    try {
      await axiosInstance.patch(`/api/patient/${patient?._id}`, { 
        adjustabledocument: adjustabledocumentId,
      });
      enqueueSnackbar('sick leave created successfully', { variant: 'success' });
      dialog.onFalse();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Card>
      <Box>
        <Typography sx={{ m: 2 }}>
          Choose an Adjustable document And send it to the patients
        </Typography>
        {adjustabledocument?.map((adjustabledocumentdata, i) => (
          <Button
            onClick={() => setadjustabledocumentId(adjustabledocumentdata?._id)}
            sx={{ m: 1 }}
            key={i}
          >
            - {adjustabledocumentdata?.title}
          </Button>
        ))}
      </Box>

      <Button type="submit" variant="contained" onClick={onSubmit} sx={{ m: 2 }}>
        {t('Upload')}
      </Button>
     
        <TestPage/>
   
    </Card>
  );
}
Adjustabledocument.propTypes = {
  patient: PropTypes.object,
};
