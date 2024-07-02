import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { Card, Container, CardHeader } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetCities } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function WatingRoom() {
  const { tableData } = useGetCities();
  return (
    <Container sx={{ my: 10 }}>
      <Card sx={{ width: 1 }}>
        <CardHeader title="Waiting management system" />

        <TableContainer sx={{ mt: 3, overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>In wating</TableCell>
                  <TableCell>Appointment time</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData?.map((row) => (
                  <CollapsibleTableRow key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Container>
  );
}

function CollapsibleTableRow({ row }) {
  const collapsible = useBoolean();

  return (
    <>
      <TableRow>
        <TableCell>test</TableCell>
        <TableCell>test</TableCell>
        <TableCell>test</TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 2 }} colSpan={6}>
          <IconButton
            size="small"
            color={collapsible.value ? 'inherit' : 'default'}
            onClick={collapsible.onToggle}
            sx={{ borderRadius: 0 }}
          >
            Blogs{' '}
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>

          <Collapse in={collapsible.value} unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                py: 2,
                m: 2,
                borderRadius: 1.5,
                ...(collapsible.value && {
                  boxShadow: (theme) => theme.customShadows.z20,
                }),
              }}
            >
              <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                History
              </Typography>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum
                        consequuntur, unde nobis ea totam placeat ad maiores, quibusdam dolore,
                        laborum dolores minus recusandae. Eius, voluptatibus ullam aut laudantium
                        praesentium dolorum!
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

CollapsibleTableRow.propTypes = {
  row: PropTypes.object,
};
