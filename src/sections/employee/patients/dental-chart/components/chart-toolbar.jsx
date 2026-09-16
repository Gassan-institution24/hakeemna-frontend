import { useState } from 'react';
import PropTypes from 'prop-types';

import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import {
  Box,
  Chip,
  Menu,
  Stack,
  Button,
  Tooltip,
  Divider,
  MenuItem,
  Typography,
  IconButton,
  ToggleButton,
  CircularProgress,
  ToggleButtonGroup,
} from '@mui/material';

import Iconify from 'src/components/iconify';

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
  multiSelect,
  onToggleMultiSelect,
  selectedCount,
  onClearSelection,
  onCreateBridge,
  bridges,
  onRemoveBridge,
  lang,
}) {
  const isAr = lang === 'ar';

  const [bridgeAnchor, setBridgeAnchor] = useState(null);
  const bridgeList = Array.isArray(bridges) ? bridges : [];

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

      {/* Bridges — view and remove existing fixed bridges */}
      {onRemoveBridge && bridgeList.length > 0 && (
        <>
          <Tooltip title={isAr ? 'الجسور الثابتة' : 'Fixed bridges'}>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<LinkIcon fontSize="small" />}
              onClick={(e) => setBridgeAnchor(e.currentTarget)}
              sx={{ fontSize: '0.72rem', py: 0.5 }}
            >
              {isAr ? 'الجسور' : 'Bridges'} ({bridgeList.length})
            </Button>
          </Tooltip>

          <Menu
            anchorEl={bridgeAnchor}
            open={Boolean(bridgeAnchor)}
            onClose={() => setBridgeAnchor(null)}
          >
            {bridgeList.map((bridge) => (
              <MenuItem
                key={bridge._id}
                disableRipple
                sx={{ gap: 2, justifyContent: 'space-between' }}
              >
                <Typography variant="body2">{(bridge.teeth || []).join('–')}</Typography>
                <Tooltip title={isAr ? 'إزالة الجسر' : 'Remove bridge'}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      onRemoveBridge(bridge._id);
                      setBridgeAnchor(null);
                    }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </Tooltip>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      <Divider orientation="vertical" flexItem />


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
  multiSelect: PropTypes.bool,
  onToggleMultiSelect: PropTypes.func.isRequired,
  selectedCount: PropTypes.number,
  onClearSelection: PropTypes.func.isRequired,
  onCreateBridge: PropTypes.func,
  bridges: PropTypes.array,
  onRemoveBridge: PropTypes.func,
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
  lang: 'en',
};
