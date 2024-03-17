import React from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

// import { useGetUser } from 'src/api/user';
// import { useAuthContext } from 'src/auth/hooks';

export default function ProfileFollowers() {
  // const { data } = useGetUser();
  // const [countdowns, setCountdowns] = useState({});

  // const { user } = useAuthContext();

  // useEffect(() => {
  //   if (data) {
  //     const currentDate = new Date();
  //     const countdownTimers = {};
  //     data.current_medications.forEach((med) => {
  //       const endDate = new Date(med.enddate);
  //       if (endDate > currentDate) {
  //         const intervalId = setInterval(() => {
  //           const now = new Date();
  //           const difference = endDate.getTime() - now.getTime();
  //           const millisecondsInDay = 1000 * 60 * 60 * 24;
  //           const daysDifference = Math.floor(difference / millisecondsInDay);
  //           setCountdowns((prevCountdowns) => ({
  //             ...prevCountdowns,
  //             [med.name]: daysDifference > 0 ? daysDifference : 0,
  //           }));
  //         }, 1000);
  //         countdownTimers[med.name] = intervalId;
  //       }

  //     });
  //       Object.values(countdownTimers).forEach((timerId) =>  clearInterval(timerId));

  //   }
  // }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="right">Frequently</TableCell>
            <TableCell align="right">Dose</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* <TableRow key={} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">{}</TableCell>
                <TableCell align="right">{}</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow> */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
