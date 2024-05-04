// import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import { Container } from '@mui/system';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Card, TableBody, CardHeader, IconButton } from '@mui/material';

// import Iconify from 'src/components/iconify';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// import { useTranslate } from 'src/locales';

export default function HistoryHead() {
  return (
    <Container sx={{ backgroundImage: 'linear-gradient(to bottom, #0562FD, white)', p: 2 }}>
      <Card sx={{ borderRadius: 0 }}>
        <CardHeader title="Adel History" />
        <TableContainer sx={{ mt: 3, overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>More Info</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>More Info</TableCell>
                  <TableCell>
                    <IconButton onclick={() => alert('test')}>
                      <Iconify
                        sx={{ cursor: 'pointer', color: '#0562FD', m: 0.5 }}
                        icon="carbon:view"
                      />
                    </IconButton>
                    <IconButton onclick={() => alert('test')}>
                      <Iconify
                        sx={{ cursor: 'pointer', color: 'error.main', m: 0.5 }}
                        icon="solar:trash-bin-trash-bold"
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
    </Container>
  );
}
