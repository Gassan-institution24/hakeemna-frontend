import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// ----------------------------------------------------------------------
// The rows of one sheet as the import understood them, with search, a filter by action
// (new / existing / already imported) and pagination — the patients sheet has thousands of rows.

const ACTION_COLOR = { new: 'success', existing: 'default', 'already imported': 'warning' };

export const fmtDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');
export const fmtMoney = (v) =>
  v === undefined || v === null || v === ''
    ? ''
    : Number(v).toLocaleString(undefined, { maximumFractionDigits: 3 });

export default function RowsTable({ rows, columns }) {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const actions = useMemo(() => [...new Set(rows.map((r) => r.action))], [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (action === 'all' || r.action === action) &&
        (!q ||
          columns.some((c) =>
            String(c.format ? c.format(r[c.id], r) : r[c.id] ?? '')
              .toLowerCase()
              .includes(q)
          ))
    );
  }, [rows, columns, search, action]);

  const pageRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack spacing={1.5} sx={{ mt: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
        <TextField
          size="small"
          placeholder="Search…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 240 }}
        />
        {actions.length > 1 && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={action}
            onChange={(_, v) => {
              if (v) {
                setAction(v);
                setPage(0);
              }
            }}
          >
            <ToggleButton value="all">All ({rows.length})</ToggleButton>
            {actions.map((a) => (
              <ToggleButton key={a} value={a}>
                {a} ({rows.filter((r) => r.action === a).length})
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </Stack>

      <TableContainer sx={{ maxHeight: 440, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.id} align={c.align || 'left'} sx={{ whiteSpace: 'nowrap' }}>
                  {c.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((r, i) => (
              <TableRow key={`${r.row ?? ''}-${i}`} hover>
                {columns.map((c) => (
                  <TableCell key={c.id} align={c.align || 'left'} sx={{ whiteSpace: 'nowrap' }}>
                    {c.id === 'action' ? (
                      <Chip
                        size="small"
                        variant="soft"
                        color={ACTION_COLOR[r.action] || 'default'}
                        label={r.action}
                      />
                    ) : (
                      (c.format ? c.format(r[c.id], r) : r[c.id]) ?? ''
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!pageRows.length && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                    No rows
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Stack>
  );
}

RowsTable.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
};
