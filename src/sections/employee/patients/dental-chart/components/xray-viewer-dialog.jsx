import PropTypes from 'prop-types';

import {
  Box,
  Stack,
  Dialog,
  Divider,
  Tooltip,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import resolveFileUrl from 'src/utils/resolve-file-url';

import Iconify from 'src/components/iconify';

import DicomViewer from './dicom-viewer';
import { toNotation } from '../constants/numbering';

// ----------------------------------------------------------------------

// Full-screen viewer for a single radiograph. DICOM files go through cornerstone;
// everything else is a plain image.
export default function XrayViewerDialog({ open, xray, onClose, numbering, lang }) {
  const isAr = lang === 'ar';

  if (!xray) return null;

  const fileUrl = resolveFileUrl(xray.url);
  const phaseLabels = { before: isAr ? 'قبل' : 'Before', after: isAr ? 'بعد' : 'After' };
  const phaseLabel = phaseLabels[xray.phase] || xray.phase;

  const meta = [
    phaseLabel,
    xray.taken_at ? fDate(xray.taken_at) : null,
    xray.tooth_fdi ? `${isAr ? 'السن' : 'Tooth'} ${toNotation(xray.tooth_fdi, numbering)}` : null,
    xray.filename,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              {isAr ? 'صورة الأشعة' : 'X-Ray'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {meta}
            </Typography>
          </Box>

          <Stack direction="row" gap={0.5}>
            <Tooltip title={isAr ? 'فتح في نافذة جديدة' : 'Open in new tab'}>
              <IconButton size="small" component="a" href={fileUrl} target="_blank" rel="noopener">
                <Iconify icon="solar:download-minimalistic-bold" width={18} />
              </IconButton>
            </Tooltip>
            <IconButton size="small" onClick={onClose}>
              <Iconify icon="mingcute:close-line" width={18} />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 2 }}>
        {xray.is_dicom ? (
          <DicomViewer url={fileUrl} lang={lang} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'common.black',
              minHeight: 320,
            }}
          >
            <Box
              component="img"
              src={fileUrl}
              alt={xray.filename || 'x-ray'}
              sx={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }}
            />
          </Box>
        )}

        {xray.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {xray.notes}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

XrayViewerDialog.propTypes = {
  open: PropTypes.bool,
  xray: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
