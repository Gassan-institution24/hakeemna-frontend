import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import { textOf, isVisible, formatAnswer, isEmptyAnswer } from './utils';

// ----------------------------------------------------------------------

// Read-only view of a submitted questionnaire, laid out like the paper form it replaces.
export default function QuestionnaireAnswers({ form, answers, isAr = false, hideEmpty = false }) {
  const { t } = useTranslate();

  return (
    <Stack spacing={3}>
      {(form?.sections || []).map((section, index) => {
        const questions = (section.questions || []).filter(
          (q) => isVisible(q, answers) && (!hideEmpty || !isEmptyAnswer(answers?.[q.key]))
        );
        if (!questions.length) return null;

        return (
          <Box key={index}>
            {textOf(section, 'title', isAr) && (
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
              >
                {textOf(section, 'title', isAr)}
              </Typography>
            )}

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              {questions.map((question) => (
                <Box
                  key={question.key}
                  // Paragraph answers get the full row so they are not squeezed.
                  sx={{ gridColumn: question.type === 'long_text' ? '1 / -1' : 'auto' }}
                >
                  <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                    {textOf(question, 'label', isAr)}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {formatAnswer(question, answers?.[question.key], isAr, t)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

QuestionnaireAnswers.propTypes = {
  form: PropTypes.object,
  answers: PropTypes.object,
  isAr: PropTypes.bool,
  hideEmpty: PropTypes.bool,
};
