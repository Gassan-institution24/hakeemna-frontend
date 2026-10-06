import PropTypes from 'prop-types';

import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Chip,
  Link,
  Stack,
  Divider,
  Tooltip,
  IconButton,
  Typography,
} from '@mui/material';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import { statusOf, restorationLabel } from './lab-request-options';

// Pieces shared by the clinic's lab-request tab and the lab's public page, so
// both sides read the prescription the same way.

// ----------------------------------------------------------------------

export function LabStatusChip({ status, size = 'small' }) {
  const { t } = useTranslate();
  const one = statusOf(status);
  return <Chip size={size} color={one.color} variant="soft" label={t(one.label)} />;
}

LabStatusChip.propTypes = { status: PropTypes.string, size: PropTypes.string };

// ----------------------------------------------------------------------

function Field({ label, value }) {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) {
    return null;
  }
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="div">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>
        {value}
      </Typography>
    </Box>
  );
}

Field.propTypes = { label: PropTypes.node, value: PropTypes.any };

function Group({ title, icon, children }) {
  // Hide a group whose fields are all empty.
  const items = (Array.isArray(children) ? children : [children]).filter(
    (child) => child && child.props && child.props.value !== undefined && child.props.value !== null && child.props.value !== '' && !(Array.isArray(child.props.value) && !child.props.value.length)
  );
  if (!items.length) return null;
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <Iconify icon={icon} width={18} sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2">{title}</Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        {items}
      </Box>
    </Box>
  );
}

Group.propTypes = { title: PropTypes.node, icon: PropTypes.string, children: PropTypes.node };

const tr = (t, value) => (value ? t(value) : value);

export function LabRequestSummary({ request }) {
  const { t } = useTranslate();
  const teeth = (request.teeth || []).filter((one) => !(request.pontics || []).includes(one));

  return (
    <Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
      <Group title={t('Restoration')} icon="mdi:tooth-outline">
        <Field label={t('Restoration type')} value={t(restorationLabel(request.restoration_type))} />
        <Field label={t('Teeth (FDI)')} value={teeth.join(', ')} />
        <Field label={t('Pontics')} value={(request.pontics || []).join(', ')} />
        <Field label={t('Material')} value={tr(t, request.material)} />
        <Field label={t('Stage')} value={tr(t, request.stage)} />
      </Group>

      <Group title={t('Shade')} icon="solar:palette-bold-duotone">
        <Field label={t('Shade guide')} value={tr(t, request.shade_guide)} />
        <Field label={t('Body shade')} value={request.shade} />
        <Field label={t('Incisal shade')} value={request.shade_incisal} />
        <Field label={t('Cervical shade')} value={request.shade_cervical} />
        <Field label={t('Stump shade')} value={request.stump_shade} />
        <Field label={t('Translucency')} value={tr(t, request.translucency)} />
        <Field label={t('Characterization')} value={request.characterization} />
      </Group>

      <Group title={t('Design')} icon="solar:ruler-pen-bold-duotone">
        <Field label={t('Margin')} value={tr(t, request.margin_type)} />
        <Field label={t('Pontic design')} value={tr(t, request.pontic_design)} />
        <Field label={t('Occlusal contact')} value={tr(t, request.occlusal_contact)} />
        <Field label={t('Proximal contact')} value={tr(t, request.proximal_contact)} />
        <Field label={t('If clearance is insufficient')} value={tr(t, request.insufficient_clearance)} />
      </Group>

      <Group title={t('Implant')} icon="solar:screwdriver-bold-duotone">
        <Field label={t('Implant system')} value={request.implant_system} />
        <Field label={t('Platform / size')} value={request.implant_platform} />
        <Field label={t('Abutment')} value={tr(t, request.abutment_type)} />
        <Field
          label={t('Retention')}
          value={
            request.implant_retention &&
            t(request.implant_retention === 'screw' ? 'Screw-retained' : 'Cement-retained')
          }
        />
      </Group>

      <Group title={t('Denture')} icon="solar:smile-circle-bold-duotone">
        <Field label={t('Denture base')} value={tr(t, request.denture_base)} />
        <Field label={t('Teeth mould')} value={request.teeth_mould} />
      </Group>

      <Group title={t('Records sent')} icon="solar:box-bold-duotone">
        <Field label={t('Impression')} value={tr(t, request.impression_type)} />
        <Field
          label={t('Enclosures')}
          value={(request.enclosures || []).map((one) => t(one)).join('، ')}
        />
      </Group>

      {request.instructions && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify icon="solar:notes-bold-duotone" width={18} sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2">{t('Special instructions')}</Typography>
          </Stack>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {request.instructions}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

LabRequestSummary.propTypes = { request: PropTypes.object };

// ----------------------------------------------------------------------

const isImage = (one) =>
  (one.mimetype || '').startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(one.url || '');

export function LabRequestGallery({ images, onDelete, canDelete }) {
  const { t } = useTranslate();
  if (!images?.length) {
    return (
      <Typography variant="body2" color="text.disabled">
        {t('No images yet')}
      </Typography>
    );
  }
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      }}
    >
      {images.map((one) => (
        <Card key={one._id} variant="outlined" sx={{ position: 'relative', overflow: 'hidden' }}>
          <Link href={one.url} target="_blank" rel="noopener" underline="none">
            {isImage(one) ? (
              <Box
                component="img"
                src={one.url}
                alt={one.filename}
                loading="lazy"
                sx={{ width: 1, height: 120, objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={0.5}
                sx={{ height: 120, color: 'text.secondary', px: 1 }}
              >
                <Iconify icon="solar:file-bold-duotone" width={40} />
                <Typography variant="caption" noWrap sx={{ maxWidth: 1 }}>
                  {one.filename}
                </Typography>
              </Stack>
            )}
          </Link>
          <Box sx={{ p: 1 }}>
            <Chip
              size="small"
              variant="soft"
              color={one.source === 'lab' ? 'secondary' : 'info'}
              label={one.source === 'lab' ? t('Lab') : t('Clinic')}
              sx={{ height: 20, fontSize: 11 }}
            />
            {one.caption && (
              <Typography variant="caption" component="div" sx={{ mt: 0.5 }}>
                {one.caption}
              </Typography>
            )}
            <Typography variant="caption" color="text.disabled" component="div">
              {fDate(one.created_at, 'dd/MM/yyyy')}
            </Typography>
          </Box>
          {canDelete?.(one) && (
            <Tooltip title={t('Delete')}>
              <IconButton
                size="small"
                onClick={() => onDelete(one)}
                sx={(theme) => ({
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: alpha(theme.palette.grey[900], 0.48),
                  color: 'common.white',
                  '&:hover': { bgcolor: alpha(theme.palette.grey[900], 0.72) },
                })}
              >
                <Iconify icon="solar:trash-bin-trash-bold" width={16} />
              </IconButton>
            </Tooltip>
          )}
        </Card>
      ))}
    </Box>
  );
}

LabRequestGallery.propTypes = {
  images: PropTypes.array,
  onDelete: PropTypes.func,
  canDelete: PropTypes.func,
};

// ----------------------------------------------------------------------

export function LabRequestThread({ messages }) {
  const { t } = useTranslate();
  if (!messages?.length) {
    return (
      <Typography variant="body2" color="text.disabled">
        {t('No messages yet')}
      </Typography>
    );
  }
  return (
    <Stack spacing={1.5}>
      {messages.map((one) => {
        const fromLab = one.source === 'lab';
        return (
          <Box
            key={one._id}
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 1.5,
              maxWidth: '85%',
              alignSelf: fromLab ? 'flex-end' : 'flex-start',
              bgcolor: fromLab
                ? alpha(theme.palette.secondary.main, 0.08)
                : alpha(theme.palette.info.main, 0.08),
            })}
          >
            <Typography variant="caption" color="text.secondary" component="div">
              {fromLab ? t('Lab') : t('Clinic')}
              {one.author_name ? ` · ${one.author_name}` : ''} · {fDateTime(one.created_at)}
            </Typography>
            {one.status_change?.to ? (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Typography variant="body2">{t('Status changed to')}</Typography>
                <LabStatusChip status={one.status_change.to} />
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.25 }}>
                {one.text}
              </Typography>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

LabRequestThread.propTypes = { messages: PropTypes.array };
