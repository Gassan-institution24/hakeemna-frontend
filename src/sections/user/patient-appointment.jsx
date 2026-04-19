// ----------------------------------------------------------------------
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';

// import { useAuthContext } from 'src/auth/hooks';
// import { useGetpatientAppointment } from 'src/api/user';

export default function ProfileFollowers() {
  // const { data } = useGetpatientAppointment();
  // const { user } = useAuthContext();
  return (
    <>
      <h4 style={{ color: 'green' }}>table number 1</h4>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">name</TableCell>
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
      <h4 style={{ color: 'red' }}>table number 2</h4>
      {/* مواعيد منتهية */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">name</TableCell>
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
