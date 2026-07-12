import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import {
  Box,
  Stack,
  Alert,
  Button,
  Dialog,
  Snackbar,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { CONDITIONS } from './constants/conditions';
import {
  ADULT_UPPER,
  ADULT_LOWER,
  CHILD_UPPER,
  CHILD_LOWER,
  getToothType,
} from './constants/fdi';
import useOdontogram from './hooks/use-odontogram';
import ChartToolbar from './components/chart-toolbar';
import ConditionPalette from './components/condition-palette';
import DentalArch from './components/dental-arch';
import ToothModal from './components/tooth-modal';

// ── Zoom configuration ───────────────────────────────────────────────────────
const BASE_CROWN = 66; // px crown size at 100% (enlarged for readability)
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.8;
const ZOOM_STEP = 0.15;
const TOOTH_GAP = 2; // matches DentalArch GAP

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

// ── FDI number row between the arches ────────────────────────────────────────
function FdiRow({ teeth, midlineAfterIndex, cellWidth, leadingCount, trailingCount }) {
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
            {fdi}
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
};

FdiRow.defaultProps = {
  cellWidth: 44,
  leadingCount: 0,
  trailingCount: 0,
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
              backgroundColor: 'transparent',
              border: '2px dotted #F9A825',
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            {isAr ? 'مراقبة' : 'Watch'}
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
  onSnapshot,
  onChartTypeChange,
  onCreateBridge,
  onDeleteBridge,
}) {
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // ── Zoom ────────────────────────────────────────────────────────────────────
  const [zoom, setZoom] = useState(0.75); // default view at 75%
  const crownSize = Math.round(BASE_CROWN * zoom);
  const zoomIn = useCallback(() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2))), []);
  const zoomReset = useCallback(() => setZoom(1), []);

  // ── Jaw view filter: full | upper | lower ────────────────────────────────────
  const [jawFilter, setJawFilter] = useState('full');
  const dimUpper = jawFilter === 'lower';
  const dimLower = jawFilter === 'upper';

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const {
    teethMap,
    activeCondition,
    setActiveCondition,
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
    applyBulk,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useOdontogram({ chartData, onSave });

  const isAr = lang === 'ar';

  const upperTeeth = chartType === 'child' ? CHILD_UPPER : ADULT_UPPER;
  const lowerTeeth = chartType === 'child' ? CHILD_LOWER : ADULT_LOWER;
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
      // Modal stays open so handleSaveInfo can show the success alert.
      // The user closes it manually via the Close button.
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 600,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
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
        onSaveNow={handleSaveNow}
        onSnapshot={handleSnapshot}
        multiSelect={multiSelect}
        onToggleMultiSelect={() => {
          setMultiSelect((v) => !v);
          clearSelection();
        }}
        selectedCount={selectedTeeth.size}
        onApplyBulk={applyBulk}
        onClearSelection={clearSelection}
        onCreateBridge={handleCreateBridge}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={zoomReset}
        canZoomIn={zoom < ZOOM_MAX}
        canZoomOut={zoom > ZOOM_MIN}
        lang={lang}
      />

      {/* Body: palette + arch area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Condition palette */}
        <ConditionPalette
          activeCondition={activeCondition}
          onSelect={setActiveCondition}
          lang={lang}
        />

        {/* Arch area — always LTR so the odontogram layout (teeth + FDI numbers)
            stays anatomically correct and identical in both Arabic and English. */}
        <Box
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
            backgroundColor: 'background.default',
          }}
        >
          {/* Upper arch label */}
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mb: 0.5, letterSpacing: 1, fontSize: '0.65rem' }}
          >
            {isAr ? 'الفك العلوي' : 'Upper Jaw (Maxilla)'}
          </Typography>

          {/* Upper arch */}
          <DentalArch
            teeth={upperTeeth}
            teethMap={teethMap}
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

          {/* FDI numbers — upper */}
          <FdiRow
            teeth={upperTeeth}
            midlineAfterIndex={midIndex}
            cellWidth={crownSize}
            leadingCount={upperGhosts.leading.length}
            trailingCount={upperGhosts.trailing.length}
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

          {/* FDI numbers — lower */}
          <FdiRow
            teeth={lowerTeeth}
            midlineAfterIndex={midIndex}
            cellWidth={crownSize}
            leadingCount={lowerGhosts.leading.length}
            trailingCount={lowerGhosts.trailing.length}
          />

          {/* Lower arch */}
          <DentalArch
            teeth={lowerTeeth}
            teethMap={teethMap}
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
            color="text.disabled"
            sx={{ mt: 0.5, letterSpacing: 1, fontSize: '0.65rem' }}
          >
            {isAr ? 'الفك السفلي' : 'Lower Jaw (Mandible)'}
          </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Legend lang={lang} />

      {/* Tooth detail modal */}
      {selectedFdi && (
        <ToothModal
          open={Boolean(selectedFdi)}
          fdiNumber={selectedFdi}
          toothData={getToothData(selectedFdi)}
          bridge={activeBridge}
          onClose={() => setSelectedFdi(null)}
          onSaveTooth={handleModalSave}
          onAddProcedure={handleAddProcedure}
          onDeleteProcedure={handleDeleteProcedure}
          onRemoveBridge={handleRemoveBridge}
          lang={lang}
        />
      )}

      {/* Snapshot dialog */}
      <SnapshotDialog
        open={snapshotOpen}
        onClose={() => setSnapshotOpen(false)}
        onSave={handleSnapshotSave}
        lang={lang}
      />

      {/* Toast notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
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
  onSnapshot: PropTypes.func,
  onChartTypeChange: PropTypes.func,
  onCreateBridge: PropTypes.func,
  onDeleteBridge: PropTypes.func,
};

OdontogramView.defaultProps = {
  lang: 'en',
};
