import { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import { toNotation } from '../constants/numbering';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  planned: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'default',
};

const performerName = (performedBy, isAr) => {
  if (!performedBy) return '—';
  if (typeof performedBy === 'string') return '—';
  const name = isAr
    ? performedBy.name_arabic || performedBy.name_english
    : performedBy.name_english || performedBy.name_arabic;
  return name || '—';
};

// ----------------------------------------------------------------------

export default function ProceduresPanel({ teethMap, numbering, lang }) {
  const isAr = lang === 'ar';

  const rows = useMemo(() => {
    const all = [];
    Object.values(teethMap || {}).forEach((tooth) => {
      (tooth.procedures || []).forEach((proc) => {
        all.push({ ...proc, fdi: tooth.fdi_number });
      });
    });
    return all.sort((a, b) => new Date(b.date_performed || 0) - new Date(a.date_performed || 0));
  }, [teethMap]);

  return (
    <PanelCard
      icon="solar:clipboard-text-bold"
      title={`${isAr ? 'الإجراءات' : 'Procedures'} (${rows.length})`}
    >
      {rows.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
          <Iconify icon="solar:clipboard-text-linear" width={28} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'لا توجد إجراءات بعد.' : 'No procedures added yet.'}
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{isAr ? 'السن' : 'Tooth'}</TableCell>
                <TableCell>{isAr ? 'الإجراء' : 'Procedure'}</TableCell>
                <TableCell>{isAr ? 'الحالة' : 'Status'}</TableCell>
                <TableCell>{isAr ? 'الطبيب' : 'Doctor'}</TableCell>
                <TableCell>{isAr ? 'التاريخ' : 'Date'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((proc) => (
                <TableRow key={proc._id || `${proc.fdi}-${proc.description}`}>
                  <TableCell sx={{ fontWeight: 600 }}>{toNotation(proc.fdi, numbering)}</TableCell>
                  <TableCell>
                    {(isAr && proc.description_arabic) || proc.description || '—'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="soft"
                      label={proc.status || '—'}
                      color={STATUS_COLOR[proc.status] || 'default'}
                    />
                  </TableCell>
                  <TableCell>{performerName(proc.performed_by, isAr)}</TableCell>
                  <TableCell>{proc.date_performed ? fDate(proc.date_performed) : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </PanelCard>
  );
}

ProceduresPanel.propTypes = {
  teethMap: PropTypes.object,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
