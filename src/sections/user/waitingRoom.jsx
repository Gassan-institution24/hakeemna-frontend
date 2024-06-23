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
import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function WatingRoom() {
  const { tableData } = useGetCities();
  const { t } = useTranslate();
  return (
    <Container sx={{ my: 10 }}>
      <Card sx={{ width: 1 }}>
        <CardHeader title="Collapsible Table" />

        <TableContainer sx={{ mt: 3, overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
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
        <TableCell>
          <IconButton
            size="small"
            color={collapsible.value ? 'inherit' : 'default'}
            onClick={collapsible.onToggle}
          >
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          {row?.name}
        </TableCell>

        <TableCell align="right">{row?.calories}</TableCell>

        <TableCell align="right">{row?.fat}</TableCell>

        <TableCell align="right">{row?.carbs}</TableCell>

        <TableCell align="right">{row?.protein}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
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
