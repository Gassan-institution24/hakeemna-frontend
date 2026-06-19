import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { CONDITIONS, CONDITION_GROUPS } from '../constants/conditions';

// ── Small color swatch ────────────────────────────────────────────────────────
function Swatch({ color, stroke }) {
  return (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: 0.5,
        backgroundColor: color,
        border: `1.5px solid ${stroke}`,
        flexShrink: 0,
      }}
    />
  );
}
Swatch.propTypes = { color: PropTypes.string, stroke: PropTypes.string };

// ── Single condition button ───────────────────────────────────────────────────
function ConditionButton({ condition, isActive, onClick, lang }) {
  const label = lang === 'ar' ? condition.labelAr : condition.label;

  return (
    <Tooltip title={label} placement="right" arrow>
      <Box
        onClick={() => onClick(isActive ? null : condition.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.2,
          py: 0.65,
          borderRadius: 1.5,
          cursor: 'pointer',
          backgroundColor: isActive ? `${condition.color}88` : 'transparent',
          border: isActive ? `2px solid ${condition.stroke}` : '2px solid transparent',
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: `${condition.color}55`,
          },
        }}
      >
        <Swatch color={condition.color} stroke={condition.stroke} />
        <Typography
          variant="caption"
          fontWeight={isActive ? 700 : 400}
          noWrap
          sx={{ fontSize: '0.72rem', lineHeight: 1.3 }}
        >
          {label}
        </Typography>
      </Box>
    </Tooltip>
  );
}

ConditionButton.propTypes = {
  condition: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

// ── Status selector (existing / planned) ─────────────────────────────────────
function StatusSelector({ value, onChange, lang }) {
  const isAr = lang === 'ar';
  return (
    <Box sx={{ px: 1, py: 0.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {isAr ? 'نوع العلاج' : 'Treatment Status'}
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(_, v) => v && onChange(v)}
        size="small"
        fullWidth
        sx={{ '& .MuiToggleButton-root': { fontSize: '0.68rem', py: 0.5 } }}
      >
        <ToggleButton value="existing">{isAr ? 'حالي' : 'Existing'}</ToggleButton>
        <ToggleButton value="planned">{isAr ? 'مخطط' : 'Planned'}</ToggleButton>
        <ToggleButton value="watch">{isAr ? 'مراقبة' : 'Watch'}</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

StatusSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

// ── Main palette ──────────────────────────────────────────────────────────────
export default function ConditionPalette({ activeCondition, activeStatus, onSelect, onStatusChange, lang }) {
  const isAr = lang === 'ar';

  return (
    <Box
      sx={{
        width: 175,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        pb: 2,
      }}
    >
      <Box sx={{ px: 1.5, py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={700} fontSize="0.8rem">
          {isAr ? 'الحالات السريرية' : 'Conditions'}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize="0.68rem">
          {isAr ? 'اضغط لتطبيق على السن' : 'Click to apply to tooth'}
        </Typography>
      </Box>

      {/* Status selector */}
      {/* <StatusSelector value={activeStatus} onChange={onStatusChange} lang={lang} /> */}

      {/* <Divider sx={{ mx: 1, my: 0.5 }} /> */}

      {/* Conditions by group */}
      {CONDITION_GROUPS.map((group) => {
        const groupConditions = CONDITIONS.filter((c) => c.group === group.id);
        return (
          <Box key={group.id}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{
                display: 'block',
                px: 1.5,
                pt: 1,
                pb: 0.3,
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              {isAr ? group.labelAr : group.label}
            </Typography>
            {groupConditions.map((cond) => (
              <ConditionButton
                key={cond.id}
                condition={cond}
                isActive={activeCondition === cond.id}
                onClick={onSelect}
                lang={lang}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
}

ConditionPalette.propTypes = {
  activeCondition: PropTypes.string,
  activeStatus: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

ConditionPalette.defaultProps = {
  activeCondition: null,
  activeStatus: 'existing',
  lang: 'en',
};
