import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  InputAdornment,
  ToggleButtonGroup,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import { textOf, isVisible } from './utils';

// ----------------------------------------------------------------------

// Renders a questionnaire for answering. Every choice is a large tap target and follow-ups only
// appear once their trigger is answered, so a patient on a phone mostly taps rather than types.
export default function QuestionnaireForm({
  form,
  answers,
  onChange,
  errors = [],
  isAr = false,
  sectionIndexes,
  disabled = false,
  labels,
}) {
  const sections = (form?.sections || [])
    .map((section, index) => ({ section, index }))
    .filter(({ index }) => !sectionIndexes || sectionIndexes.includes(index));

  return (
    <Stack spacing={4}>
      {sections.map(({ section, index }) => (
        <Box key={index}>
          {textOf(section, 'title', isAr) && (
            <Typography variant="h6" sx={{ mb: 2 }}>
              {textOf(section, 'title', isAr)}
            </Typography>
          )}

          <Stack spacing={2.5}>
            {(section.questions || [])
              .filter((question) => isVisible(question, answers))
              .map((question) => (
                <QuestionField
                  key={question.key}
                  question={question}
                  value={answers?.[question.key]}
                  onChange={(value) => onChange(question.key, value)}
                  error={errors.includes(question.key)}
                  isAr={isAr}
                  disabled={disabled}
                  labels={labels}
                />
              ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

QuestionnaireForm.propTypes = {
  form: PropTypes.object,
  answers: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.array,
  isAr: PropTypes.bool,
  sectionIndexes: PropTypes.array,
  disabled: PropTypes.bool,
  // Overrides for pages that run outside the app's language setting (the public link).
  labels: PropTypes.shape({
    yes: PropTypes.string,
    no: PropTypes.string,
    required: PropTypes.string,
  }),
};

// ----------------------------------------------------------------------

function QuestionField({ question, value, onChange, error, isAr, disabled, labels }) {
  const { t } = useTranslate();
  const yes = labels?.yes || t('Yes');
  const no = labels?.no || t('No');

  const label = textOf(question, 'label', isAr);
  const requiredMark = question.required ? ' *' : '';
  const helper = error ? labels?.required || t('This question is required') : '';

  const heading = (
    <Typography variant="subtitle2" sx={{ mb: 1, color: error ? 'error.main' : 'text.primary' }}>
      {label}
      {requiredMark}
    </Typography>
  );

  switch (question.type) {
    case 'yes_no':
      return (
        <Box>
          {heading}
          <ToggleButtonGroup
            exclusive
            fullWidth
            disabled={disabled}
            value={value || null}
            onChange={(e, next) => onChange(next ?? '')}
            sx={{ maxWidth: 360 }}
          >
            <ToggleButton value="yes" color="primary" sx={{ py: 1.25 }}>
              {yes}
            </ToggleButton>
            <ToggleButton value="no" color="primary" sx={{ py: 1.25 }}>
              {no}
            </ToggleButton>
          </ToggleButtonGroup>
          <ErrorText show={error} text={helper} />
        </Box>
      );

    case 'single_choice':
    case 'multi_choice': {
      const multi = question.type === 'multi_choice';
      const list = Array.isArray(value) ? value : [];
      const selected = multi ? list : value;
      const isOn = (v) => (multi ? selected.includes(v) : selected === v);
      const toggle = (v) => {
        if (multi) onChange(isOn(v) ? selected.filter((x) => x !== v) : [...selected, v]);
        else onChange(isOn(v) ? '' : v);
      };

      return (
        <Box>
          {heading}
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {(question.options || []).map((option) => (
              <Chip
                key={option.value}
                label={textOf(option, 'label', isAr) || option.value}
                clickable
                disabled={disabled}
                color={isOn(option.value) ? 'primary' : 'default'}
                variant={isOn(option.value) ? 'filled' : 'outlined'}
                icon={
                  isOn(option.value) ? <Iconify icon="eva:checkmark-fill" width={18} /> : undefined
                }
                onClick={() => toggle(option.value)}
                sx={{ height: 40, px: 1, fontSize: 14 }}
              />
            ))}
          </Stack>
          <ErrorText show={error} text={helper} />
        </Box>
      );
    }

    case 'long_text':
      return (
        <TextField
          fullWidth
          multiline
          minRows={2}
          label={`${label}${requiredMark}`}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          helperText={helper}
          disabled={disabled}
        />
      );

    case 'number':
    case 'date':
    case 'short_text':
    default:
      return (
        <TextField
          fullWidth
          type={{ number: 'number', date: 'date' }[question.type] || 'text'}
          // Opens the numeric keypad on phones.
          inputProps={question.type === 'number' ? { inputMode: 'decimal' } : undefined}
          label={`${label}${requiredMark}`}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          helperText={helper}
          disabled={disabled}
          InputLabelProps={question.type === 'date' ? { shrink: true } : undefined}
          InputProps={
            question.unit
              ? { endAdornment: <InputAdornment position="end">{question.unit}</InputAdornment> }
              : undefined
          }
          sx={{ maxWidth: question.type === 'short_text' ? 1 : 360 }}
        />
      );
  }
}

QuestionField.propTypes = {
  question: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  isAr: PropTypes.bool,
  disabled: PropTypes.bool,
  labels: PropTypes.object,
};

function ErrorText({ show, text }) {
  if (!show) return null;
  return (
    <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 0.5 }}>
      {text}
    </Typography>
  );
}

ErrorText.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
};
