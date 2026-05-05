import { useState } from 'react';
import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Stack,
  Drawer,
  Button,
  Switch,
  Divider,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';

import { useTranslate } from '../../../locales';
import Iconify from '../../../components/iconify';

// ─── Section Row ──────────────────────────────────────────────────────────────

function SectionRow({ section, onToggle, theme, t }) {
  const color = section.color;
  const palette = theme.palette[color] || theme.palette.primary;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        border: `1.5px solid`,
        borderColor: section.visible
          ? alpha(palette.main, 0.3)
          : alpha(theme.palette.divider, 0.18),
        bgcolor: section.visible ? alpha(palette.main, 0.05) : 'transparent',
        transition: 'all 0.22s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: alpha(palette.main, 0.5),
          bgcolor: alpha(palette.main, 0.08),
        },
      }}
      onClick={() => onToggle(section.key)}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: section.visible ? alpha(palette.main, 0.14) : alpha(theme.palette.text.disabled, 0.08),
          transition: 'background-color 0.22s ease',
        }}
      >
        <Iconify
          icon={section.icon}
          width={20}
          sx={{
            color: section.visible ? `${color}.main` : 'text.disabled',
            transition: 'color 0.22s ease',
          }}
        />
      </Box>

      {/* Text */}
      <Box flex={1} minWidth={0}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            color: section.visible ? 'text.primary' : 'text.disabled',
            transition: 'color 0.22s ease',
          }}
          noWrap
        >
          {t(section.labelKey)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: section.visible ? 'text.secondary' : 'text.disabled',
            transition: 'color 0.22s ease',
            display: 'block',
          }}
          noWrap
        >
          {t(section.descriptionKey)}
        </Typography>
      </Box>

      {/* Toggle */}
      <Switch
        size="small"
        checked={section.visible}
        onChange={() => onToggle(section.key)}
        onClick={(e) => e.stopPropagation()}
        color={color}
        sx={{ flexShrink: 0 }}
      />
    </Box>
  );
}

SectionRow.propTypes = {
  section: PropTypes.object,
  onToggle: PropTypes.func,
  theme: PropTypes.object,
  t: PropTypes.func,
};

// ─── Main Drawer ──────────────────────────────────────────────────────────────

export default function ProcessingCustomizer({ sections, onToggle, onReset }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { t } = useTranslate();

  const hiddenCount = sections.filter((s) => !s.visible).length;

  return (
    <>
      {/* ── Floating trigger button ── */}
      <Tooltip title={t('Customize view')} placement="left" arrow>
        <Box
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 100,
            zIndex: 1200,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
            }}
          >
            <IconButton
              onClick={() => setOpen(true)}
              sx={{
                width: 50,
                height: 50,
                bgcolor: 'background.paper',
                border: `1.5px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                color: 'primary.main',
                transition: 'all 0.22s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transform: 'scale(1.07)',
                },
              }}
            >
              <Iconify icon="solar:settings-bold-duotone" width={24} />
            </IconButton>

            {/* Badge showing how many sections are hidden */}
            {hiddenCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${theme.palette.background.paper}`,
                  pointerEvents: 'none',
                }}
              >
                {hiddenCount}
              </Box>
            )}
          </Box>
        </Box>
      </Tooltip>

      {/* ── Drawer ── */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: 380 },
            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            pb: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:settings-bold-duotone" width={20} sx={{ color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('Customize view')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('Choose what sections to display')}
                </Typography>
              </Box>
            </Stack>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <Iconify icon="solar:close-circle-bold" width={22} />
            </IconButton>
          </Stack>

          {/* Summary chips */}
          <Stack direction="row" spacing={1} mt={1.5} flexWrap="wrap" gap={0.8}>
            <Chip
              size="small"
              icon={<Iconify icon="solar:eye-bold" width={14} />}
              label={`${sections.filter((s) => s.visible).length} ${t('visible')}`}
              color="success"
              variant="soft"
              sx={{ fontWeight: 600, fontSize: '0.72rem' }}
            />
            {hiddenCount > 0 && (
              <Chip
                size="small"
                icon={<Iconify icon="solar:eye-closed-bold" width={14} />}
                label={`${hiddenCount} ${t('hidden')}`}
                color="default"
                variant="soft"
                sx={{ fontWeight: 600, fontSize: '0.72rem' }}
              />
            )}
          </Stack>
        </Box>

        {/* Section list */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={700}
            sx={{ letterSpacing: 1.2, display: 'block', mb: 1.5 }}
          >
            {t('Sections')}
          </Typography>

          <Stack spacing={1}>
            {sections.map((section) => (
              <SectionRow
                key={section.key}
                section={section}
                onToggle={onToggle}
                theme={theme}
                t={t}
              />
            ))}
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          {/* Non-customizable sections note */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.06),
              border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Iconify icon="solar:info-circle-bold" width={18} sx={{ color: 'info.main', mt: 0.1, flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary" lineHeight={1.6}>
                {t('Patient info and room navigation are always visible and cannot be hidden.')}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2.5,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            startIcon={<Iconify icon="solar:restart-bold" width={16} />}
            onClick={() => {
              onReset();
            }}
            sx={{ fontWeight: 600 }}
          >
            {t('Reset')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setOpen(false)}
            sx={{ fontWeight: 600 }}
          >
            {t('Done')}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ProcessingCustomizer.propTypes = {
  sections: PropTypes.array,
  onToggle: PropTypes.func,
  onReset: PropTypes.func,
};
