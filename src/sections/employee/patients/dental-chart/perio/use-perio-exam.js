import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { idOf } from '../constants/visit-scope';
import { clampGm, clampPd, examToDraft, draftToTeeth } from './perio-math';

// Editing state for the periodontal exam of the current visit.
//
// Measurements live here until the dentist presses Save — one bulk request, never
// one per keystroke. A chart refetch (another panel saved, window refocused, …)
// only refreshes this state while nothing is unsaved, so typed values are never
// thrown away by a background reload.
export default function usePerioExam({ exams, visitId, onSave }) {
  const currentExam = useMemo(
    () => (visitId ? (exams || []).find((e) => idOf(e.visit) === String(visitId)) : null) || null,
    [exams, visitId]
  );

  const [draft, setDraft] = useState(() => examToDraft(currentExam));
  const [notes, setNotes] = useState(currentExam?.notes || '');
  const [baseUpdatedAt, setBaseUpdatedAt] = useState(currentExam?.updated_at || null);
  const [status, setStatus] = useState('idle'); // idle | dirty | saving | saved | error
  const [error, setError] = useState(null); // { conflict: bool, message }

  const dirtyRef = useRef(false);
  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    setStatus('dirty');
  }, []);

  // Follow the server copy only while there is nothing unsaved.
  const serverStamp = currentExam ? `${currentExam._id}|${currentExam.updated_at}` : 'none';
  useEffect(() => {
    if (dirtyRef.current) return;
    setDraft(examToDraft(currentExam));
    setNotes(currentExam?.notes || '');
    setBaseUpdatedAt(currentExam?.updated_at || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverStamp]);

  // ── Edits ───────────────────────────────────────────────────────────────────
  const updateTooth = useCallback(
    (fdi, updater) => {
      setDraft((prev) => {
        const tooth = prev[fdi] || { sites: {}, mobility_grade: 0, furcation_grade: 0, plaque: false, notes: '' };
        return { ...prev, [fdi]: updater({ ...tooth, sites: { ...tooth.sites } }) };
      });
      markDirty();
    },
    [markDirty]
  );

  // PD opens and closes a site: clearing it removes the site's GM, BOP and
  // suppuration with it, because those are meaningless on an unprobed site.
  const setPd = useCallback(
    (fdi, siteKey, value) =>
      updateTooth(fdi, (tooth) => {
        const pd = clampPd(value);
        if (pd === null) delete tooth.sites[siteKey];
        else tooth.sites[siteKey] = { ...(tooth.sites[siteKey] || {}), pd };
        return tooth;
      }),
    [updateTooth]
  );

  const setGm = useCallback(
    (fdi, siteKey, value) =>
      updateTooth(fdi, (tooth) => {
        const site = tooth.sites[siteKey];
        if (!site?.pd) return tooth;
        const gm = clampGm(value);
        const next = { ...site };
        if (gm === null) delete next.gm;
        else next.gm = gm;
        tooth.sites[siteKey] = next;
        return tooth;
      }),
    [updateTooth]
  );

  const toggleSiteFlag = useCallback(
    (fdi, siteKey, flag) =>
      updateTooth(fdi, (tooth) => {
        const site = tooth.sites[siteKey];
        if (!site?.pd) return tooth;
        const next = { ...site };
        if (next[flag]) delete next[flag];
        else next[flag] = true;
        tooth.sites[siteKey] = next;
        return tooth;
      }),
    [updateTooth]
  );

  const setToothField = useCallback(
    (fdi, field, value) => updateTooth(fdi, (tooth) => ({ ...tooth, [field]: value })),
    [updateTooth]
  );

  const changeNotes = useCallback(
    (value) => {
      setNotes(value);
      markDirty();
    },
    [markDirty]
  );

  // Start this visit from an earlier exam's values (the dentist then re-probes).
  const copyFrom = useCallback(
    (exam) => {
      setDraft(examToDraft(exam));
      markDirty();
    },
    [markDirty]
  );

  const discard = useCallback(() => {
    dirtyRef.current = false;
    setDraft(examToDraft(currentExam));
    setNotes(currentExam?.notes || '');
    setBaseUpdatedAt(currentExam?.updated_at || null);
    setError(null);
    setStatus('idle');
  }, [currentExam]);

  // ── Save (one request for the whole exam) ───────────────────────────────────
  const save = useCallback(async () => {
    if (!onSave || !visitId) return;
    setStatus('saving');
    setError(null);
    try {
      const saved = await onSave({
        teeth: draftToTeeth(draft),
        notes,
        base_updated_at: baseUpdatedAt || undefined,
      });
      const exam = (saved?.periodontal_exams || []).find((e) => idOf(e.visit) === String(visitId));
      dirtyRef.current = false;
      // Take the server's copy: it is what was actually stored after validation.
      setDraft(examToDraft(exam));
      setNotes(exam?.notes || '');
      setBaseUpdatedAt(exam?.updated_at || null);
      setStatus('saved');
    } catch (err) {
      const conflict = err?.status === 409 || err?.response?.status === 409;
      setError({ conflict, message: err?.message || String(err) });
      setStatus('error');
    }
  }, [onSave, visitId, draft, notes, baseUpdatedAt]);

  return {
    currentExam,
    draft,
    notes,
    status,
    error,
    isDirty: status === 'dirty' || (status === 'error' && dirtyRef.current),
    setPd,
    setGm,
    toggleSiteFlag,
    setToothField,
    changeNotes,
    copyFrom,
    discard,
    save,
  };
}
