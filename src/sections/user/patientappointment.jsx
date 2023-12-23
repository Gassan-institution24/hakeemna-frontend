import { useState, useCallback } from 'react';
import { useGetpatientAppointment } from 'src/api/user';
// ----------------------------------------------------------------------
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAuthContext } from 'src/auth/hooks';
  
export default function ProfileFollowers() {
const { data } = useGetpatientAppointment();
const { user } = useAuthContext();
  return (
    <>
    <h4 style={{ color: 'green'}}>table number 1</h4>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell align="right">frequently</TableCell>
              <TableCell align="right">dose</TableCell>
              <TableCell align="right">duration</TableCell>
            </TableRow>
          </TableHead>
{/* 
          <TableBody>
            <TableRow key={data.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
          
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableBody> */}
        </Table>
      </TableContainer>
{/* مواعيد حاليه  */}
<h4 style={{ color: 'red'}}>table number 2</h4>
      {/* مواعيد منتهية */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell align="right">frequently</TableCell>
              <TableCell align="right">dose</TableCell>
              <TableCell align="right">duration</TableCell>
            </TableRow>
          </TableHead>

          {/* <TableBody>
            <TableRow key={} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableBody> */}
        </Table>
      </TableContainer>
    </>
  );
}
