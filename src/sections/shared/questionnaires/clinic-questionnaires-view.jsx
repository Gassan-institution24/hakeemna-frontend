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
import {
  deleteOwnQuestionnaire,
  saveClinicQuestionnaire,
  useGetClinicQuestionnaires,
} from 'src/api';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { textOf, allQuestions } from 'src/components/questionnaire/utils';
import QuestionnaireForm from 'src/components/questionnaire/questionnaire-form';
import QuestionListBuilder from 'src/components/questionnaire/question-list-builder';

import QuestionnaireBuilder from 'src/sections/super-admin/tables/checklist/table-new-edit-form';

// ----------------------------------------------------------------------

// Clinic page: the clinic's own questionnaires, then the superadmin's ready-made ones (the
// employee's own speciality first). One switch turns a form on for every patient; clinic
// questions can be appended after a ready-made one.
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
  // {} = new own questionnaire, a template = editing an own one.
  const [building, setBuilding] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [owned, mine, others] = useMemo(() => {
    const shared = templates.filter((one) => !one.owned);
    const matched = shared.filter((one) => one.matches_speciality);
    // A form already switched on stays in the main list even if it is from another speciality.
    const otherOn = shared.filter((one) => !one.matches_speciality && one.clinic_active);
    const otherOff = shared.filter((one) => !one.matches_speciality && !one.clinic_active);
    return [templates.filter((one) => one.owned), [...matched, ...otherOn], otherOff];
  }, [templates]);

  const handleDelete = async () => {
    try {
      await deleteOwnQuestionnaire(deleting._id);
      enqueueSnackbar(t('Questionnaire deleted'));
    } catch (error) {
      enqueueSnackbar((isAr && error?.arabic_message) || error?.message || t('Something went wrong'), {
        variant: 'error',
      });
    } finally {
      setDeleting(null);
    }
  };

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
      onEdit={() => setBuilding(template)}
      onDelete={() => setDeleting(template)}
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
        action={
          canManage && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setBuilding({})}
            >
              {t('Create our own questionnaire')}
            </Button>
          )
        }
        sx={{ mb: 2 }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 720 }}>
        {t(
          'Create your own questionnaires or switch on ready-made ones. Every questionnaire that is on appears in each patient file, pre-filled from the patient record.'
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
          description={t('Create your own questionnaire, or check back for ready-made forms per speciality.')}
          sx={{ py: 10 }}
        />
      )}

      {!!owned.length && (
        <>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {t("Your clinic's questionnaires")}
          </Typography>
          <Stack spacing={2} sx={{ mt: 1, mb: 4 }}>
            {owned.map(renderCard)}
          </Stack>
        </>
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

      {building && (
        <Dialog fullScreen open onClose={() => setBuilding(null)}>
          <DialogTitle>
            <Stack direction="row" alignItems="center">
              <Box sx={{ flexGrow: 1 }}>
                {building._id ? t('Edit questionnaire') : t('Create our own questionnaire')}
              </Box>
              <IconButton onClick={() => setBuilding(null)}>
                <Iconify icon="mingcute:close-line" />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: 'background.neutral' }}>
            <Box sx={{ py: 2 }}>
              <QuestionnaireBuilder
                mode="clinic"
                currentRow={building._id ? building : undefined}
                onSaved={() => setBuilding(null)}
              />
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={t('Delete questionnaire')}
        content={t('It will disappear from patient files. Answers already given stay readable.')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            {t('delete')}
          </Button>
        }
      />

      {editingExtras && (
        <ExtrasDialog template={editingExtras} isAr={isAr} onClose={() => setEditingExtras(null)} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function TemplateCard({
  template,
  isAr,
  canManage,
  busy,
  onToggle,
  onPreview,
  onEditExtras,
  onEdit,
  onDelete,
}) {
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
            {template.owned ? (
              <Chip size="small" variant="soft" color="info" label={t('Your clinic')} />
            ) : (
              <Chip
                size="small"
                variant="soft"
                label={
                  isAr
                    ? template.speciality?.name_arabic || template.speciality?.name_english
                    : template.speciality?.name_english
                }
              />
            )}
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
          {canManage && template.owned && (
            <>
              <Button size="small" color="inherit" onClick={onEdit}>
                {t('edit')}
              </Button>
              <IconButton size="small" color="error" onClick={onDelete}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </>
          )}
          {canManage && !template.owned && template.clinic_active && (
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
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
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
