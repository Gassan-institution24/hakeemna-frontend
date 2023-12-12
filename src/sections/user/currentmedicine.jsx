import React, { useState, useEffect } from 'react';
import { useGetUser } from 'src/api/user';
import axiosHandler from 'src/utils/axios-handler';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function ProfileFollowers() {
  const { data } = useGetUser();
  const [countdowns, setCountdowns] = useState({});


  
  useEffect(() => {
    if (data) {
      const currentDate = new Date();
      const countdownTimers = {};
      data.current_medications.forEach((med) => {
        const endDate = new Date(med.enddate);
        if (endDate > currentDate) {
          const intervalId = setInterval(() => {
            const now = new Date();
            const difference = endDate.getTime() - now.getTime();
            const millisecondsInDay = 1000 * 60 * 60 * 24;
            const daysDifference = Math.floor(difference / millisecondsInDay);
            setCountdowns((prevCountdowns) => ({
              ...prevCountdowns,
              [med.name]: daysDifference > 0 ? daysDifference : 0,
            }));
          }, 1000);
          countdownTimers[med.name] = intervalId;
        }
        
      });
        Object.values(countdownTimers).forEach((timerId) =>  clearInterval(timerId));
      
    }
  }, [data]);



  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Frequently</TableCell>
              <TableCell align="right">Dose</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.current_medications.map((med) => (
              <TableRow key={med.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{data.medicine.trade_name}</TableCell>
                <TableCell align="right">{med.frequently}</TableCell>
                <TableCell align="right">{med.dose}</TableCell>
                <TableCell align="right">{`${countdowns[med.name] !== undefined ? countdowns[med.name] : ''} Days`}</TableCell>
                <TableCell align="right">$ {data.medicine.price_1}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
