import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useRef, useMemo, useState } from 'react';

import {
  Box,
  Chip,
  Stack,
  Button,
  Tooltip,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import resolveFileUrl from 'src/utils/resolve-file-url';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import XrayViewerDialog from './xray-viewer-dialog';
import { toNotation } from '../constants/numbering';

// ----------------------------------------------------------------------

const PHASES = [
  { id: 'before', label: 'Before', labelAr: 'قبل' },
  { id: 'after', label: 'After', labelAr: 'بعد' },
];

// Plain images preview inline; DICOM needs cornerstone, so the tile shows a film
// icon and the file opens in the viewer instead.
const ACCEPTED = 'image/*,.dcm,.dicom,application/dicom';

// ----------------------------------------------------------------------

function XrayThumb({ xray, onOpen, onDelete, numbering, lang }) {
  const isAr = lang === 'ar';

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover .xray-actions': { opacity: 1 },
      }}
    >
      <Box
        onClick={() => onOpen(xray)}
        sx={{
          cursor: 'pointer',
          height: 108,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'common.black',
        }}
      >
        {xray.is_dicom ? (
          <Stack alignItems="center" gap={0.5}>
            <Iconify icon="healthicons:x-ray-outline" width={26} sx={{ color: 'common.white' }} />
            <Chip label="DICOM" size="small" color="info" sx={{ height: 18, fontSize: '0.6rem' }} />
          </Stack>
        ) : (
          <Box
            component="img"
            src={resolveFileUrl(xray.url)}
            alt={xray.filename || 'x-ray'}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      {onDelete && (
        <Box
          className="xray-actions"
          sx={{ position: 'absolute', top: 4, right: 4, opacity: 0, transition: 'opacity .2s' }}
        >
          <Tooltip title={isAr ? 'حذف' : 'Delete'}>
            <IconButton
              size="small"
              onClick={() => onDelete(xray._id)}
              sx={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                color: 'common.white',
                '&:hover': { backgroundColor: 'error.main' },
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={14} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        noWrap
        sx={{ display: 'block', px: 0.75, py: 0.5 }}
      >
        {fDate(xray.taken_at)}
        {xray.tooth_fdi ? ` · ${toNotation(xray.tooth_fdi, numbering)}` : ''}
      </Typography>
    </Box>
  );
}

XrayThumb.propTypes = {
  xray: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

function PhaseColumn({ phase, xrays, onUpload, onOpen, onDelete, numbering, lang }) {
  const isAr = lang === 'ar';
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFiles = async (event) => {
    const { files } = event.target;
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      await onUpload(phase.id, files);
    } catch (err) {
      enqueueSnackbar(err?.message || (isAr ? 'فشل الرفع' : 'Upload failed'), { variant: 'error' });
    } finally {
      setBusy(false);
      // Reset so re-picking the same file still fires onChange.
      event.target.value = '';
    }
  };

  return (
    <Stack
      gap={1}
      sx={{
        flex: 1,
        minWidth: 0,
        p: 1.5,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'background.neutral',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Typography variant="subtitle2">
          {isAr ? phase.labelAr : phase.label}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            ({xrays.length})
          </Typography>
        </Typography>

        {onUpload && (
          <Button
            size="small"
            variant="outlined"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            startIcon={
              busy ? <CircularProgress size={13} /> : <Iconify icon="eva:cloud-upload-fill" width={16} />
            }
          >
            {isAr ? 'رفع' : 'Upload'}
          </Button>
        )}

        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={ACCEPTED}
          onChange={handleFiles}
        />
      </Stack>

      {xrays.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 3, gap: 0.5 }}>
          <Iconify icon="healthicons:x-ray-outline" width={26} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'لا توجد صور.' : 'No images.'}
          </Typography>
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
          }}
        >
          {xrays.map((x) => (
            <XrayThumb
              key={x._id}
              xray={x}
              onOpen={onOpen}
              onDelete={onDelete}
              numbering={numbering}
              lang={lang}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
}

PhaseColumn.propTypes = {
  phase: PropTypes.object.isRequired,
  xrays: PropTypes.array,
  onUpload: PropTypes.func,
  onOpen: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function XrayPanel({ xrays, onUploadXray, onDeleteXray, numbering, lang }) {
  const isAr = lang === 'ar';
  const [viewing, setViewing] = useState(null);

  // Newest first within each phase, so the latest film is the first tile.
  const byPhase = useMemo(() => {
    const sorted = [...(xrays || [])].sort(
      (a, b) => new Date(b.taken_at || 0) - new Date(a.taken_at || 0)
    );
    return {
      before: sorted.filter((x) => x.phase === 'before'),
      after: sorted.filter((x) => x.phase === 'after'),
    };
  }, [xrays]);

  return (
    <PanelCard
      icon="healthicons:x-ray-outline"
      title={`${isAr ? 'الأشعة' : 'X-Ray'} (${(xrays || []).length})`}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems="stretch">
        {PHASES.map((phase) => (
          <PhaseColumn
            key={phase.id}
            phase={phase}
            xrays={byPhase[phase.id]}
            onUpload={onUploadXray}
            onOpen={setViewing}
            onDelete={onDeleteXray}
            numbering={numbering}
            lang={lang}
          />
        ))}
      </Stack>

      <XrayViewerDialog
        open={Boolean(viewing)}
        xray={viewing}
        onClose={() => setViewing(null)}
        numbering={numbering}
        lang={lang}
      />
    </PanelCard>
  );
}

XrayPanel.propTypes = {
  xrays: PropTypes.array,
  onUploadXray: PropTypes.func,
  onDeleteXray: PropTypes.func,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
