import { useCallback, useEffect, useRef, useState } from 'react';

import { getCondition } from '../constants/conditions';
import useUndoRedo from './use-undo-redo';

// Build a teeth lookup map from the API array
function buildTeethMap(teethArray) {
  const map = {};
  if (Array.isArray(teethArray)) {
    teethArray.forEach((tooth) => {
      map[tooth.fdi_number] = tooth;
    });
  }
  return map;
}

export default function useOdontogram({ chartData, onSave }) {
  // ── teeth state with undo/redo ────────────────────────────────────────────
  const { state: teethMap, setState: setTeethMap, undo, redo, canUndo, canRedo, resetHistory } =
    useUndoRedo({});

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeCondition, setActiveCondition] = useState(null);
  const [activeStatus, setActiveStatus] = useState('existing'); // 'existing' | 'planned'
  const [selectedFdi, setSelectedFdi] = useState(null); // tooth open in modal
  const [chartType, setChartTypeLocal] = useState('adult');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [multiSelect, setMultiSelect] = useState(false); // bulk-apply mode
  const [selectedTeeth, setSelectedTeeth] = useState(new Set());

  const saveTimer = useRef(null);

  // ── Sync from API data ────────────────────────────────────────────────────
  useEffect(() => {
    if (chartData) {
      resetHistory(buildTeethMap(chartData.teeth));
      setChartTypeLocal(chartData.chart_type || 'adult');
      setIsDirty(false);
    }
  }, [chartData, resetHistory]);

  // ── Auto-save (debounced 2s) ──────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty || !onSave) {
      return undefined;
    }
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(teethMap, chartType);
        setIsDirty(false);
      } catch (e) {
        console.error('Auto-save failed:', e);
      } finally {
        setIsSaving(false);
      }
    }, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [isDirty, teethMap, chartType, onSave]);

  // ── Apply a condition to a surface or whole tooth ─────────────────────────
  const applySurface = useCallback(
    (fdiNumber, surfaceName) => {
      if (!activeCondition) {
        // No condition active → open detail modal
        setSelectedFdi(fdiNumber);
        return;
      }

      const condDef = getCondition(activeCondition);
      const isErasing = activeCondition === 'healthy';

      setTeethMap((prev) => {
        const existing = prev[fdiNumber] || { fdi_number: fdiNumber, surfaces: {} };
        const tooth = { ...existing, surfaces: { ...(existing.surfaces || {}) } };

        if (condDef?.toothLevel || surfaceName === 'whole') {
          tooth.whole_condition = isErasing ? null : activeCondition;
          tooth.whole_status = activeStatus;
          if (isErasing) {
            // Clear all surfaces too
            tooth.surfaces = {};
          }
        } else {
          const currentSurface = tooth.surfaces[surfaceName] || {};
          tooth.surfaces[surfaceName] = {
            ...currentSurface,
            condition: isErasing ? null : activeCondition,
            status: activeStatus,
          };
        }

        return { ...prev, [fdiNumber]: tooth };
      });

      setIsDirty(true);
    },
    [activeCondition, activeStatus, setTeethMap]
  );

  // ── Bulk apply to selected teeth ──────────────────────────────────────────
  const applyBulk = useCallback(() => {
    if (!activeCondition || selectedTeeth.size === 0) return;
    const condDef = getCondition(activeCondition);
    const isErasing = activeCondition === 'healthy';

    setTeethMap((prev) => {
      const next = { ...prev };
      selectedTeeth.forEach((fdi) => {
        const existing = next[fdi] || { fdi_number: fdi, surfaces: {} };
        next[fdi] = {
          ...existing,
          whole_condition: isErasing ? null : activeCondition,
          whole_status: activeStatus,
          surfaces: isErasing ? {} : existing.surfaces || {},
        };
      });
      return next;
    });

    setSelectedTeeth(new Set());
    setMultiSelect(false);
    setIsDirty(true);
  }, [activeCondition, activeStatus, selectedTeeth, setTeethMap]);

  // ── Toggle tooth in multi-select ──────────────────────────────────────────
  const toggleSelectTooth = useCallback((fdi) => {
    setSelectedTeeth((prev) => {
      const next = new Set(prev);
      if (next.has(fdi)) next.delete(fdi);
      else next.add(fdi);
      return next;
    });
  }, []);

  // ── Tooth click handler ────────────────────────────────────────────────────
  const handleToothClick = useCallback(
    (fdiNumber, surfaceName) => {
      if (multiSelect) {
        toggleSelectTooth(fdiNumber);
        return;
      }
      applySurface(fdiNumber, surfaceName);
    },
    [multiSelect, toggleSelectTooth, applySurface]
  );

  // ── Clear multi-selection ─────────────────────────────────────────────────
  const clearSelection = useCallback(() => {
    setSelectedTeeth(new Set());
  }, []);

  // ── Get tooth data ─────────────────────────────────────────────────────────
  const getToothData = useCallback(
    (fdi) => teethMap[fdi] || { fdi_number: fdi, surfaces: {}, procedures: [] },
    [teethMap]
  );

  // ── Update tooth from modal ───────────────────────────────────────────────
  const updateToothData = useCallback(
    (fdi, updates) => {
      setTeethMap((prev) => ({
        ...prev,
        [fdi]: { ...(prev[fdi] || { fdi_number: fdi }), ...updates },
      }));
      setIsDirty(true);
    },
    [setTeethMap]
  );

  return {
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
  };
}
