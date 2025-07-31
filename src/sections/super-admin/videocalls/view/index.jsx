import PropTypes from 'prop-types';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Scrollbar from 'src/components/scrollbar';
import { fMinSec } from 'src/utils/format-time';

const TABLE_HEAD = [
  { id: 'code', label: 'code' },
  { id: 'unit_service', label: 'unit of service' },
  { id: 'employee', label: 'employee' },
  { id: 'patient_name', label: 'patient' },
  { id: 'work_group', label: 'work group' },
  { id: 'duration', label: 'duration' },
  { id: 'description', label: 'description' },
  { id: 'actions', label: '', align: 'right' },
];

function getSortedData(data, order, orderBy) {
  return data.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });
}

export default function VideoCallsTableView() {
  const [videoCalls, setVideoCalls] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('code');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = getSortedData(videoCalls, order, orderBy);

  return (
    <Container>
      <Card>
        <TableContainer>
          <Scrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.align || 'left'}>
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row, idx) => (
                  <TableRow hover key={row.code || idx}>
                    <TableCell align="center">{row.code}</TableCell>
                    <TableCell align="center">{row.unit_service?.name_english || '-'}</TableCell>
                    <TableCell align="center">{row.employee?.name_english || '-'}</TableCell>
                    <TableCell align="center">{row.patient?.name_english || '-'}</TableCell>
                    <TableCell align="center">{row.work_group?.name_english || '-'}</TableCell>
                    <TableCell align="center">{fMinSec(row.duration)}</TableCell>
                    <TableCell align="center">{row.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Container>
  );
}
