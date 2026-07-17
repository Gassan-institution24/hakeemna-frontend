import { useState, useEffect, useCallback } from 'react';

import useUndoRedo from './use-undo-redo';
import { getCondition } from '../constants/conditions';

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
  const [bridges, setBridges] = useState([]); // fixed prostheses (read from API)

  // ── Sync from API data ────────────────────────────────────────────────────
  useEffect(() => {
    if (chartData) {
      resetHistory(buildTeethMap(chartData.teeth));
      setChartTypeLocal(chartData.chart_type || 'adult');
      setBridges(Array.isArray(chartData.bridges) ? chartData.bridges : []);
      setIsDirty(false);
    }
  }, [chartData, resetHistory]);

  // Auto-save intentionally removed — doctor triggers save manually via toolbar.

  // ── Apply a condition to a surface or whole tooth ─────────────────────────
  // Diagnoses write to *_diagnosis, procedures write to *_condition, so a
  // finding and its treatment can coexist on the same tooth / surface.
  const applySurface = useCallback(
    (fdiNumber, surfaceName) => {
      if (!activeCondition) {
        // No condition active → open detail modal
        setSelectedFdi(fdiNumber);
        return;
      }

      const condDef = getCondition(activeCondition);
      const isErasing = !!condDef?.eraser;
      const isDiagnosis = condDef?.kind === 'diagnosis';
      const wholeField = isDiagnosis ? 'whole_diagnosis' : 'whole_condition';
      const surfaceField = isDiagnosis ? 'diagnosis' : 'condition';

      setTeethMap((prev) => {
        const existing = prev[fdiNumber] || { fdi_number: fdiNumber, surfaces: {} };
        const tooth = { ...existing, surfaces: { ...(existing.surfaces || {}) } };

        if (isErasing) {
          // Eraser clears both axes on the clicked scope.
          if (surfaceName === 'whole') {
            tooth.whole_condition = null;
            tooth.whole_diagnosis = null;
            tooth.surfaces = {};
          } else {
            tooth.surfaces[surfaceName] = {
              ...(tooth.surfaces[surfaceName] || {}),
              condition: null,
              diagnosis: null,
            };
          }
        } else if (condDef?.toothLevel || surfaceName === 'whole') {
          tooth[wholeField] = activeCondition;
          if (!isDiagnosis) tooth.whole_status = activeStatus;
        } else {
          const currentSurface = tooth.surfaces[surfaceName] || {};
          tooth.surfaces[surfaceName] = {
            ...currentSurface,
            [surfaceField]: activeCondition,
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
    const isErasing = !!condDef?.eraser;
    const isDiagnosis = condDef?.kind === 'diagnosis';
    const wholeField = isDiagnosis ? 'whole_diagnosis' : 'whole_condition';

    setTeethMap((prev) => {
      const next = { ...prev };
      selectedTeeth.forEach((fdi) => {
        const existing = next[fdi] || { fdi_number: fdi, surfaces: {} };
        if (isErasing) {
          next[fdi] = { ...existing, whole_condition: null, whole_diagnosis: null, surfaces: {} };
        } else {
          next[fdi] = {
            ...existing,
            [wholeField]: activeCondition,
            whole_status: isDiagnosis ? existing.whole_status : activeStatus,
            surfaces: existing.surfaces || {},
          };
        }
      });
      return next;
    });

    setSelectedTeeth(new Set());
    setMultiSelect(false);
    setIsDirty(true);
  }, [activeCondition, activeStatus, selectedTeeth, setTeethMap]);

  // ── Remove one diagnosis everywhere it appears on the chart ───────────────
  const clearDiagnosis = useCallback(
    (diagnosisId) => {
      setTeethMap((prev) => {
        const next = {};
        Object.entries(prev).forEach(([fdi, tooth]) => {
          const surfaces = {};
          Object.entries(tooth.surfaces || {}).forEach(([name, surface]) => {
            surfaces[name] =
              surface?.diagnosis === diagnosisId ? { ...surface, diagnosis: null } : surface;
          });
          next[fdi] = {
            ...tooth,
            whole_diagnosis: tooth.whole_diagnosis === diagnosisId ? null : tooth.whole_diagnosis,
            surfaces,
          };
        });
        return next;
      });
      setIsDirty(true);
    },
    [setTeethMap]
  );

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
    bridges,
    handleToothClick,
    getToothData,
    updateToothData,
    applyBulk,
    clearDiagnosis,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
