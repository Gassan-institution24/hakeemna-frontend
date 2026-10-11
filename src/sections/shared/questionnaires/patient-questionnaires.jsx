import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Divider,
  Collapse,
  Skeleton,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  LinearProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatientQuestionnaires,
  submitQuestionnaireResponse,
  updateQuestionnaireResponse,
  useGetPatientQuestionnaireResponses,
} from 'src/api';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import QuestionnaireForm from 'src/components/questionnaire/questionnaire-form';
import QuestionnaireAnswers from 'src/components/questionnaire/questionnaire-answers';
import { textOf, progressOf, missingRequired } from 'src/components/questionnaire/utils';

import { ProfilePaneHeader } from 'src/sections/shared/patient-profile/profile-pane';

// ----------------------------------------------------------------------

// Staff view of a patient's questionnaires: every form the clinic has switched on, already
// pre-filled from the patient's file and last answers, so staff mostly confirm and save.
export default function PatientQuestionnaires({ uspId, entranceId, showHeader = true }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const isAr = currentLang?.value === 'ar';

  const {
    forms,
    loading,
    refetch: refetchForms,
  } = useGetPatientQuestionnaires(uspId, currentLang?.value);
  const { responses, refetch: refetchResponses } = useGetPatientQuestionnaireResponses(uspId);

  // { mode: 'new', form } | { mode: 'edit', response }
  const [editing, setEditing] = useState(null);
  const [openResponse, setOpenResponse] = useState(null);

  const refresh = () => {
    refetchForms();
    refetchResponses();
  };

  return (
    <Box>
      {showHeader && (
        <ProfilePaneHeader
          icon="solar:checklist-minimalistic-bold-duotone"
          title={t('Questionnaires')}
          subtitle={t('Questions and assessments to evaluate the patient')}
          count={responses.length}
        />
      )}

      {loading && <Skeleton variant="rounded" height={88} />}

      {!loading && !forms.length && (
        <EmptyContent
          filled
          title={t('No questionnaires are switched on for this clinic')}
          description={t('Pick the ready-made forms for your speciality and switch them on.')}
          action={
            <Button
              component={RouterLink}
              href={paths.employee.checklist.root}
              variant="contained"
              sx={{ mt: 2 }}
            >
              {t('Choose questionnaires')}
            </Button>
          }
          sx={{ py: 6 }}
        />
      )}

      <Stack spacing={1.5}>
        {forms.map((item) => (
          <FormRow
            key={item.template}
            item={item}
            isAr={isAr}
            onFill={() => setEditing({ mode: 'new', item })}
          />
        ))}
      </Stack>

      {!!responses.length && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 4, mb: 1.5 }}>
            {t('Answers')}
          </Typography>
          <Stack spacing={1.5}>
            {responses.map((response) => {
              const open = openResponse === response._id;
              return (
                <Card key={response._id} variant="outlined">
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    onClick={() => setOpenResponse(open ? null : response._id)}
                    sx={{ p: 2, cursor: 'pointer' }}
                  >
                    <Iconify
                      icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                      sx={{ color: 'text.disabled', flexShrink: 0 }}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap>
                        {textOf(response.form, 'title', isAr)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {fDateTime(response.submitted_at)}
                        {response.employee &&
                          ` · ${isAr ? response.employee.name_arabic || response.employee.name_english : response.employee.name_english}`}
                      </Typography>
                    </Box>
                  </Stack>
                  <Collapse in={open} unmountOnExit>
                    <Divider />
                    <Box sx={{ p: 2.5 }}>
                      <QuestionnaireAnswers
                        form={response.form}
                        answers={response.answers}
                        isAr={isAr}
                      />
                      <Button
                        size="small"
                        startIcon={<Iconify icon="solar:pen-bold" />}
                        onClick={() => setEditing({ mode: 'edit', response })}
                        sx={{ mt: 2 }}
                      >
                        {t('Correct answers')}
                      </Button>
                    </Box>
                  </Collapse>
                </Card>
              );
            })}
          </Stack>
        </>
      )}

      {editing && (
        <FillDialog
          editing={editing}
          uspId={uspId}
          entranceId={entranceId}
          isAr={isAr}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}

    </Box>
  );
}

PatientQuestionnaires.propTypes = {
  uspId: PropTypes.string,
  entranceId: PropTypes.string,
  showHeader: PropTypes.bool,
};

// ----------------------------------------------------------------------

function FormRow({ item, isAr, onFill }) {
  const { t } = useTranslate();

  let status = { label: t('Not filled yet'), color: 'default' };
  if (item.last_submitted_at) {
    status = { label: `${t('Filled')} ${fDate(item.last_submitted_at)}`, color: 'success' };
  }

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.5}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1">{textOf(item.form, 'title', isAr)}</Typography>
          <Chip
            size="small"
            variant="soft"
            color={status.color}
            label={status.label}
            sx={{ mt: 0.5 }}
          />
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-new-square-bold" />}
            onClick={onFill}
          >
            {item.last_submitted_at ? t('Fill again') : t('Fill now')}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

FormRow.propTypes = {
  item: PropTypes.object,
  isAr: PropTypes.bool,
  onFill: PropTypes.func,
};

// ----------------------------------------------------------------------

function FillDialog({ editing, uspId, entranceId, isAr, onClose, onSaved }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const smUp = useResponsive('up', 'sm');

  const isEdit = editing.mode === 'edit';
  const form = isEdit ? editing.response.form : editing.item.form;

  const [answers, setAnswers] = useState(() =>
    isEdit ? { ...(editing.response.answers || {}) } : { ...(editing.item.prefill || {}) }
  );
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (errors.includes(key)) setErrors((prev) => prev.filter((k) => k !== key));
  };

  const handleSave = async () => {
    const missing = missingRequired(form, answers);
    if (missing.length) {
      setErrors(missing);
      enqueueSnackbar(t('please answer the required questions'), { variant: 'warning' });
      return;
    }
    try {
      setSaving(true);
      if (isEdit) {
        await updateQuestionnaireResponse(editing.response._id, answers);
      } else {
        await submitQuestionnaireResponse({
          template: editing.item.template,
          unit_service_patient: uspId,
          entrance: entranceId,
          answers,
        });
      }
      enqueueSnackbar(t('saved successfully'));
      onSaved();
    } catch (error) {
      if (error?.missing) setErrors(error.missing);
      enqueueSnackbar(
        (isAr && error?.arabic_message) || error?.message || t('Something went wrong'),
        {
          variant: 'error',
        }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="md" fullScreen={!smUp} onClose={onClose}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ flexGrow: 1 }}>{textOf(form, 'title', isAr)}</Box>
          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <LinearProgress variant="determinate" value={progressOf(form, answers)} />
      <DialogContent sx={{ pt: 3 }} dir={isAr ? 'rtl' : 'ltr'}>
        <Box sx={{ py: 2 }}>
          <QuestionnaireForm
            form={form}
            answers={answers}
            onChange={handleChange}
            errors={errors}
            isAr={isAr}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <LoadingButton variant="contained" loading={saving} onClick={handleSave}>
          {t('save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

FillDialog.propTypes = {
  editing: PropTypes.object,
  uspId: PropTypes.string,
  entranceId: PropTypes.string,
  isAr: PropTypes.bool,
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
};
