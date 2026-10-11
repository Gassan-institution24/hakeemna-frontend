import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  Switch,
  Divider,
  Collapse,
  Container,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';
import { saveClinicQuestionnaire, useGetClinicQuestionnaires } from 'src/api';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { textOf, allQuestions } from 'src/components/questionnaire/utils';
import QuestionnaireForm from 'src/components/questionnaire/questionnaire-form';
import QuestionListBuilder from 'src/components/questionnaire/question-list-builder';

// ----------------------------------------------------------------------

// Clinic page: the superadmin's ready-made questionnaires, the employee's own speciality first.
// One switch turns a form on for every patient; clinic questions are appended after it.
export default function ClinicQuestionnairesView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const isAr = currentLang?.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const checkAcl = useAclGuard();
  const canManage = checkAcl('unit_service_info:update');

  const { templates, speciality, loading } = useGetClinicQuestionnaires();
  const [showOthers, setShowOthers] = useState(false);
  const [busy, setBusy] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingExtras, setEditingExtras] = useState(null);

  const [mine, others] = useMemo(() => {
    const matched = templates.filter((one) => one.matches_speciality);
    // A form already switched on stays in the main list even if it is from another speciality.
    const otherOn = templates.filter((one) => !one.matches_speciality && one.clinic_active);
    const otherOff = templates.filter((one) => !one.matches_speciality && !one.clinic_active);
    return [[...matched, ...otherOn], otherOff];
  }, [templates]);

  const toggle = async (template, active) => {
    try {
      setBusy(template._id);
      await saveClinicQuestionnaire(template._id, { active });
      enqueueSnackbar(active ? t('Questionnaire switched on') : t('Questionnaire switched off'));
    } catch (error) {
      enqueueSnackbar(
        (isAr && error?.arabic_message) || error?.message || t('Something went wrong'),
        {
          variant: 'error',
        }
      );
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <LoadingScreen />;

  const renderCard = (template) => (
    <TemplateCard
      key={template._id}
      template={template}
      isAr={isAr}
      canManage={canManage}
      busy={busy === template._id}
      onToggle={(active) => toggle(template, active)}
      onPreview={() => setPreview(template)}
      onEditExtras={() => setEditingExtras(template)}
    />
  );

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={t('Questionnaires')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('Questionnaires') },
        ]}
        sx={{ mb: 2 }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 720 }}>
        {t(
          'Switch on the forms your clinic uses. They appear in every patient file, pre-filled from the patient record, and can be sent to the patient to fill on their phone.'
        )}
      </Typography>

      {!canManage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('Only the clinic admin can switch questionnaires on or off.')}
        </Alert>
      )}

      {!speciality && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t(
            'No speciality is set on your employee profile, so no forms are suggested. All forms are listed below.'
          )}
        </Alert>
      )}

      {!templates.length && (
        <EmptyContent
          filled
          title={t('No questionnaires available yet')}
          description={t('Hakeemna adds ready-made forms per speciality — check back soon.')}
          sx={{ py: 10 }}
        />
      )}

      {!!mine.length && (
        <>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {t('For your speciality')}
          </Typography>
          <Stack spacing={2} sx={{ mt: 1, mb: 4 }}>
            {mine.map(renderCard)}
          </Stack>
        </>
      )}

      {!!others.length && (
        <>
          <Button
            color="inherit"
            onClick={() => setShowOthers((v) => !v)}
            endIcon={
              <Iconify
                icon={showOthers ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              />
            }
          >
            {speciality ? t('Forms from other specialities') : t('All forms')} ({others.length})
          </Button>
          <Collapse in={showOthers || !speciality}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {others.map(renderCard)}
            </Stack>
          </Collapse>
        </>
      )}

      {preview && <PreviewDialog template={preview} isAr={isAr} onClose={() => setPreview(null)} />}

      {editingExtras && (
        <ExtrasDialog template={editingExtras} isAr={isAr} onClose={() => setEditingExtras(null)} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function TemplateCard({ template, isAr, canManage, busy, onToggle, onPreview, onEditExtras }) {
  const { t } = useTranslate();
  const questionCount = allQuestions(template).length;
  const extraCount = template.extra_questions?.length || 0;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2.5,
        borderColor: template.clinic_active ? 'primary.main' : undefined,
        transition: (theme) => theme.transitions.create('border-color'),
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1">{textOf(template, 'title', isAr)}</Typography>
          {textOf(template, 'description', isAr) && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {textOf(template, 'description', isAr)}
            </Typography>
          )}
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>
            <Chip
              size="small"
              variant="soft"
              label={
                isAr
                  ? template.speciality?.name_arabic || template.speciality?.name_english
                  : template.speciality?.name_english
              }
            />
            <Chip size="small" variant="outlined" label={`${questionCount} ${t('questions')}`} />
            {extraCount > 0 && (
              <Chip
                size="small"
                variant="outlined"
                color="primary"
                label={`+${extraCount} ${t('clinic questions')}`}
              />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <Button size="small" color="inherit" onClick={onPreview}>
            {t('Preview')}
          </Button>
          {canManage && template.clinic_active && (
            <Button size="small" color="inherit" onClick={onEditExtras}>
              {t('Add clinic questions')}
            </Button>
          )}
          <Divider orientation="vertical" flexItem />
          <Stack alignItems="center">
            <Switch
              checked={!!template.clinic_active}
              disabled={!canManage || busy}
              onChange={(e) => onToggle(e.target.checked)}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
              {template.clinic_active ? t('On') : t('Off')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

TemplateCard.propTypes = {
  template: PropTypes.object,
  isAr: PropTypes.bool,
  canManage: PropTypes.bool,
  busy: PropTypes.bool,
  onToggle: PropTypes.func,
  onPreview: PropTypes.func,
  onEditExtras: PropTypes.func,
};

// ----------------------------------------------------------------------

const withExtras = (template, extras) => ({
  ...template,
  sections: [
    ...(template.sections || []),
    ...(extras?.length
      ? [{ title: 'Clinic questions', title_arabic: 'أسئلة العيادة', questions: extras }]
      : []),
  ],
});

function PreviewDialog({ template, isAr, onClose }) {
  const { t } = useTranslate();
  const smUp = useResponsive('up', 'sm');
  const [answers, setAnswers] = useState({});

  return (
    <Dialog open fullWidth maxWidth="sm" fullScreen={!smUp} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center">
          <Box sx={{ flexGrow: 1 }}>{textOf(template, 'title', isAr)}</Box>
          <IconButton onClick={onClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ py: 1 }}>
          <QuestionnaireForm
            form={withExtras(template, template.extra_questions)}
            answers={answers}
            isAr={isAr}
            onChange={(key, value) => setAnswers((prev) => ({ ...prev, [key]: value }))}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
}

PreviewDialog.propTypes = {
  template: PropTypes.object,
  isAr: PropTypes.bool,
  onClose: PropTypes.func,
};

function ExtrasDialog({ template, isAr, onClose }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const smUp = useResponsive('up', 'sm');
  const [extras, setExtras] = useState(template.extra_questions || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (extras.some((q) => !q.label?.trim() && !q.label_arabic?.trim())) {
      enqueueSnackbar(t('Every question needs a label'), { variant: 'error' });
      return;
    }
    try {
      setSaving(true);
      await saveClinicQuestionnaire(template._id, { extra_questions: extras });
      enqueueSnackbar(t('saved successfully'));
      onClose();
    } catch (error) {
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
      <DialogTitle>
        {t('Clinic questions')} — {textOf(template, 'title', isAr)}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {t('These are asked after the standard form, only in your clinic.')}
        </Typography>
        <QuestionListBuilder
          questions={extras}
          onChange={setExtras}
          preceding={allQuestions(template)}
          keyPrefix="c"
        />
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

ExtrasDialog.propTypes = {
  template: PropTypes.object,
  isAr: PropTypes.bool,
  onClose: PropTypes.func,
};
