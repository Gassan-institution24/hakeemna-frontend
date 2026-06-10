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
} from './constants/fdi';
import useOdontogram from './hooks/use-odontogram';
import ChartToolbar from './components/chart-toolbar';
import ConditionPalette from './components/condition-palette';
import DentalArch from './components/dental-arch';
import ToothModal from './components/tooth-modal';

// ── FDI number row between the arches ────────────────────────────────────────
function FdiRow({ teeth, midlineAfterIndex }) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ gap: '2px', px: 1, py: 0.3 }}
    >
      {teeth.map((fdi, idx) => (
        <Box key={fdi} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 44,
              textAlign: 'center',
              fontSize: '0.6rem',
              color: 'text.disabled',
              lineHeight: 1,
            }}
          >
            {fdi}
          </Box>
          {idx === midlineAfterIndex && (
            <Box sx={{ width: 11, flexShrink: 0 }} />
          )}
        </Box>
      ))}
    </Stack>
  );
}

FdiRow.propTypes = {
  teeth: PropTypes.arrayOf(PropTypes.number).isRequired,
  midlineAfterIndex: PropTypes.number,
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
}) {
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const {
    teethMap,
    activeCondition,
    setActiveCondition,
    activeStatus,
    setActiveStatus,
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
        lang={lang}
      />

      {/* Body: palette + arch area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Condition palette */}
        <ConditionPalette
          activeCondition={activeCondition}
          activeStatus={activeStatus}
          onSelect={setActiveCondition}
          onStatusChange={setActiveStatus}
          lang={lang}
        />

        {/* Arch area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 3,
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
            midlineAfterIndex={chartType === 'child' ? 4 : 7}
            onSurfaceClick={handleToothClick}
            onDoubleClick={setSelectedFdi}
            activeCondition={activeCondition}
            selectedTeeth={selectedTeeth}
            multiSelect={multiSelect}
            lang={lang}
          />

          {/* FDI numbers — upper */}
          <FdiRow teeth={upperTeeth} midlineAfterIndex={chartType === 'child' ? 4 : 7} />

          {/* Midline divider */}
          <Box
            sx={{
              width: '80%',
              height: 1,
              backgroundColor: 'divider',
              my: 0.5,
            }}
          />

          {/* FDI numbers — lower */}
          <FdiRow teeth={lowerTeeth} midlineAfterIndex={chartType === 'child' ? 4 : 7} />

          {/* Lower arch */}
          <DentalArch
            teeth={lowerTeeth}
            teethMap={teethMap}
            isUpper={false}
            midlineAfterIndex={chartType === 'child' ? 4 : 7}
            onSurfaceClick={handleToothClick}
            onDoubleClick={setSelectedFdi}
            activeCondition={activeCondition}
            selectedTeeth={selectedTeeth}
            multiSelect={multiSelect}
            lang={lang}
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
          onClose={() => setSelectedFdi(null)}
          onSaveTooth={handleModalSave}
          onAddProcedure={handleAddProcedure}
          onDeleteProcedure={handleDeleteProcedure}
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
};

OdontogramView.defaultProps = {
  lang: 'en',
};
