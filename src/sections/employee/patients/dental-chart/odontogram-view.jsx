import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Stack,
  Button,
  Dialog,
  useTheme,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useGetdiagnosis } from 'src/api/diagnosis';
import { useGetDentalDiagnoses } from 'src/api/dental_diagnoses';

import XrayPanel from './components/xray-panel';
import DentalArch from './components/dental-arch';
import NotesPanel from './components/notes-panel';
import ToothModal from './components/tooth-modal';
import { toNotation } from './constants/numbering';
import useOdontogram from './hooks/use-odontogram';
import ChartHeader from './components/chart-header';
import ViewOptions from './components/view-options';
import ChartToolbar from './components/chart-toolbar';
import { getHiddenTeeth } from './constants/tooth-states';
import TreatmentPlanPanel from './components/treatment-plan-panel';
import { getOdontogramPalette } from './constants/odontogram-theme';
import ChiefComplaintPanel from './components/chief-complaint-panel';
import { CONDITIONS, setTableDiagnoses, setCustomConditions } from './constants/conditions';
import {
  ADULT_UPPER,
  ADULT_LOWER,
  CHILD_UPPER,
  CHILD_LOWER,
  getToothType,
} from './constants/fdi';

// ── Auto-fit configuration ───────────────────────────────────────────────────
// The arch sizes itself to the space it is given rather than to a manual zoom:
// 16 teeth across, so each crown takes a sixteenth of the usable width. Manual
// zoom controls existed only because the chart could not do this for itself.
//
// Width alone is not enough — on a wide but short window a width-fitted arch
// runs off the bottom — so the crown is bounded by the viewport height as well
// and the smaller of the two bounds wins. That is what keeps one chart legible
// on a laptop and a 27" monitor alike.
const CROWN_MIN = 34; // never so small the surfaces stop being clickable
const CROWN_MAX = 60; // never so large the arch outgrows a wide monitor
const ARCH_PADDING = 48; // container padding + the midline gap
const TOOTH_GAP = 2; // matches DentalArch GAP
const TOOTH_ASPECT = 90 / 40; // illustration height ÷ crown width, per DentalArch
const ARCH_ROWS = 2; // upper + lower
const ARCH_CHROME = 140; // jaw labels, FDI number rows, midline, padding
const VIEWPORT_SHARE = 0.72; // leave room for the toolbar and the panels below

// Build fdi → { role, extendLeft, extendRight } for the teeth in one arch,
// so each tooth knows whether to draw / extend the bridge beam to its neighbour.
function buildBridgeMap(teethOrder, bridges) {
  const map = {};
  if (!Array.isArray(bridges)) return map;
  bridges.forEach((b) => {
    const members = new Set(b.teeth || []);
    const pontics = new Set(b.pontics || []);
    teethOrder.forEach((fdi, i) => {
      if (!members.has(fdi)) return;
      map[fdi] = {
        role: pontics.has(fdi) ? 'pontic' : 'abutment',
        extendLeft: i > 0 && members.has(teethOrder[i - 1]),
        extendRight: i < teethOrder.length - 1 && members.has(teethOrder[i + 1]),
      };
    });
  });
  return map;
}

// Type-colored FDI numbers (incisor blue · canine red · premolar/molar green)
const NUMBER_COLORS = { incisor: '#1E88E5', canine: '#E53935', premolar: '#2E9E5B', molar: '#2E9E5B' };
const numberColor = (fdi) => NUMBER_COLORS[getToothType(fdi)] || 'text.disabled';

// Flanking permanent-molar ghosts shown around the primary arch (like paper charts)
const CHILD_GHOSTS = {
  upper: { leading: [18, 17, 16], trailing: [26, 27, 28] },
  lower: { leading: [48, 47, 46], trailing: [36, 37, 38] },
};

// ── Tooth number row between the arches ──────────────────────────────────────
function FdiRow({ teeth, midlineAfterIndex, cellWidth, leadingCount, trailingCount, numbering }) {
  const spacer = (n, side) =>
    Array.from({ length: n }).map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <Box key={`${side}-${i}`} sx={{ width: cellWidth, flexShrink: 0 }} />
    ));
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ gap: `${TOOTH_GAP}px`, px: 1, py: 0.3 }}
    >
      {spacer(leadingCount, 'l')}
      {teeth.map((fdi, idx) => (
        <Box key={fdi} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: cellWidth,
              textAlign: 'center',
              fontSize: '0.62rem',
              fontWeight: 700,
              color: numberColor(fdi),
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {toNotation(fdi, numbering)}
          </Box>
          {idx === midlineAfterIndex && (
            <Box sx={{ width: 11, flexShrink: 0 }} />
          )}
        </Box>
      ))}
      {spacer(trailingCount, 't')}
    </Stack>
  );
}

FdiRow.propTypes = {
  teeth: PropTypes.arrayOf(PropTypes.number).isRequired,
  midlineAfterIndex: PropTypes.number,
  cellWidth: PropTypes.number,
  leadingCount: PropTypes.number,
  trailingCount: PropTypes.number,
  numbering: PropTypes.string,
};

FdiRow.defaultProps = {
  cellWidth: 44,
  leadingCount: 0,
  trailingCount: 0,
  numbering: 'fdi',
};

// ── Color legend ──────────────────────────────────────────────────────────────
function Legend({ lang }) {
  const isAr = lang === 'ar';
  const shown = CONDITIONS.filter((c) => c.id !== 'healthy').slice(0, 10);
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.neutral',
      }}
    >
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {isAr ? 'دليل الألوان' : 'Color Legend'}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {shown.map((c) => (
          <Stack key={c.id} direction="row" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: 0.5,
                backgroundColor: c.color,
                border: `1.5px solid ${c.stroke}`,
                flexShrink: 0,
              }}
            />
            <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
              {isAr ? c.labelAr : c.label}
            </Typography>
          </Stack>
        ))}
        {/* Treatment status indicators */}
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,
              backgroundColor: 'transparent',
              border: '2px dashed #1565C0',
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            {isAr ? 'مخطط' : 'Planned'}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,
              backgroundColor: '#2E7D32',
              border: '2px solid #2E7D32',
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            {isAr ? 'مكتمل' : 'Completed'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

Legend.propTypes = { lang: PropTypes.string };

// ── Snapshot dialog ───────────────────────────────────────────────────────────
function SnapshotDialog({ open, onClose, onSave, lang }) {
  const isAr = lang === 'ar';
  const [label, setLabel] = useState('');

  const handleSave = () => {
    onSave(label || `Snapshot ${new Date().toLocaleString()}`);
    setLabel('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'حفظ لقطة' : 'Save Snapshot'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          size="small"
          label={isAr ? 'اسم اللقطة' : 'Snapshot label'}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">
          {isAr ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button variant="contained" size="small" onClick={handleSave}>
          {isAr ? 'حفظ' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SnapshotDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  lang: PropTypes.string,
};

// ── Main odontogram view ──────────────────────────────────────────────────────
export default function OdontogramView({
  patientId,
  chartData,
  lang,
  onSave,
  onSaveTooth,
  onAddProcedure,
  onDeleteProcedure,
  unitServiceId,
  visit,
  onAddChiefComplaint,
  onDeleteChiefComplaint,
  onUploadXray,
  onDeleteXray,
  onSnapshot,
  onChartTypeChange,
  onCreateBridge,
  onDeleteBridge,
  onAddNote,
  onDeleteNote,
}) {
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const muiTheme = useTheme();
  const odonPalette = getOdontogramPalette(muiTheme.palette.mode);

  // Display-only notation; the chart always stores FDI.
  const [numbering, setNumbering] = useState('fdi');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Auto-fit sizing ─────────────────────────────────────────────────────────
  // Crown size follows the container width, so hiding the sidebar or widening the
  // window makes the chart genuinely bigger instead of leaving empty space.
  // ── Clinic-defined diagnoses ────────────────────────────────────────────────
  // Registered into the condition catalogue during render, not in an effect: the
  // teeth read colours straight from that catalogue as they render, so an effect
  // would paint one frame of grey before the real colours landed.
  const { diagnoses: customDiagnoses } = useGetDentalDiagnoses(unitServiceId);

  useMemo(() => setCustomConditions(customDiagnoses), [customDiagnoses]);

  // The dental half of the diagnoses table (super admin → Tables → Diagnoses), offered in the
  // tooth dialog's diagnosis search.
  const { diagnosisData: tableDiagnoses } = useGetdiagnosis({ category: 'dental' });

  useMemo(() => setTableDiagnoses(tableDiagnoses), [tableDiagnoses]);

  const archRef = useRef(null);
  const [archWidth, setArchWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window === 'undefined' ? 0 : window.innerHeight
  );

  useEffect(() => {
    const el = archRef.current;
    if (!el) return undefined;

    const measure = () => setArchWidth(el.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The arch box is flex-sized, so its own height follows the card rather than
  // the screen; the viewport is what actually has to contain the chart.
  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const crownSize = useMemo(() => {
    // The widest arch is 16 teeth; sizing to that keeps adult and child charts
    // on the same scale instead of the primary arch ballooning.
    const usableWidth = Math.max(0, archWidth - ARCH_PADDING) - TOOTH_GAP * 15;
    if (usableWidth <= 0) return CROWN_MIN;
    const widthBound = usableWidth / 16;

    // Both arches plus their labels have to clear the fold, so the height bound
    // is what stops a wide-but-short window from pushing the lower jaw off-screen.
    const usableHeight = viewportHeight * VIEWPORT_SHARE - ARCH_CHROME;
    const heightBound = usableHeight / (ARCH_ROWS * TOOTH_ASPECT);

    // Floor, not round: rounding up can push the arch a couple of pixels past
    // the width it was just measured to fit into.
    const fitted = Math.min(widthBound, heightBound, CROWN_MAX);
    return Math.max(CROWN_MIN, Math.floor(fitted));
  }, [archWidth, viewportHeight]);

  // ── Jaw view filter: full | upper | lower ────────────────────────────────────
  const [jawFilter, setJawFilter] = useState('full');

  // Chart-level display toggles. Display-only — never saved, never sent to the
  // API. Defaults preserve how the chart rendered before they existed.
  const [viewOptions, setViewOptions] = useState({
    occlusal: false,
    showWisdom: true,
    showBone: false,
    showPulp: true,
  });
  const dimUpper = jawFilter === 'lower';
  const dimLower = jawFilter === 'upper';

  const showToast = useCallback(
    (message, severity = 'success') => {
      enqueueSnackbar(message, { variant: severity });
    },
    [enqueueSnackbar]
  );

  const {
    teethMap,
    selectedFdi,
    setSelectedFdi,
    chartType,
    setChartTypeLocal,
    isDirty,
    isSaving,
    multiSelect,
    setMultiSelect,
    selectedTeeth,
    clearSelection,
    bridges,
    handleToothClick,
    getToothData,
    updateToothData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useOdontogram({ chartData, onSave });

  const isAr = lang === 'ar';

    // Wisdom teeth are hidden in place rather than removed from the arch, so the
  // layout never re-centres and bridge spans stay aligned.
  const hiddenTeeth = useMemo(() => getHiddenTeeth(viewOptions), [viewOptions]);

  const upperTeeth = chartType === 'child' ? CHILD_UPPER : ADULT_UPPER;
  const lowerTeeth = chartType === 'child' ? CHILD_LOWER : ADULT_LOWER;
  const allTeeth = [...upperTeeth, ...lowerTeeth];
  const midIndex = chartType === 'child' ? 4 : 7;
  const upperGhosts = chartType === 'child' ? CHILD_GHOSTS.upper : { leading: [], trailing: [] };
  const lowerGhosts = chartType === 'child' ? CHILD_GHOSTS.lower : { leading: [], trailing: [] };

  const upperBridgeMap = buildBridgeMap(upperTeeth, bridges);
  const lowerBridgeMap = buildBridgeMap(lowerTeeth, bridges);
  const activeBridge = selectedFdi
    ? bridges.find((b) => (b.teeth || []).includes(selectedFdi))
    : null;

  // ── Create a bridge from the current multi-selection ──────────────────────────
  const handleCreateBridge = useCallback(async () => {
    if (!onCreateBridge) return;
    const order = [...upperTeeth, ...lowerTeeth];
    const ordered = order.filter((f) => selectedTeeth.has(f));
    if (ordered.length < 2) {
      showToast(isAr ? 'اختر سنّين على الأقل' : 'Select at least 2 teeth', 'error');
      return;
    }
    try {
      // Persist any pending paint edits first so the bridge refetch doesn't drop them.
      if (isDirty && onSave) await onSave(teethMap, chartType);
      await onCreateBridge(ordered);
      showToast(isAr ? 'تم إنشاء الجسر' : 'Bridge created');
      clearSelection();
      setMultiSelect(false);
    } catch (e) {
      showToast(isAr ? 'فشل إنشاء الجسر' : 'Failed to create bridge', 'error');
    }
  }, [onCreateBridge, upperTeeth, lowerTeeth, selectedTeeth, isDirty, onSave, teethMap, chartType, showToast, isAr, clearSelection, setMultiSelect]);

  const handleRemoveBridge = useCallback(
    async (bridgeId) => {
      if (!onDeleteBridge) return;
      try {
        await onDeleteBridge(bridgeId);
        showToast(isAr ? 'تمت إزالة الجسر' : 'Bridge removed');
        setSelectedFdi(null);
      } catch (e) {
        showToast(isAr ? 'فشل إزالة الجسر' : 'Failed to remove bridge', 'error');
      }
    },
    [onDeleteBridge, showToast, isAr, setSelectedFdi]
  );

  const handleChartTypeChange = useCallback(
    async (newType) => {
      setChartTypeLocal(newType);
      if (onChartTypeChange) {
        try {
          await onChartTypeChange(newType);
        } catch (e) {
          showToast(isAr ? 'فشل تغيير نوع المخطط' : 'Failed to switch chart type', 'error');
        }
      }
    },
    [setChartTypeLocal, onChartTypeChange, showToast, isAr]
  );

  const handleSaveNow = useCallback(async () => {
    if (!onSave) return;
    try {
      await onSave(teethMap, chartType);
    } catch (e) {
      showToast(isAr ? 'فشل الحفظ' : 'Save failed', 'error');
    }
  }, [onSave, teethMap, chartType, showToast, isAr]);

  const handleSnapshot = useCallback(() => {
    setSnapshotOpen(true);
  }, []);

  const handleSnapshotSave = useCallback(
    async (label) => {
      if (!onSnapshot) return;
      try {
        await onSnapshot(label);
        showToast(isAr ? 'تم حفظ اللقطة' : 'Snapshot saved');
      } catch (e) {
        showToast(isAr ? 'فشل حفظ اللقطة' : 'Snapshot failed', 'error');
      }
    },
    [onSnapshot, showToast, isAr]
  );

  const handleModalSave = useCallback(
    async (fdiNumber, payload, surfaceEdits) => {
      updateToothData(fdiNumber, payload);

      if (onSaveTooth) {
        try {
          await onSaveTooth(fdiNumber, payload, surfaceEdits);
        } catch (e) {
          showToast(isAr ? 'فشل الحفظ' : 'Save failed', 'error');
          throw e; // let the modal's handleSaveInfo catch and show the inline error
        }
      }
      // ToothModal closes itself once the save resolves; a rejection propagates
      // back to it so the dialog stays open and the edits survive.
    },
    [updateToothData, onSaveTooth, showToast, isAr]
  );

  const handleAddProcedure = useCallback(
    async (fdiNumber, payload) => {
      if (!onAddProcedure) return;
      try {
        await onAddProcedure(fdiNumber, payload);
        showToast(isAr ? 'تمت إضافة الإجراء' : 'Procedure added');
      } catch (e) {
        showToast(isAr ? 'فشل إضافة الإجراء' : 'Failed to add procedure', 'error');
      }
    },
    [onAddProcedure, showToast, isAr]
  );

  const handleDeleteProcedure = useCallback(
    async (fdiNumber, procId) => {
      if (!onDeleteProcedure) return;
      try {
        await onDeleteProcedure(fdiNumber, procId);
        showToast(isAr ? 'تم حذف الإجراء' : 'Procedure deleted');
      } catch (e) {
        showToast(isAr ? 'فشل حذف الإجراء' : 'Failed to delete procedure', 'error');
      }
    },
    [onDeleteProcedure, showToast, isAr]
  );

  const handleAddChiefComplaint = useCallback(
    async (payload) => {
      if (!onAddChiefComplaint) return;
      try {
        await onAddChiefComplaint(payload);
        showToast(isAr ? 'تمت إضافة الشكوى' : 'Chief complaint added');
      } catch (e) {
        showToast(isAr ? 'فشل إضافة الشكوى' : 'Failed to add chief complaint', 'error');
      }
    },
    [onAddChiefComplaint, showToast, isAr]
  );

  const handleDeleteChiefComplaint = useCallback(
    async (complaintId) => {
      if (!onDeleteChiefComplaint) return;
      try {
        await onDeleteChiefComplaint(complaintId);
        showToast(isAr ? 'تم حذف الشكوى' : 'Chief complaint deleted');
      } catch (e) {
        showToast(isAr ? 'فشل حذف الشكوى' : 'Failed to delete chief complaint', 'error');
      }
    },
    [onDeleteChiefComplaint, showToast, isAr]
  );

  // The panel surfaces its own inline error, so let the rejection propagate.
  const handleUploadXray = useCallback(
    async (phase, files) => {
      if (!onUploadXray) return;
      await onUploadXray(phase, files);
      showToast(isAr ? 'تم رفع الصورة' : 'X-ray uploaded');
    },
    [onUploadXray, showToast, isAr]
  );

  const handleDeleteXray = useCallback(
    async (xrayId) => {
      if (!onDeleteXray) return;
      try {
        await onDeleteXray(xrayId);
        showToast(isAr ? 'تم حذف الصورة' : 'X-ray deleted');
      } catch (e) {
        showToast(isAr ? 'فشل حذف الصورة' : 'Failed to delete x-ray', 'error');
      }
    },
    [onDeleteXray, showToast, isAr]
  );

  const chartCard = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        // A floor tall enough for the arch, but never taller than the screen —
        // a fixed 520 pushed the panels below the fold on short laptops.
        minHeight: { xs: 400, md: 480 },
        maxHeight: isFullscreen ? 'none' : '86vh',
        border: '1px solid',
        // Odontogram-Modul card treatment: hairline border, softer radius.
        borderColor: odonPalette.line,
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: odonPalette.card,
      }}
    >
      {/* Title, dentition toggles, numbering and fullscreen */}
      <ChartHeader
        chartType={chartType}
        onChartTypeChange={handleChartTypeChange}
        numbering={numbering}
        onNumberingChange={setNumbering}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((v) => !v)}
        lang={lang}
      />

      {/* Toolbar */}
      <ChartToolbar
        chartType={chartType}
        onChartTypeChange={handleChartTypeChange}
        jawFilter={jawFilter}
        onJawFilterChange={setJawFilter}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        isDirty={isDirty}
        isSaving={isSaving}
        multiSelect={multiSelect}
        onToggleMultiSelect={() => {
          setMultiSelect((v) => !v);
          clearSelection();
        }}
        selectedCount={selectedTeeth.size}
        onClearSelection={clearSelection}
        onCreateBridge={handleCreateBridge}
        bridges={bridges}
        onRemoveBridge={handleRemoveBridge}
        lang={lang}
      />

      {/* Display options — change how teeth are drawn, never the data */}
      <Box sx={{ borderBottom: '1px solid', borderColor: odonPalette.line }}>
        <ViewOptions
          viewOptions={viewOptions}
          onViewChange={setViewOptions}
          lang={lang}
        />
      </Box>

      {/* Body: arch area (diagnosis selection lives in the Diagnosis panel) */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Arch area — always LTR so the odontogram layout (teeth + FDI numbers)
            stays anatomically correct and identical in both Arabic and English. */}
        <Box
          ref={archRef}
          dir="ltr"
          sx={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            py: 1.5,
            px: 1,
            gap: 0,
            // Odontogram-Modul chart ground.
            backgroundColor: odonPalette.bg,
          }}
        >
          {/* Upper arch label */}
          <Typography
            variant="caption"
            sx={{ color: odonPalette.muted, mb: 0.5, letterSpacing: 1, fontSize: '0.65rem' }}
          >
            {isAr ? 'الفك العلوي' : 'Upper Jaw (Maxilla)'}
          </Typography>

          {/* Upper arch */}
          <DentalArch
            teeth={upperTeeth}
            teethMap={teethMap}
            hiddenTeeth={hiddenTeeth}
            viewOptions={viewOptions}
            isUpper
            midlineAfterIndex={midIndex}
            onSurfaceClick={handleToothClick}
            onDoubleClick={setSelectedFdi}
            selectedTeeth={selectedTeeth}
            multiSelect={multiSelect}
            dimmed={dimUpper}
            leadingGhosts={upperGhosts.leading}
            trailingGhosts={upperGhosts.trailing}
            lang={lang}
            crownSize={crownSize}
            bridgeMap={upperBridgeMap}
            bridges={bridges}
          />

          {/* Tooth numbers — upper */}
          <FdiRow
            teeth={upperTeeth}
            midlineAfterIndex={midIndex}
            cellWidth={crownSize}
            leadingCount={upperGhosts.leading.length}
            trailingCount={upperGhosts.trailing.length}
            numbering={numbering}
          />

          {/* Midline divider */}
          <Box
            sx={{
              width: '78%',
              height: '1px',
              backgroundColor: 'divider',
              my: 1,
            }}
          />

          {/* Tooth numbers — lower */}
          <FdiRow
            teeth={lowerTeeth}
            midlineAfterIndex={midIndex}
            cellWidth={crownSize}
            leadingCount={lowerGhosts.leading.length}
            trailingCount={lowerGhosts.trailing.length}
            numbering={numbering}
          />

          {/* Lower arch */}
          <DentalArch
            teeth={lowerTeeth}
            teethMap={teethMap}
            hiddenTeeth={hiddenTeeth}
            viewOptions={viewOptions}
            isUpper={false}
            midlineAfterIndex={midIndex}
            onSurfaceClick={handleToothClick}
            onDoubleClick={setSelectedFdi}
            selectedTeeth={selectedTeeth}
            multiSelect={multiSelect}
            dimmed={dimLower}
            leadingGhosts={lowerGhosts.leading}
            trailingGhosts={lowerGhosts.trailing}
            lang={lang}
            crownSize={crownSize}
            bridgeMap={lowerBridgeMap}
            bridges={bridges}
          />

          {/* Lower arch label */}
          <Typography
            variant="caption"
            sx={{ color: odonPalette.muted, mt: 0.5, letterSpacing: 1, fontSize: '0.65rem' }}
          >
            {isAr ? 'الفك السفلي' : 'Lower Jaw (Mandible)'}
          </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Legend lang={lang} />
    </Box>
  );

  return (
    <Stack gap={2}>
      {/* Chief complaint — what brought the patient in, so it reads first */}
      {!isFullscreen && (
        <ChiefComplaintPanel
          complaints={chartData?.chief_complaints}
          teeth={allTeeth}
          onAddComplaint={handleAddChiefComplaint}
          onDeleteComplaint={handleDeleteChiefComplaint}
          numbering={numbering}
          lang={lang}
        />
      )}

      {/* Chart — full width; the palette sits beneath it rather than beside it */}
      <Box
        sx={{
          ...(isFullscreen && {
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            p: 2,
            backgroundColor: 'background.default',
            overflow: 'auto',
          }),
        }}
      >
        {chartCard}
      </Box>

      {/* Treatment plan — full width; the table carries six columns */}
      {!isFullscreen && (
        <TreatmentPlanPanel
          teethMap={teethMap}
          teeth={allTeeth}
          onAddProcedure={handleAddProcedure}
          onDeleteProcedure={handleDeleteProcedure}
          unitServiceId={unitServiceId}
          visit={visit}
          numbering={numbering}
          lang={lang}
        />
      )}

      {!isFullscreen && (
        <NotesPanel
          notes={chartData?.note_entries}
          teeth={allTeeth}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          visit={visit}
          numbering={numbering}
          lang={lang}
        />
      )}

      {/* X-ray — compact rows; nothing renders until a row is opened */}
      {!isFullscreen && (
        <XrayPanel
          xrays={chartData?.xrays}
          onUploadXray={handleUploadXray}
          onDeleteXray={handleDeleteXray}
          visit={visit}
          numbering={numbering}
          lang={lang}
        />
      )}

      {/* Tooth detail modal */}
      {selectedFdi && (
        <ToothModal
          open={Boolean(selectedFdi)}
          fdiNumber={selectedFdi}
          toothData={getToothData(selectedFdi)}
          bridge={activeBridge}
          onClose={() => setSelectedFdi(null)}
          onSaveTooth={handleModalSave}
          onRemoveBridge={handleRemoveBridge}
          unitServiceId={unitServiceId}
          customDiagnoses={customDiagnoses}
          tableDiagnoses={tableDiagnoses}
          lang={lang}
        />
      )}

    </Stack>
  );
}

OdontogramView.propTypes = {
  patientId: PropTypes.string,
  chartData: PropTypes.object,
  lang: PropTypes.string,
  onSave: PropTypes.func,
  onSaveTooth: PropTypes.func,
  onAddProcedure: PropTypes.func,
  onDeleteProcedure: PropTypes.func,
  unitServiceId: PropTypes.string,
  visit: PropTypes.object,
  onAddChiefComplaint: PropTypes.func,
  onDeleteChiefComplaint: PropTypes.func,
  onUploadXray: PropTypes.func,
  onDeleteXray: PropTypes.func,
  onSnapshot: PropTypes.func,
  onChartTypeChange: PropTypes.func,
  onCreateBridge: PropTypes.func,
  onDeleteBridge: PropTypes.func,
  onAddNote: PropTypes.func,
  onDeleteNote: PropTypes.func,
};

OdontogramView.defaultProps = {
  lang: 'en',
};
