// Mirrors hakeemna-backend/utils/questionnaire.js — the server re-checks everything on submit,
// these only drive what the form shows.

export const QUESTION_TYPES = [
  { value: 'short_text', label: 'Short text', icon: 'solar:text-field-bold' },
  { value: 'long_text', label: 'Paragraph', icon: 'solar:document-text-bold' },
  { value: 'number', label: 'Number', icon: 'solar:hashtag-bold' },
  { value: 'date', label: 'Date', icon: 'solar:calendar-bold' },
  { value: 'yes_no', label: 'Yes / No', icon: 'solar:check-circle-bold' },
  { value: 'single_choice', label: 'Single choice', icon: 'solar:record-circle-bold' },
  { value: 'multi_choice', label: 'Multiple choice', icon: 'solar:checklist-bold' },
];

export const CHOICE_TYPES = ['single_choice', 'multi_choice'];

export const PREFILL_FIELDS = [
  { value: '', label: 'None' },
  { value: 'name', label: 'Patient name' },
  { value: 'birth_date', label: 'Date of birth' },
  { value: 'age', label: 'Age' },
  { value: 'gender', label: 'Gender' },
  { value: 'address', label: 'Address' },
  { value: 'mobile', label: 'Mobile number' },
  { value: 'blood_type', label: 'Blood type' },
];

/** Pick the Arabic or English text of a label pair, falling back to whichever exists. */
export const textOf = (item, field, isAr) => {
  if (!item) return '';
  const en = item[field];
  const ar = item[`${field}_arabic`];
  return (isAr ? ar || en : en || ar) || '';
};

export const allQuestions = (form) => (form?.sections || []).flatMap((s) => s.questions || []);

export const isEmptyAnswer = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0);

export const isVisible = (question, answers = {}) => {
  if (!question?.show_if?.key) return true;
  const parent = answers[question.show_if.key];
  if (Array.isArray(parent)) return parent.includes(question.show_if.equals);
  return String(parent ?? '').trim() === question.show_if.equals;
};

export const missingRequired = (form, answers = {}) =>
  allQuestions(form)
    .filter((q) => q.required && isVisible(q, answers) && isEmptyAnswer(answers[q.key]))
    .map((q) => q.key);

/** Share of visible questions that have an answer, 0–100. */
export const progressOf = (form, answers = {}) => {
  const visible = allQuestions(form).filter((q) => isVisible(q, answers));
  if (!visible.length) return 0;
  const done = visible.filter((q) => !isEmptyAnswer(answers[q.key])).length;
  return Math.round((done / visible.length) * 100);
};

/** Human-readable answer for the read-only view. */
export const formatAnswer = (question, value, isAr, t) => {
  if (isEmptyAnswer(value)) return '—';
  if (question.type === 'yes_no') return value === 'yes' ? t('Yes') : t('No');
  if (question.type === 'single_choice' || question.type === 'multi_choice') {
    const values = Array.isArray(value) ? value : [value];
    return values
      .map((v) => {
        const option = (question.options || []).find((o) => o.value === v);
        return option ? textOf(option, 'label', isAr) : v;
      })
      .join('، ');
  }
  return question.unit ? `${value} ${question.unit}` : String(value);
};

let keyCounter = 0;
/** Client-side key for a new question; the server keeps it, so answers line up across edits. */
export const newQuestionKey = (prefix = 'q') => {
  keyCounter += 1;
  return `${prefix}_${Date.now().toString(36)}${keyCounter.toString(36)}`;
};

export const blankQuestion = (prefix = 'q') => ({
  key: newQuestionKey(prefix),
  label: '',
  label_arabic: '',
  type: 'short_text',
  options: [],
  unit: '',
  required: false,
  prefill: '',
  show_if: null,
});
