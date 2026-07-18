import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  Stack,
  Button,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';

import {
  DIAGNOSES,
  PROCEDURES,
  getCondition,
  CONDITION_GROUPS,
} from '../constants/conditions';

// ── Small color swatch ────────────────────────────────────────────────────────
function Swatch({ color, stroke, size = 14 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 0.5,
        backgroundColor: color,
        border: `1.5px solid ${stroke}`,
        flexShrink: 0,
      }}
    />
  );
}
Swatch.propTypes = { color: PropTypes.string, stroke: PropTypes.string, size: PropTypes.number };

const labelOf = (opt, lang) => (lang === 'ar' ? opt.labelAr : opt.label);
const groupLabel = (id, lang) => {
  const g = CONDITION_GROUPS.find((x) => x.id === id);
  if (!g) return id;
  return lang === 'ar' ? g.labelAr : g.label;
};

// A searchable condition picker shared by both dropdowns.
function ConditionSelect({ label, options, grouped, value, onChange, lang }) {
  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      onChange={(_, v) => onChange(v ? v.id : null)}
      getOptionLabel={(o) => labelOf(o, lang)}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      groupBy={grouped ? (o) => groupLabel(o.group, lang) : undefined}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
          <Swatch color={option.color} stroke={option.stroke} size={13} />
          <span style={{ fontSize: '0.8rem' }}>{labelOf(option, lang)}</span>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={lang === 'ar' ? 'بحث…' : 'Search…'}
          InputProps={{
            ...params.InputProps,
            startAdornment: value ? (
              <Box sx={{ pl: 0.5, display: 'flex' }}>
                <Swatch color={value.color} stroke={value.stroke} size={13} />
              </Box>
            ) : null,
          }}
        />
      )}
    />
  );
}

ConditionSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  grouped: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

// ── Main palette ──────────────────────────────────────────────────────────────
export default function ConditionPalette({ activeCondition, onSelect, lang }) {
  const isAr = lang === 'ar';
  const active = activeCondition ? getCondition(activeCondition) : null;
  const dxValue = DIAGNOSES.find((d) => d.id === activeCondition) || null;
  const procValue = PROCEDURES.find((p) => p.id === activeCondition) || null;
  const isEraser = activeCondition === 'healthy';

  return (
    <Box
      sx={{
        width: 230,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 1.5,
      }}
    >
      <Box>
        <Typography variant="subtitle2" fontWeight={700} fontSize="0.8rem">
          {isAr ? 'التشخيص والإجراءات' : 'Diagnosis & Procedures'}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize="0.68rem">
          {isAr ? 'اختر ثم اضغط على السن' : 'Pick one, then click a tooth'}
        </Typography>
      </Box>

      <ConditionSelect
        label={isAr ? 'التشخيص' : 'Diagnosis'}
        options={DIAGNOSES}
        value={dxValue}
        onChange={onSelect}
        lang={lang}
      />

      <ConditionSelect
        label={isAr ? 'الإجراء / التعويض' : 'Procedure / Restoration'}
        options={PROCEDURES}
        grouped
        value={procValue}
        onChange={onSelect}
        lang={lang}
      />

      <Button
        size="small"
        variant={isEraser ? 'contained' : 'outlined'}
        color="inherit"
        onClick={() => onSelect(isEraser ? null : 'healthy')}
      >
        {isAr ? 'مسح' : 'Clear'}
      </Button>

      {/* Active paint indicator */}
      {active && (
        <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'نشط:' : 'Active:'}
          </Typography>
          <Chip
            size="small"
            icon={<Box sx={{ ml: 0.75 }}><Swatch color={active.color} stroke={active.stroke} size={12} /></Box>}
            label={labelOf(active, lang)}
            onDelete={() => onSelect(null)}
            sx={{ fontSize: '0.7rem' }}
          />
        </Stack>
      )}
    </Box>
  );
}

ConditionPalette.propTypes = {
  activeCondition: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

ConditionPalette.defaultProps = {
  activeCondition: null,
  lang: 'en',
};
