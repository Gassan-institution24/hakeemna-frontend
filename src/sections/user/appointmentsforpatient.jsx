import PropTypes from 'prop-types';

import { Box, Divider } from "@mui/material";
import FinishedAppoinment from "./apointmentsfinished";
import Currentappoinment from "./apointmentscurrent";

export default function AppointmentData({ data }) {
 console.log(data);
return(
  <Box>
  <FinishedAppoinment/>
  <Divider/>
  <Currentappoinment/>
</Box>
)
  
};
AppointmentData.propTypes = {
  data: PropTypes.object,
};
