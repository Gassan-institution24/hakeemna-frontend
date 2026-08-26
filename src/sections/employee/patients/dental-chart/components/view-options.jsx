import PropTypes from 'prop-types';
import { memo } from 'react';

import { Stack, Button, Tooltip, useTheme, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import { getOdontogramPalette } from '../constants/odontogram-theme';

// ----------------------------------------------------------------------

// Chart-level display toggles. Defaults match how the chart already renders:
// wisdom teeth and pulp shown, occlusal view and bone off.
//
// `defaultOn` records which toggles are on unless told otherwise, so an absent
// key reads as its default rather than as `false`.
const VIEW_TOGGLES = [
  {
    id: 'occlusal',
    defaultOn: false,
    label: 'Occlusal view (premolars & molars)',
    labelAr: 'العرض الإطباقي (الضواحك والأرحاء)',
    short: 'Occlusal',
    shortAr: 'إطباقي',
    icon: 'mdi:circle-outline',
  },
  {
    id: 'showWisdom',
    defaultOn: true,
    label: 'Wisdom teeth',
    labelAr: 'أضراس العقل',
    short: 'Wisdom',
    shortAr: 'العقل',
    icon: 'mdi:tooth-outline',
  },
  {
    id: 'showBone',
    defaultOn: false,
    label: 'Bone & gum',
    labelAr: 'العظم واللثة',
    short: 'Bone',
    shortAr: 'العظم',
    icon: 'mdi:layers-outline',
  },
  {
    id: 'showPulp',
    defaultOn: true,
    label: 'Pulp',
    labelAr: 'اللب',
    short: 'Pulp',
    shortAr: 'اللب',
    icon: 'mdi:water-outline',
  },
];

/**
 * Chart display options.
 *
 * Purely presentational: these change how every tooth is drawn and are never
 * persisted, never sent to the API, and invisible to the patient record.
 */
function ViewOptions({ viewOptions, onViewChange, lang }) {
  const isAr = lang === 'ar';
  const theme = useTheme();
  const palette = getOdontogramPalette(theme.palette.mode);

  const isOn = (opt) =>
    viewOptions?.[opt.id] === undefined ? opt.defaultOn : Boolean(viewOptions[opt.id]);

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5} sx={{ px: 2, py: 1 }}>
      <Typography variant="caption" fontWeight={700} sx={{ color: palette.muted, mr: 0.5 }}>
        {isAr ? 'العرض' : 'View'}
      </Typography>

      {VIEW_TOGGLES.map((opt) => {
        const on = isOn(opt);
        return (
          <Tooltip key={opt.id} title={isAr ? opt.labelAr : opt.label} placement="top" arrow>
            <Button
              size="small"
              variant={on ? 'contained' : 'outlined'}
              aria-pressed={on}
              onClick={() => onViewChange({ ...viewOptions, [opt.id]: !on })}
              startIcon={<Iconify icon={opt.icon} width={15} />}
              sx={{ fontSize: '0.68rem', py: 0.3, px: 0.9, minWidth: 0 }}
            >
              {isAr ? opt.shortAr : opt.short}
            </Button>
          </Tooltip>
        );
      })}

    </Stack>
  );
}

ViewOptions.propTypes = {
  viewOptions: PropTypes.object,
  onViewChange: PropTypes.func,
  lang: PropTypes.string,
};

ViewOptions.defaultProps = {
  viewOptions: {},
  onViewChange: () => {},
  lang: 'en',
};

export default memo(ViewOptions);
