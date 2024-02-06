import PropTypes from 'prop-types';
import { Box, Divider, Typography } from '@mui/material';
import FinishedAppoinment from './apointmentsfinished';
import Currentappoinment from './apointmentscurrent';

export default function AppointmentData({ data }) {
  console.log(data);
  return (
    <Box>
      <Typography>Test</Typography>
      <Currentappoinment />
      <Divider />
      <Typography>Test</Typography>
      <FinishedAppoinment />
    </Box>
  );
}
AppointmentData.propTypes = {
  data: PropTypes.object,
};
