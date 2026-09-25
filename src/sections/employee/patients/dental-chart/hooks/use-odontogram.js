import { useRef, useState, useEffect, useCallback } from 'react';

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

// The fields the chart edits and saves — everything else on a tooth (procedures,
// audit data) always comes from the server.
const SURFACE_KEYS = ['occlusal', 'incisal', 'mesial', 'distal', 'buccal', 'lingual'];

function pickClinical(tooth) {
  const out = { fdi_number: tooth.fdi_number, surfaces: tooth.surfaces || {} };
  ['whole_diagnosis', 'whole_condition', 'whole_status', 'notes', 'notes_arabic', 'treatment_plan', 'mobility_grade'].forEach(
    (key) => {
      if (key in tooth) out[key] = tooth[key];
    }
  );
  return out;
}

const norm = (v) => (v === undefined || v === '' ? null : v);

function sameClinicalData(local, server) {
  const srv = server || {};
  if (norm(local.whole_diagnosis) !== norm(srv.whole_diagnosis)) return false;
  if (norm(local.whole_condition) !== norm(srv.whole_condition)) return false;
  if (local.whole_condition && norm(local.whole_status) && local.whole_status !== srv.whole_status)
    return false;
  return SURFACE_KEYS.every((key) => {
    const a = local.surfaces?.[key] || {};
    const b = srv.surfaces?.[key] || {};
    if (norm(a.diagnosis) !== norm(b.diagnosis)) return false;
    if (norm(a.condition) !== norm(b.condition)) return false;
    return !a.condition || !a.status || a.status === b.status;
  });
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

  // Teeth edited locally and not yet confirmed by the server. The chart refetches
  // on every note / procedure / x-ray / window focus, and that refetch used to
  // replace the whole map — wiping whatever the doctor had just painted.
  const pendingRef = useRef(new Set());
  const teethMapRef = useRef(teethMap);
  teethMapRef.current = teethMap;

  // ── Sync from API data ────────────────────────────────────────────────────
  useEffect(() => {
    if (!chartData) return;
    const serverMap = buildTeethMap(chartData.teeth);
    const pending = pendingRef.current;

    if (pending.size === 0) {
      resetHistory(serverMap);
    } else {
      // Keep local edits on pending teeth (taking the server's procedures etc.),
      // and drop a tooth from pending once the server holds the same values.
      const local = teethMapRef.current;
      const merged = { ...serverMap };
      pending.forEach((fdi) => {
        const mine = local[fdi];
        if (!mine) return;
        if (sameClinicalData(mine, serverMap[fdi])) {
          pending.delete(fdi);
        } else {
          merged[fdi] = { ...(serverMap[fdi] || {}), ...pickClinical(mine) };
        }
      });
      setTeethMap(merged, true);
    }

    setChartTypeLocal(chartData.chart_type || 'adult');
    setBridges(Array.isArray(chartData.bridges) ? chartData.bridges : []);
    setIsDirty(pending.size > 0);
  }, [chartData, resetHistory, setTeethMap]);

  const markPending = useCallback((fdis) => {
    fdis.forEach((fdi) => pendingRef.current.add(Number(fdi)));
    setIsDirty(true);
  }, []);

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

      markPending([fdiNumber]);
    },
    [activeCondition, activeStatus, setTeethMap, markPending]
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

    markPending([...selectedTeeth]);
    setSelectedTeeth(new Set());
    setMultiSelect(false);
  }, [activeCondition, activeStatus, selectedTeeth, setTeethMap, markPending]);

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
      markPending(
        Object.values(teethMapRef.current)
          .filter(
            (tooth) =>
              tooth.whole_diagnosis === diagnosisId ||
              Object.values(tooth.surfaces || {}).some((srf) => srf?.diagnosis === diagnosisId)
          )
          .map((tooth) => tooth.fdi_number)
      );
    },
    [setTeethMap, markPending]
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
      markPending([fdi]);
    },
    [setTeethMap, markPending]
  );

  // Undo/redo can touch any tooth, so everything on the chart is re-checked
  // against the server on the next sync.
  const undoEdit = useCallback(() => {
    markPending(Object.keys(teethMapRef.current));
    undo();
  }, [undo, markPending]);

  const redoEdit = useCallback(() => {
    markPending(Object.keys(teethMapRef.current));
    redo();
  }, [redo, markPending]);

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
    undo: undoEdit,
    redo: redoEdit,
    canUndo,
    canRedo,
  };
}
