import PropTypes from 'prop-types';

import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import ClearIcon from '@mui/icons-material/Clear';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Box,
  Chip,
  Stack,
  Button,
  Tooltip,
  Divider,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from '@mui/material';

export default function ChartToolbar({
  chartType,
  onChartTypeChange,
  jawFilter,
  onJawFilterChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isDirty,
  isSaving,
  onSaveNow,
  onSnapshot,
  multiSelect,
  onToggleMultiSelect,
  selectedCount,
  onApplyBulk,
  onClearSelection,
  onCreateBridge,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canZoomIn,
  canZoomOut,
  lang,
}) {
  const isAr = lang === 'ar';

  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      gap={1}
      sx={{
        px: 2,
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Adult / Child switcher */}
      <ToggleButtonGroup
        exclusive
        value={chartType}
        onChange={(_, v) => v && onChartTypeChange(v)}
        size="small"
      >
        <ToggleButton value="adult" sx={{ fontSize: '0.72rem', px: 1.5, py: 0.5 }}>
          <PersonIcon fontSize="inherit" sx={{ mr: 0.5 }} />
          {isAr ? 'بالغ' : 'Adult'}
        </ToggleButton>
        <ToggleButton value="child" sx={{ fontSize: '0.72rem', px: 1.5, py: 0.5 }}>
          <ChildCareIcon fontSize="inherit" sx={{ mr: 0.5 }} />
          {isAr ? 'طفل' : 'Child'}
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem />

      {/* Jaw view filter */}
      <ToggleButtonGroup
        exclusive
        value={jawFilter}
        onChange={(_, v) => v && onJawFilterChange(v)}
        size="small"
      >
        <ToggleButton value="full" sx={{ fontSize: '0.72rem', px: 1.25, py: 0.5 }}>
          {isAr ? 'الفم كامل' : 'Full Mouth'}
        </ToggleButton>
        <ToggleButton value="upper" sx={{ fontSize: '0.72rem', px: 1.25, py: 0.5 }}>
          {isAr ? 'الفك العلوي' : 'Upper Jaw'}
        </ToggleButton>
        <ToggleButton value="lower" sx={{ fontSize: '0.72rem', px: 1.25, py: 0.5 }}>
          {isAr ? 'الفك السفلي' : 'Lower Jaw'}
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider orientation="vertical" flexItem />

      {/* Undo / Redo */}
      <Tooltip title={isAr ? 'تراجع' : 'Undo'}>
        <span>
          <IconButton size="small" onClick={onUndo} disabled={!canUndo}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={isAr ? 'إعادة' : 'Redo'}>
        <span>
          <IconButton size="small" onClick={onRedo} disabled={!canRedo}>
            <RedoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Multi-select */}
      <Tooltip title={isAr ? 'تحديد متعدد' : 'Multi-select teeth'}>
        <ToggleButton
          value="multiselect"
          selected={multiSelect}
          onChange={onToggleMultiSelect}
          size="small"
          sx={{ fontSize: '0.72rem', px: 1.5, py: 0.5 }}
        >
          <SelectAllIcon fontSize="inherit" sx={{ mr: 0.5 }} />
          {isAr ? 'تحديد' : 'Select'}
        </ToggleButton>
      </Tooltip>

      {multiSelect && selectedCount > 0 && (
        <>
          <Chip
            label={`${selectedCount} ${isAr ? 'أسنان' : 'teeth'}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Button
            size="small"
            variant="contained"
            onClick={onApplyBulk}
            sx={{ fontSize: '0.72rem', py: 0.5 }}
          >
            {isAr ? 'تطبيق' : 'Apply'}
          </Button>
          {selectedCount >= 2 && onCreateBridge && (
            <Tooltip title={isAr ? 'ربط الأسنان بجسر ثابت' : 'Connect teeth into a fixed bridge'}>
              <Button
                size="small"
                variant="outlined"
                color="warning"
                startIcon={<LinkIcon fontSize="small" />}
                onClick={onCreateBridge}
                sx={{ fontSize: '0.72rem', py: 0.5 }}
              >
                {isAr ? 'إنشاء جسر' : 'Create Bridge'}
              </Button>
            </Tooltip>
          )}
          <Tooltip title={isAr ? 'إلغاء التحديد' : 'Clear selection'}>
            <IconButton size="small" onClick={onClearSelection}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Divider orientation="vertical" flexItem />

      {/* Zoom controls */}
      <Stack direction="row" alignItems="center" gap={0.25}>
        <Tooltip title={isAr ? 'تصغير' : 'Zoom out'}>
          <span>
            <IconButton size="small" onClick={onZoomOut} disabled={!canZoomOut}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Box sx={{ minWidth: 38, textAlign: 'center', fontSize: '0.72rem', color: 'text.secondary' }}>
          {Math.round(zoom * 100)}%
        </Box>
        <Tooltip title={isAr ? 'تكبير' : 'Zoom in'}>
          <span>
            <IconButton size="small" onClick={onZoomIn} disabled={!canZoomIn}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={isAr ? 'إعادة الضبط' : 'Reset zoom'}>
          <span>
            <IconButton size="small" onClick={onZoomReset} disabled={zoom === 1}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Box sx={{ flex: 1 }} />

      {/* Status indicator */}
      {isDirty && !isSaving && (
        <Chip
          label={isAr ? 'تغييرات غير محفوظة' : 'Unsaved changes'}
          size="small"
          color="warning"
          variant="outlined"
        />
      )}
      {isSaving && (
        <Chip
          icon={<CircularProgress size={10} />}
          label={isAr ? 'جاري الحفظ...' : 'Saving...'}
          size="small"
          variant="outlined"
        />
      )}

      {/* Snapshot */}
      <Tooltip title={isAr ? 'حفظ لقطة' : 'Save snapshot'}>
        <IconButton size="small" onClick={onSnapshot}>
          <CameraIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Save now */}
      <Button
        size="small"
        variant="contained"
        startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon fontSize="small" />}
        onClick={onSaveNow}
        disabled={!isDirty || isSaving}
        sx={{ fontSize: '0.72rem', py: 0.5 }}
      >
        {isAr ? 'حفظ' : 'Save'}
      </Button>
    </Stack>
  );
}

ChartToolbar.propTypes = {
  chartType: PropTypes.string,
  onChartTypeChange: PropTypes.func.isRequired,
  jawFilter: PropTypes.string,
  onJawFilterChange: PropTypes.func.isRequired,
  canUndo: PropTypes.bool,
  canRedo: PropTypes.bool,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  isSaving: PropTypes.bool,
  onSaveNow: PropTypes.func.isRequired,
  onSnapshot: PropTypes.func.isRequired,
  multiSelect: PropTypes.bool,
  onToggleMultiSelect: PropTypes.func.isRequired,
  selectedCount: PropTypes.number,
  onApplyBulk: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
  onCreateBridge: PropTypes.func,
  zoom: PropTypes.number,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomReset: PropTypes.func.isRequired,
  canZoomIn: PropTypes.bool,
  canZoomOut: PropTypes.bool,
  lang: PropTypes.string,
};

ChartToolbar.defaultProps = {
  chartType: 'adult',
  jawFilter: 'full',
  canUndo: false,
  canRedo: false,
  isDirty: false,
  isSaving: false,
  multiSelect: false,
  selectedCount: 0,
  zoom: 1,
  canZoomIn: true,
  canZoomOut: true,
  lang: 'en',
};
