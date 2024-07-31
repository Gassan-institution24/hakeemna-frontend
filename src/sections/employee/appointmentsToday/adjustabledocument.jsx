import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';

import { Box, Card, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeAdjustabledocument } from 'src/api/adjustabledocument';

export default function Adjustabledocument({ patient }) {
  const { t } = useTranslate();
  const dialog = useBoolean();
  const { user } = useAuthContext();
  const { adjustabledocument } = useGetEmployeeAdjustabledocument(user?.employee?._id);
  const [adjustabledocumentId, setadjustabledocumentId] = useState();
  const [clickedButtonId, setClickedButtonId] = useState(null);

  const onSubmit = async () => {
    try {
      await axiosInstance.post(`/api/instructions`, {
        patient: patient?._id,
        adjustable_documents: adjustabledocumentId,
      });
      enqueueSnackbar('adjustable document sent successfully', { variant: 'success' });
      dialog.onFalse();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleButtonClick = (id) => {
    setClickedButtonId(id);
    setadjustabledocumentId(id);
  };

  return (
    <Card sx={{ mt: 2 }}>
      <Box>
        <Typography sx={{ m: 2 }}>
          {t("Choose an Adjustable document And send it to the patients")}
        </Typography>
        {adjustabledocument?.map((adjustabledocumentdata, i) => (
          <Button
            onClick={() => handleButtonClick(adjustabledocumentdata?._id)}
            sx={{
              m: 1,
              backgroundColor:
                clickedButtonId === adjustabledocumentdata?._id ? 'info.main' : 'initial',
              color: clickedButtonId === adjustabledocumentdata?._id ? 'white' : 'initial',
            }}
            key={i}
          >
            - {adjustabledocumentdata?.title}
          </Button>
        ))}
      </Box>

      <Button type="submit" variant="contained" onClick={onSubmit} sx={{ m: 2 }}>
        {t('Upload')}
      </Button>
    </Card>
  );
}

Adjustabledocument.propTypes = {
  patient: PropTypes.object,
};
