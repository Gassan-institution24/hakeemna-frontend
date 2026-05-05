import { useMemo, useState, useCallback } from 'react';

export const SECTION_KEYS = {
  VISITS_HISTORY: 'visitsHistory',
  CHECK_LIST: 'checkList',
  UPLOAD_FILES: 'uploadFiles',
  ADJUSTABLE_DOCUMENT: 'adjustableDocument',
  SERVICES_PROVIDED: 'servicesProvided',
};

export const DEFAULT_SECTIONS = [
  {
    key: SECTION_KEYS.VISITS_HISTORY,
    icon: 'healthicons:medical-records-outline',
    color: 'success',
    labelKey: 'Visits history',
    descriptionKey: 'View previous visits for this patient',
    visible: true,
  },
  {
    key: SECTION_KEYS.CHECK_LIST,
    icon: 'octicon:checklist-16',
    color: 'info',
    labelKey: 'Choose a Check List',
    descriptionKey: 'Medical checklist for this visit',
    visible: true,
  },
  {
    key: SECTION_KEYS.UPLOAD_FILES,
    icon: 'mingcute:folders-fill',
    color: 'primary',
    labelKey: 'Upload files',
    descriptionKey: 'Upload clinical forms and documents',
    visible: true,
  },
  {
    key: SECTION_KEYS.ADJUSTABLE_DOCUMENT,
    icon: 'mingcute:document-fill',
    color: 'warning',
    labelKey: 'Adjustable document',
    descriptionKey: 'Optional adjustable forms for this patient',
    visible: true,
  },
  {
    key: SECTION_KEYS.SERVICES_PROVIDED,
    icon: 'hugeicons:give-pill',
    color: 'error',
    labelKey: 'Services provided',
    descriptionKey: 'Record services rendered during this visit',
    visible: true,
  },
];

const STORAGE_KEY_PREFIX = 'processing_layout_v1_';

function getStorageKey(userId) {
  return `${STORAGE_KEY_PREFIX}${userId || 'default'}`;
}

function loadPreferences(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function savePreferences(userId, prefs) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(prefs));
  } catch {
    // ignore storage errors
  }
}

export function useProcessingLayout(userId) {
  const [visibilityMap, setVisibilityMap] = useState(() => {
    const saved = loadPreferences(userId);
    if (saved) return saved;
    return Object.fromEntries(DEFAULT_SECTIONS.map((s) => [s.key, s.visible]));
  });

  const sections = useMemo(
    () => DEFAULT_SECTIONS.map((s) => ({ ...s, visible: visibilityMap[s.key] ?? s.visible })),
    [visibilityMap]
  );

  const toggle = useCallback(
    (key) => {
      setVisibilityMap((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        savePreferences(userId, next);
        return next;
      });
    },
    [userId]
  );

  const reset = useCallback(() => {
    const defaults = Object.fromEntries(DEFAULT_SECTIONS.map((s) => [s.key, s.visible]));
    setVisibilityMap(defaults);
    savePreferences(userId, defaults);
  }, [userId]);

  const isVisible = useCallback((key) => visibilityMap[key] ?? true, [visibilityMap]);

  return { sections, toggle, reset, isVisible };
}
