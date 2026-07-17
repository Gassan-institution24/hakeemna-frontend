import PropTypes from 'prop-types';

import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';

// ----------------------------------------------------------------------

const XRAY_TYPES = [
  { id: 'panoramic', label: 'Panoramic', labelAr: 'بانوراما', icon: 'healthicons:x-ray-outline' },
  { id: 'pa', label: 'PA', labelAr: 'ذروية', icon: 'healthicons:x-ray-outline' },
  { id: 'bitewing', label: 'Bitewing', labelAr: 'عضية', icon: 'healthicons:x-ray-outline' },
  { id: 'cbct', label: 'CBCT', labelAr: 'مقطعية', icon: 'healthicons:x-ray-outline' },
];

// ----------------------------------------------------------------------

// The dental chart model has no x-ray storage yet, so the types are shown but
// not selectable and nothing can be added.
export default function XrayPanel({ lang }) {
  const isAr = lang === 'ar';

  return (
    <PanelCard
      icon="healthicons:x-ray-outline"
      title={isAr ? 'الأشعة' : 'X-Ray'}
      action={
        <Tooltip title={isAr ? 'غير متاح بعد' : 'Not available yet'}>
          <span>
            <Chip
              size="small"
              variant="soft"
              label={isAr ? 'قريباً' : 'Coming soon'}
              color="default"
            />
          </span>
        </Tooltip>
      }
    >
      <Stack gap={2}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {XRAY_TYPES.map((type) => (
            <Stack
              key={type.id}
              alignItems="center"
              justifyContent="center"
              gap={0.5}
              sx={{
                flex: 1,
                minWidth: 64,
                py: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                opacity: 0.5,
              }}
            >
              <Iconify icon={type.icon} width={22} sx={{ color: 'primary.main' }} />
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                {isAr ? type.labelAr : type.label}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'لا توجد أشعة بعد.' : 'No x-rays added yet.'}
          </Typography>
        </Box>
      </Stack>
    </PanelCard>
  );
}

XrayPanel.propTypes = {
  lang: PropTypes.string,
};
