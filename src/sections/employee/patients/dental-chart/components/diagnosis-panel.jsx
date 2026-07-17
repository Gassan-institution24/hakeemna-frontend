import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import {
  Box,
  Menu,
  Stack,
  Button,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

import Iconify from 'src/components/iconify';

import { DIAGNOSES } from '../constants/conditions';

// ----------------------------------------------------------------------

// Every diagnosis currently recorded on the chart, whole-tooth or per-surface,
// with the teeth it appears on.
function collectApplied(teethMap) {
  const found = new Map();

  const add = (id, fdi) => {
    if (!id) return;
    if (!found.has(id)) found.set(id, new Set());
    found.get(id).add(fdi);
  };

  Object.values(teethMap || {}).forEach((tooth) => {
    add(tooth.whole_diagnosis, tooth.fdi_number);
    Object.values(tooth.surfaces || {}).forEach((surface) => add(surface?.diagnosis, tooth.fdi_number));
  });

  return found;
}

// ----------------------------------------------------------------------

export default function DiagnosisPanel({ teethMap, activeCondition, onSelect, onClear, lang }) {
  const isAr = lang === 'ar';
  const [search, setSearch] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const applied = useMemo(() => collectApplied(teethMap), [teethMap]);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return DIAGNOSES.filter((d) => applied.has(d.id)).filter((d) => {
      if (!query) return true;
      return `${d.label} ${d.labelAr}`.toLowerCase().includes(query);
    });
  }, [applied, search]);

  const unapplied = DIAGNOSES.filter((d) => !applied.has(d.id));

  let emptyText;
  if (applied.size === 0) {
    emptyText = isAr ? 'لا توجد تشخيصات بعد.' : 'No diagnoses added yet.';
  } else {
    emptyText = isAr ? 'لا نتائج مطابقة.' : 'No matching diagnoses.';
  }

  return (
    <Stack
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Iconify icon="solar:clipboard-list-bold" width={18} sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2">{isAr ? 'التشخيصات' : 'Diagnosis'}</Typography>
        </Stack>

        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" width={16} />}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          disabled={unapplied.length === 0}
        >
          {isAr ? 'إضافة' : 'Add Diagnosis'}
        </Button>
      </Stack>

      <Box sx={{ px: 2, pt: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? 'ابحث عن تشخيص...' : 'Search diagnosis...'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Iconify icon="eva:search-fill" width={18} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Stack sx={{ px: 2, py: 1.5, gap: 0.5, overflowY: 'auto', flex: 1 }}>
        {rows.length === 0 && (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
            <Iconify icon="solar:clipboard-list-linear" width={28} sx={{ color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary" textAlign="center">
              {emptyText}
            </Typography>
          </Stack>
        )}

        {rows.map((d) => {
          const teeth = [...(applied.get(d.id) || [])].sort((a, b) => a - b);
          const isActive = activeCondition === d.id;
          return (
            <Stack
              key={d.id}
              direction="row"
              alignItems="center"
              gap={1}
              onClick={() => onSelect(isActive ? null : d.id)}
              sx={{
                px: 1,
                py: 1,
                borderRadius: 1,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: isActive ? 'primary.main' : 'transparent',
                backgroundColor: isActive ? 'primary.lighter' : 'transparent',
                '&:hover': { backgroundColor: isActive ? 'primary.lighter' : 'action.hover' },
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  flexShrink: 0,
                  backgroundColor: d.color,
                  border: `1.5px solid ${d.stroke}`,
                }}
              />

              <Typography variant="body2" sx={{ flex: 1 }}>
                {isAr ? d.labelAr : d.label}
              </Typography>

              <Tooltip title={isAr ? `الأسنان: ${teeth.join('، ')}` : `Teeth: ${teeth.join(', ')}`}>
                <Typography variant="caption" color="text.secondary">
                  {teeth.length}
                </Typography>
              </Tooltip>

              <Tooltip title={isAr ? 'إزالة من كل الأسنان' : 'Remove from all teeth'}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear(d.id);
                  }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        })}
      </Stack>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        {unapplied.map((d) => (
          <MenuItem
            key={d.id}
            onClick={() => {
              onSelect(d.id);
              setMenuAnchor(null);
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                mr: 1,
                backgroundColor: d.color,
                border: `1.5px solid ${d.stroke}`,
              }}
            />
            <Typography variant="body2">{isAr ? d.labelAr : d.label}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {activeCondition && (
        <Typography
          variant="caption"
          sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', color: 'primary.main' }}
        >
          {isAr ? 'انقر على سن لتطبيق التشخيص.' : 'Click a tooth to apply this diagnosis.'}
        </Typography>
      )}
    </Stack>
  );
}

DiagnosisPanel.propTypes = {
  teethMap: PropTypes.object,
  activeCondition: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  lang: PropTypes.string,
};
