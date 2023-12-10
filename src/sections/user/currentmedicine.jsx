import { useState,useEffect , useCallback } from 'react';
import { useGetUser } from 'src/api/user';
// ----------------------------------------------------------------------
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const currentDate = new Date();

export default function ProfileFollowers() {
  const { data } = useGetUser();
  function distanceToNow(date1) {
    const startdate = new Date(date1);
    const now = new Date();
    const difference = Math.abs(now.getTime() - startdate.getTime());
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.floor(difference / millisecondsInDay);

    return daysDifference;
  }
  function differenceBetweenDates(date1, date2) {
    const startdate = new Date(date1);
    const enddate = new Date(date2);
    const difference = Math.abs(enddate.getTime() - startdate.getTime());
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.floor(difference / millisecondsInDay);

    return daysDifference;
  }

   return (
    <>
       <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>name</TableCell>
            <TableCell align="right">frequently</TableCell>
            <TableCell align="right">dose</TableCell>
            <TableCell align="right">duration</TableCell>
            <TableCell align="right">price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.current_medications.map((med) => (
            <TableRow
              key={med.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{med.medicine.trade_name}</TableCell>
              <TableCell align="right">{med.frequently}</TableCell>
              <TableCell align="right">{med.dose}</TableCell>
              <TableCell align="right">{`${new Date(med.startdate) < currentDate && new Date(med.enddate) > currentDate  ? distanceToNow(med.enddate) :''} Days`} </TableCell>
              <TableCell align="right">$ {med.medicine.price_1}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>



    









  </>

  );    

}

//    <Typography variant="h4" sx={{ my: 5 }}>
//     current medicines
//    </Typography>
