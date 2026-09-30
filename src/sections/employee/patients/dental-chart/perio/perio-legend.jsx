import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

// What every mark on the periodontal chart means, including the GM sign
// convention (recession is entered as a positive number).
export default function PerioLegend() {
  const theme = useTheme();
  const { t } = useTranslate();

  const line = (color, dashed) => (
    <svg width={22} height={10} aria-hidden="true">
      <line x1={0} x2={22} y1={5} y2={5} stroke={color} strokeWidth={2} strokeDasharray={dashed ? '4 3' : undefined} />
    </svg>
  );
  const dot = (fill, stroke) => (
    <svg width={12} height={12} aria-hidden="true">
      <circle cx={6} cy={6} r={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
  const swatch = (color) => (
    <Box sx={{ width: 16, height: 12, borderRadius: 0.5, backgroundColor: alpha(color, 0.18), border: `1px solid ${alpha(color, 0.5)}` }} />
  );

  const items = [
    { icon: <b>PD</b>, text: t('Pocket Depth — probing depth in mm (1–15)') },
    { icon: <b>GM</b>, text: t('Gingival Margin — CEJ to margin in mm; recession +, enlargement −') },
    { icon: <b>CAL</b>, text: t('Clinical Attachment Level = PD + GM (calculated)') },
    { icon: line(theme.palette.primary.main), text: t('Gingival margin line') },
    { icon: line(theme.palette.error.main), text: t('Pocket bottom line') },
    { icon: line(theme.palette.text.disabled, true), text: t('CEJ reference') },
    { icon: dot(theme.palette.error.main, theme.palette.error.main), text: t('Bleeding on Probing (BOP)') },
    { icon: dot('none', theme.palette.warning.main), text: t('Suppuration (SUP)') },
    { icon: swatch(theme.palette.warning.main), text: t('PD 4–5 mm') },
    { icon: swatch(theme.palette.error.main), text: t('PD ≥ 6 mm') },
    { icon: <b>M1–3</b>, text: t('Mobility grade') },
    { icon: <b>F I–III</b>, text: t('Furcation involvement') },
  ];

  return (
    <Stack spacing={0.75}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          columnGap: 2,
          rowGap: 0.5,
        }}
      >
        {items.map((item) => (
          <Stack key={item.text} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ minWidth: 44, display: 'flex', justifyContent: 'center', fontSize: 11, color: 'text.secondary' }}>
              {item.icon}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {item.text}
            </Typography>
          </Stack>
        ))}
      </Box>
      <Typography variant="caption" color="text.disabled">
        {t('Keyboard: type a PD digit to move to the next site (type 1 then Enter for 1 mm), arrows to move, B = bleeding, S = suppuration.')}
      </Typography>
    </Stack>
  );
}
