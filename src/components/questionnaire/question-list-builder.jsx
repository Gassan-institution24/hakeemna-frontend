import PropTypes from 'prop-types';

import {
  Box,
  Card,
  Stack,
  Button,
  Switch,
  Tooltip,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import {
  textOf,
  CHOICE_TYPES,
  blankQuestion,
  QUESTION_TYPES,
  PREFILL_FIELDS,
  newQuestionKey,
} from './utils';

// ----------------------------------------------------------------------

const TRIGGER_TYPES = ['yes_no', 'single_choice', 'multi_choice'];
const PREFILLABLE_TYPES = ['short_text', 'number', 'date'];
const UNIT_TYPES = ['short_text', 'number'];

// Controlled editor for a flat list of questions. Used for a template section (superadmin) and for
// a clinic's extra questions. `preceding` are questions earlier in the form that a follow-up here
// may depend on.
export default function QuestionListBuilder({
  questions,
  onChange,
  preceding = [],
  keyPrefix = 'q',
}) {
  const { t } = useTranslate();

  const update = (index, patch) =>
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));

  const remove = (index) => {
    const removedKey = questions[index].key;
    // A follow-up pointing at a deleted question would never show again — clear the link.
    onChange(
      questions
        .filter((_, i) => i !== index)
        .map((q) => (q.show_if?.key === removedKey ? { ...q, show_if: null } : q))
    );
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= questions.length) return;
    const next = [...questions];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const duplicate = (index) => {
    const copy = { ...questions[index], key: newQuestionKey(keyPrefix) };
    onChange([...questions.slice(0, index + 1), copy, ...questions.slice(index + 1)]);
  };

  return (
    <Stack spacing={2}>
      {questions.map((question, index) => (
        <QuestionCard
          key={question.key}
          index={index}
          total={questions.length}
          question={question}
          triggers={[...preceding, ...questions.slice(0, index)].filter((q) =>
            TRIGGER_TYPES.includes(q.type)
          )}
          onChange={(patch) => update(index, patch)}
          onRemove={() => remove(index)}
          onMove={(delta) => move(index, delta)}
          onDuplicate={() => duplicate(index)}
        />
      ))}

      <Box>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => onChange([...questions, blankQuestion(keyPrefix)])}
        >
          {t('Add question')}
        </Button>
      </Box>
    </Stack>
  );
}

QuestionListBuilder.propTypes = {
  questions: PropTypes.array,
  onChange: PropTypes.func,
  preceding: PropTypes.array,
  keyPrefix: PropTypes.string,
};

// ----------------------------------------------------------------------

function QuestionCard({
  index,
  total,
  question,
  triggers,
  onChange,
  onRemove,
  onMove,
  onDuplicate,
}) {
  const { t } = useTranslate();

  const isChoice = CHOICE_TYPES.includes(question.type);
  const trigger = triggers.find((q) => q.key === question.show_if?.key);

  const setType = (type) => {
    const patch = { type };
    if (CHOICE_TYPES.includes(type) && !question.options?.length) {
      patch.options = [newOption(), newOption()];
    }
    if (!PREFILLABLE_TYPES.includes(type)) patch.prefill = '';
    if (!UNIT_TYPES.includes(type)) patch.unit = '';
    onChange(patch);
  };

  const setOption = (i, patch) =>
    onChange({ options: question.options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)) });

  const triggerValues = (() => {
    if (!trigger) return [];
    if (trigger.type === 'yes_no') {
      return [
        { value: 'yes', label: t('Yes') },
        { value: 'no', label: t('No') },
      ];
    }
    return (trigger.options || []).map((o) => ({
      value: o.value,
      label: o.label || o.label_arabic || o.value,
    }));
  })();

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" sx={{ color: 'text.disabled', flexGrow: 1 }}>
            {t('Question')} {index + 1}
          </Typography>
          <Tooltip title={t('Move up')}>
            <span>
              <IconButton size="small" disabled={index === 0} onClick={() => onMove(-1)}>
                <Iconify icon="eva:arrow-upward-fill" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('Move down')}>
            <span>
              <IconButton size="small" disabled={index === total - 1} onClick={() => onMove(1)}>
                <Iconify icon="eva:arrow-downward-fill" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('Duplicate')}>
            <IconButton size="small" onClick={onDuplicate}>
              <Iconify icon="solar:copy-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton size="small" color="error" onClick={onRemove}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            label={t('Question (English)')}
            value={question.label || ''}
            onChange={(e) => onChange({ label: e.target.value })}
          />
          <TextField
            fullWidth
            size="small"
            label={t('Question (Arabic)')}
            value={question.label_arabic || ''}
            onChange={(e) => onChange({ label_arabic: e.target.value })}
            inputProps={{ dir: 'rtl' }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <TextField
            select
            size="small"
            label={t('Answer type')}
            value={question.type}
            onChange={(e) => setType(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {QUESTION_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Iconify icon={type.icon} width={18} sx={{ mr: 1 }} />
                {t(type.label)}
              </MenuItem>
            ))}
          </TextField>

          {PREFILLABLE_TYPES.includes(question.type) && (
            <TextField
              select
              size="small"
              label={t('Fill from patient file')}
              value={question.prefill || ''}
              onChange={(e) => onChange({ prefill: e.target.value })}
              sx={{ minWidth: 200 }}
            >
              {PREFILL_FIELDS.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {t(field.label)}
                </MenuItem>
              ))}
            </TextField>
          )}

          {UNIT_TYPES.includes(question.type) && (
            <TextField
              size="small"
              label={t('Unit')}
              placeholder="mmHg"
              value={question.unit || ''}
              onChange={(e) => onChange({ unit: e.target.value })}
              sx={{ width: { md: 120 } }}
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={!!question.required}
                onChange={(e) => onChange({ required: e.target.checked })}
              />
            }
            label={t('Required')}
          />
        </Stack>

        {isChoice && (
          <Stack spacing={1} sx={{ pl: { md: 2 } }}>
            {(question.options || []).map((option, i) => (
              <Stack key={option.value} direction="row" spacing={1} alignItems="center">
                <Iconify
                  icon={
                    question.type === 'multi_choice'
                      ? 'mdi:checkbox-blank-outline'
                      : 'mdi:radiobox-blank'
                  }
                  sx={{ color: 'text.disabled', flexShrink: 0 }}
                />
                <TextField
                  size="small"
                  fullWidth
                  placeholder={t('Option (English)')}
                  value={option.label || ''}
                  onChange={(e) => setOption(i, { label: e.target.value })}
                />
                <TextField
                  size="small"
                  fullWidth
                  placeholder={t('Option (Arabic)')}
                  value={option.label_arabic || ''}
                  onChange={(e) => setOption(i, { label_arabic: e.target.value })}
                  inputProps={{ dir: 'rtl' }}
                />
                <IconButton
                  size="small"
                  onClick={() =>
                    onChange({ options: question.options.filter((_, idx) => idx !== i) })
                  }
                >
                  <Iconify icon="ic:round-close" />
                </IconButton>
              </Stack>
            ))}
            <Box>
              <Button
                size="small"
                startIcon={<Iconify icon="ph:plus-bold" />}
                onClick={() => onChange({ options: [...(question.options || []), newOption()] })}
              >
                {t('Add option')}
              </Button>
            </Box>
          </Stack>
        )}

        {triggers.length > 0 && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              select
              size="small"
              label={t('Show only if')}
              value={question.show_if?.key || ''}
              onChange={(e) =>
                onChange({ show_if: e.target.value ? { key: e.target.value, equals: '' } : null })
              }
              sx={{ minWidth: 260 }}
            >
              <MenuItem value="">{t('Always show')}</MenuItem>
              {triggers.map((q) => (
                <MenuItem key={q.key} value={q.key}>
                  {textOf(q, 'label', false) || q.key}
                </MenuItem>
              ))}
            </TextField>

            {trigger && (
              <TextField
                select
                size="small"
                label={t('is answered')}
                value={question.show_if?.equals || ''}
                onChange={(e) =>
                  onChange({ show_if: { key: trigger.key, equals: e.target.value } })
                }
                sx={{ minWidth: 200 }}
              >
                {triggerValues.map((v) => (
                  <MenuItem key={v.value} value={v.value}>
                    {v.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

QuestionCard.propTypes = {
  index: PropTypes.number,
  total: PropTypes.number,
  question: PropTypes.object,
  triggers: PropTypes.array,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  onMove: PropTypes.func,
  onDuplicate: PropTypes.func,
};

let optionCounter = 0;
// The stored value is an opaque id, so renaming an option later never orphans old answers.
function newOption() {
  optionCounter += 1;
  return {
    value: `o_${Date.now().toString(36)}${optionCounter.toString(36)}`,
    label: '',
    label_arabic: '',
  };
}
