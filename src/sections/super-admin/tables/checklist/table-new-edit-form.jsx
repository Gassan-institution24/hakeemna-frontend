import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Switch,
  Divider,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  CardHeader,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetSpecialties, saveQuestionnaireTemplate } from 'src/api';

import Iconify from 'src/components/iconify';
import QuestionnaireForm from 'src/components/questionnaire/questionnaire-form';
import { allQuestions, blankQuestion } from 'src/components/questionnaire/utils';
import QuestionListBuilder from 'src/components/questionnaire/question-list-builder';

// ----------------------------------------------------------------------

const blankSection = () => ({ title: '', title_arabic: '', questions: [blankQuestion()] });

// Superadmin builder for a speciality questionnaire. Clinics of that speciality switch it on from
// their own Questionnaires page and may add questions after it — they cannot change these.
export default function NewEditForm({ currentRow }) {
  const router = useRouter();
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });

  const [values, setValues] = useState(() => ({
    title: currentRow?.title || '',
    title_arabic: currentRow?.title_arabic || '',
    description: currentRow?.description || '',
    description_arabic: currentRow?.description_arabic || '',
    speciality: currentRow?.speciality?._id || currentRow?.speciality || '',
    active: currentRow?.active ?? true,
    sections: currentRow?.sections?.length ? currentRow.sections : [blankSection()],
  }));
  const [saving, setSaving] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [previewAr, setPreviewAr] = useState(false);

  const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));

  const setSection = (index, patch) =>
    set({ sections: values.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)) });

  const moveSection = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= values.sections.length) return;
    const next = [...values.sections];
    [next[index], next[target]] = [next[target], next[index]];
    set({ sections: next });
  };

  const questionCount = useMemo(() => allQuestions(values).length, [values]);

  const handleSave = async () => {
    if (!values.title.trim()) {
      enqueueSnackbar(t('title is required'), { variant: 'error' });
      return;
    }
    if (!values.speciality) {
      enqueueSnackbar(t('Choose a speciality'), { variant: 'error' });
      return;
    }
    const unlabeled = allQuestions(values).some((q) => !q.label?.trim() && !q.label_arabic?.trim());
    if (unlabeled) {
      enqueueSnackbar(t('Every question needs a label'), { variant: 'error' });
      return;
    }

    try {
      setSaving(true);
      await saveQuestionnaireTemplate(currentRow?._id, values);
      enqueueSnackbar(currentRow ? t('updated successfully') : t('created successfully'));
      router.push(paths.superadmin.tables.checklist.root);
    } catch (error) {
      enqueueSnackbar(error?.message || t('Something went wrong'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={t('Title (English)')}
                  value={values.title}
                  onChange={(e) => set({ title: e.target.value })}
                />
                <TextField
                  fullWidth
                  label={t('Title (Arabic)')}
                  value={values.title_arabic}
                  onChange={(e) => set({ title_arabic: e.target.value })}
                  inputProps={{ dir: 'rtl' }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <TextField
                  select
                  fullWidth
                  label={t('speciality')}
                  value={values.speciality}
                  onChange={(e) => set({ speciality: e.target.value })}
                  helperText={t('Clinics of this speciality will see it first')}
                >
                  {specialtiesData.map((one) => (
                    <MenuItem key={one._id} value={one._id}>
                      {one.name_english}
                      {one.name_arabic ? ` — ${one.name_arabic}` : ''}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  sx={{ flexShrink: 0 }}
                  control={
                    <Switch
                      checked={values.active}
                      onChange={(e) => set({ active: e.target.checked })}
                    />
                  }
                  label={t('Published')}
                />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label={t('Intro for the patient (English)')}
                  value={values.description}
                  onChange={(e) => set({ description: e.target.value })}
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label={t('Intro for the patient (Arabic)')}
                  value={values.description_arabic}
                  onChange={(e) => set({ description_arabic: e.target.value })}
                  inputProps={{ dir: 'rtl' }}
                />
              </Stack>
            </Stack>
          </Card>

          {values.sections.map((section, index) => (
            <Card key={index}>
              <CardHeader
                title={`${t('Section')} ${index + 1}`}
                action={
                  <Stack direction="row">
                    <IconButton disabled={index === 0} onClick={() => moveSection(index, -1)}>
                      <Iconify icon="eva:arrow-upward-fill" />
                    </IconButton>
                    <IconButton
                      disabled={index === values.sections.length - 1}
                      onClick={() => moveSection(index, 1)}
                    >
                      <Iconify icon="eva:arrow-downward-fill" />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled={values.sections.length === 1}
                      onClick={() =>
                        set({ sections: values.sections.filter((_, i) => i !== index) })
                      }
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Stack>
                }
              />
              <Stack spacing={2} sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label={t('Section title (English)')}
                    placeholder="Medical history"
                    value={section.title}
                    onChange={(e) => setSection(index, { title: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label={t('Section title (Arabic)')}
                    placeholder="التاريخ الطبي"
                    value={section.title_arabic}
                    onChange={(e) => setSection(index, { title_arabic: e.target.value })}
                    inputProps={{ dir: 'rtl' }}
                  />
                </Stack>
                <QuestionListBuilder
                  questions={section.questions}
                  preceding={values.sections.slice(0, index).flatMap((s) => s.questions)}
                  onChange={(questions) => setSection(index, { questions })}
                />
              </Stack>
            </Card>
          ))}

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => set({ sections: [...values.sections, blankSection()] })}
            >
              {t('Add section')}
            </Button>
            <LoadingButton variant="contained" size="large" loading={saving} onClick={handleSave}>
              {currentRow ? t('Update') : t('Create')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Grid>

      {/* Live preview — exactly what the patient will tap through. */}
      <Grid item xs={12} md={5}>
        <Card sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
          <CardHeader
            title={t('Preview')}
            subheader={`${questionCount} ${t('questions')}`}
            action={
              <Button size="small" onClick={() => setPreviewAr((v) => !v)}>
                {previewAr ? 'English' : 'العربية'}
              </Button>
            }
          />
          <Divider sx={{ mt: 2 }} />
          <Box
            dir={previewAr ? 'rtl' : 'ltr'}
            sx={{ p: 3, maxHeight: { md: 'calc(100vh - 220px)' }, overflowY: 'auto' }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>
              {(previewAr ? values.title_arabic || values.title : values.title) ||
                t('Untitled questionnaire')}
            </Typography>
            {(previewAr ? values.description_arabic : values.description) && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {previewAr ? values.description_arabic : values.description}
              </Typography>
            )}
            <QuestionnaireForm
              form={values}
              answers={previewAnswers}
              isAr={previewAr}
              onChange={(key, value) => setPreviewAnswers((prev) => ({ ...prev, [key]: value }))}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

NewEditForm.propTypes = {
  currentRow: PropTypes.object,
};
