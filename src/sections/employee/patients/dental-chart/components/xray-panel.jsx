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

/**
 * One x-ray as a single compact row.
 *
 * Deliberately renders no <img>: the panel used to show every radiograph inline,
 * which both dominated the page and pulled every file over the network on mount.
 * Pixels load only once a row is clicked and the viewer opens.
 */
function XrayRow({ xray, onOpen, onDelete, numbering, lang }) {
  const isAr = lang === 'ar';

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        px: 1,
        py: 0.6,
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'action.hover' },
        '&:hover .xray-actions': { opacity: 1 },
      }}
      onClick={() => onOpen(xray)}
    >
      <Iconify
        icon={xray.is_dicom ? 'healthicons:x-ray-outline' : 'solar:gallery-bold'}
        width={18}
        sx={{ color: 'text.secondary', flexShrink: 0 }}
      />

      <Typography variant="caption" noWrap sx={{ flex: 1, minWidth: 0 }}>
        {xray.filename || (isAr ? 'صورة' : 'image')}
      </Typography>

      {xray.is_dicom && (
        <Chip label="DICOM" size="small" color="info" sx={{ height: 17, fontSize: '0.58rem' }} />
      )}

      <Typography variant="caption" color="text.secondary" noWrap sx={{ flexShrink: 0 }}>
        {fDate(xray.taken_at)}
        {xray.tooth_fdi ? ` · ${toNotation(xray.tooth_fdi, numbering)}` : ''}
      </Typography>

      {onDelete && (
        <Box className="xray-actions" sx={{ opacity: 0, transition: 'opacity .2s', flexShrink: 0 }}>
          <Tooltip title={isAr ? 'حذف' : 'Delete'}>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                // The row itself opens the viewer; deleting must not do both.
                e.stopPropagation();
                onDelete(xray._id);
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={14} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Stack>
  );
}

XrayRow.propTypes = {
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
        <Stack gap={0.25}>
          {xrays.map((x) => (
            <XrayRow
              key={x._id}
              xray={x}
              onOpen={onOpen}
              onDelete={onDelete}
              numbering={numbering}
              lang={lang}
            />
          ))}
        </Stack>
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
