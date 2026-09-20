import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useRef, useMemo, useState } from 'react';

import {
  Box,
  Chip,
  Stack,
  Paper,
  Dialog,
  Button,
  Divider,
  Tooltip,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import XrayViewerDialog from './xray-viewer-dialog';
import { toNotation } from '../constants/numbering';
import { idOf, splitByVisit } from '../constants/visit-scope';

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

// Radiographs from earlier appointments, newest visit first. Rows stay compact
// and load no pixels until one is opened — same contract as the panel itself.
function XrayHistoryDialog({ open, onClose, groups, onOpenXray, numbering, lang }) {
  const isAr = lang === 'ar';
  const total = groups.reduce((sum, group) => sum + group.rows.length, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'أشعة سابقة' : 'Previous x-rays'}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: 'background.neutral' }}>
        {groups.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6, gap: 1 }}>
            <Iconify icon="solar:history-linear" width={32} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              {isAr ? 'لا توجد أشعة سابقة.' : 'No previous x-rays on record.'}
            </Typography>
          </Stack>
        ) : (
          <Stack gap={2} sx={{ py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {isAr
                ? `${total} صورة عبر ${groups.length} زيارة`
                : `${total} images across ${groups.length} visits`}
            </Typography>

            {groups.map((group) => (
              <Paper
                key={group.key}
                variant="outlined"
                sx={{ borderRadius: 1.5, overflow: 'hidden', backgroundColor: 'background.paper' }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={1}
                  sx={{
                    px: 2,
                    py: 1.25,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.neutral',
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Iconify icon="solar:calendar-bold" width={16} sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle2">
                      {group.date ? fDate(group.date, 'dd MMM yyyy') : '—'}
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${group.rows.length} ${isAr ? 'صورة' : 'images'}`}
                  />
                </Stack>

                <Stack divider={<Divider flexItem />} sx={{ p: 1 }}>
                  {group.rows.map((xray) => (
                    <XrayRow
                      key={xray._id}
                      xray={xray}
                      onOpen={onOpenXray}
                      numbering={numbering}
                      lang={lang}
                    />
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} size="small">
          {isAr ? 'إغلاق' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

XrayHistoryDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  groups: PropTypes.array,
  onOpenXray: PropTypes.func.isRequired,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function XrayPanel({
  xrays,
  onUploadXray,
  onDeleteXray,
  visit,
  numbering,
  lang,
}) {
  const isAr = lang === 'ar';
  const [viewing, setViewing] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // In an appointment the panel shows only that appointment's films; everything
  // earlier moves behind the history button. Standalone, `current` is the lot.
  const { current, history: historyGroups } = useMemo(() => {
    const sorted = [...(xrays || [])].sort(
      (a, b) => new Date(b.taken_at || 0) - new Date(a.taken_at || 0)
    );
    return splitByVisit(
      sorted.map((xray) => ({ ...xray, visitId: idOf(xray.visit), date: xray.taken_at })),
      visit?.id
    );
  }, [xrays, visit?.id]);

  // Newest first within each phase, so the latest film is the first row.
  const byPhase = useMemo(
    () => ({
      before: current.filter((x) => x.phase === 'before'),
      after: current.filter((x) => x.phase === 'after'),
    }),
    [current]
  );

  const inVisit = Boolean(visit?.id);
  const visitTitle = isAr ? 'أشعة هذا الموعد' : "This appointment's x-rays";
  const plainTitle = isAr ? 'الأشعة' : 'X-Ray';
  const panelTitle = inVisit ? visitTitle : plainTitle;

  return (
    <PanelCard
      icon="healthicons:x-ray-outline"
      title={`${panelTitle} (${current.length})`}
      action={
        inVisit ? (
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="solar:history-bold" width={16} />}
            onClick={() => setHistoryOpen(true)}
            disabled={historyGroups.length === 0}
          >
            {isAr ? 'عرض السجل السابق' : 'Show old history'}
          </Button>
        ) : null
      }
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

      <XrayHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        groups={historyGroups}
        onOpenXray={setViewing}
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
  // The appointment being treated; its presence scopes the panel to that visit.
  visit: PropTypes.object,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
