import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Chip, Stack, Alert, Button, Select, MenuItem, TextField, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import PerioArch from './perio-arch';
import PerioLegend from './perio-legend';
import PerioSummary from './perio-summary';
import usePerioExam from './use-perio-exam';
import { idOf } from '../constants/visit-scope';
import { getOdontogramPalette } from '../constants/odontogram-theme';
import { isProbeable, examToDraft, computePerioSummary } from './perio-math';
import { ADULT_UPPER, ADULT_LOWER, CHILD_UPPER, CHILD_LOWER } from '../constants/fdi';
import { usePerioNav, makeGeometry, fitCellWidth, PerioGeometryContext } from './perio-layout';

const CURRENT = 'current';

const actorName = (user) =>
  user?.employee?.name_english || user?.employee?.name_arabic || user?.email || '';

/**
 * Periodontal chart (periodontogram) — a separate view beside the odontogram.
 *
 * Reads tooth status (missing, implant, pontic) from the odontogram's own record
 * but never writes to it; its measurements are stored per visit in
 * `chart.periodontal_exams` and saved in one request with the Save button.
 */
export default function PeriodontalView({ chartData, visit, readOnly, onSaveExam }) {
  const theme = useTheme();
  const { t } = useTranslate();
  const odonPalette = getOdontogramPalette(theme.palette.mode);

  const visitId = visit?.id ? String(visit.id) : null;
  const exams = useMemo(
    () =>
      [...(chartData?.periodontal_exams || [])].sort(
        (a, b) => new Date(b.exam_date || b.created_at) - new Date(a.exam_date || a.created_at)
      ),
    [chartData?.periodontal_exams]
  );

  const handleSave = useCallback(
    (payload) =>
      onSaveExam({
        ...payload,
        visit: visitId,
        appointment: visit?.appointmentId || undefined,
        exam_date: visit?.date || undefined,
      }),
    [onSaveExam, visitId, visit?.appointmentId, visit?.date]
  );

  const exam = usePerioExam({ exams, visitId, onSave: handleSave });
  const previousExams = exams.filter((e) => !visitId || idOf(e.visit) !== visitId);

  // Which exam is on screen: this visit's (editable) or an earlier one (history).
  const [selected, setSelected] = useState(visitId ? CURRENT : previousExams[0]?._id || CURRENT);
  useEffect(() => {
    if (!visitId && selected === CURRENT && previousExams[0]) setSelected(previousExams[0]._id);
  }, [visitId, selected, previousExams]);

  const viewingCurrent = selected === CURRENT;
  const shownExam = viewingCurrent ? exam.currentExam : exams.find((e) => e._id === selected);
  const draft = useMemo(
    () => (viewingCurrent ? exam.draft : examToDraft(shownExam)),
    [viewingCurrent, exam.draft, shownExam]
  );
  const editable = !readOnly && !!visitId && viewingCurrent;

  // Warn before leaving the page with unsaved measurements.
  useEffect(() => {
    if (!exam.isDirty) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [exam.isDirty]);

  // ── Teeth, from the chart's dentition and the odontogram's tooth records ───
  const child = chartData?.chart_type === 'child';
  const upper = child ? CHILD_UPPER : ADULT_UPPER;
  const lower = child ? CHILD_LOWER : ADULT_LOWER;
  const odontoMap = useMemo(() => {
    const map = {};
    (chartData?.teeth || []).forEach((tooth) => {
      map[tooth.fdi_number] = tooth;
    });
    return map;
  }, [chartData?.teeth]);

  const probeableFdis = useMemo(
    () => [...upper, ...lower].filter((fdi) => isProbeable(odontoMap[fdi])),
    [upper, lower, odontoMap]
  );
  const summary = useMemo(() => computePerioSummary(draft, probeableFdis), [draft, probeableFdis]);

  const nav = usePerioNav(upper.length * 3);

  // Fill the width the chart is given: measure its box and size the columns,
  // rows, graph and tooth drawings to it. Re-measured on every resize — including
  // the moment this view is first shown, since it can mount while hidden.
  const [chartEl, setChartEl] = useState(null);
  const [chartWidth, setChartWidth] = useState(0);
  useEffect(() => {
    if (!chartEl) return undefined;
    const measure = () => setChartWidth(chartEl.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(chartEl);
    return () => observer.disconnect();
  }, [chartEl]);
  const geometry = useMemo(
    () => makeGeometry(fitCellWidth(chartWidth, upper.length)),
    [chartWidth, upper.length]
  );
  const actions = useMemo(
    () =>
      editable
        ? {
            setPd: exam.setPd,
            setGm: exam.setGm,
            toggleSiteFlag: exam.toggleSiteFlag,
            setToothField: exam.setToothField,
          }
        : { setPd: () => {}, setGm: () => {}, toggleSiteFlag: () => {}, setToothField: () => {} },
    [editable, exam.setPd, exam.setGm, exam.toggleSiteFlag, exam.setToothField]
  );

  // ── Status ──────────────────────────────────────────────────────────────────
  const statusChip = (() => {
    if (!viewingCurrent || !visitId) return null;
    if (exam.status === 'saving') return <Chip size="small" color="info" variant="soft" label={t('Saving…')} />;
    if (exam.isDirty) return <Chip size="small" color="warning" variant="soft" label={t('Unsaved changes')} />;
    if (exam.status === 'saved') return <Chip size="small" color="success" variant="soft" label={t('Saved')} />;
    return null;
  })();

  const examLabel = (e) => {
    const by = actorName(e.updated_by || e.created_by);
    return `${fDate(e.exam_date || e.created_at, 'dd MMM yyyy')}${by ? ` — ${by}` : ''}`;
  };

  const hasAnyExam = !!exam.currentExam || previousExams.length > 0;

  if (!visitId && !hasAnyExam) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        {t('No periodontal examination recorded yet.')}
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1.5}>
        <Iconify icon="mdi:chart-bell-curve-cumulative" width={20} sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight={700}>
          {t('Periodontal Chart')}
        </Typography>

        <Select
          size="small"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          sx={{ minWidth: 220, '& .MuiSelect-select': { py: 0.6, fontSize: '0.8rem' } }}
        >
          {visitId && (
            <MenuItem value={CURRENT}>
              {t('This visit')}
              {exam.currentExam ? ` — ${fDate(exam.currentExam.exam_date, 'dd MMM yyyy')}` : ` (${t('new')})`}
            </MenuItem>
          )}
          {previousExams.map((e) => (
            <MenuItem key={e._id} value={e._id}>
              {examLabel(e)}
            </MenuItem>
          ))}
        </Select>

        {!viewingCurrent && (
          <Chip size="small" variant="outlined" label={t('Previous exam — read only')} />
        )}

        <Box sx={{ flex: 1 }} />

        {statusChip}

        {editable && previousExams.length > 0 && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="mdi:content-copy" width={16} />}
            onClick={() => exam.copyFrom(previousExams[0])}
          >
            {t('Copy previous exam')}
          </Button>
        )}

        {editable && exam.isDirty && (
          <Button size="small" color="inherit" onClick={exam.discard}>
            {t('Discard changes')}
          </Button>
        )}

        {editable && (
          <Button
            size="small"
            variant="contained"
            startIcon={<Iconify icon="mdi:content-save-outline" width={16} />}
            disabled={!exam.isDirty || exam.status === 'saving'}
            onClick={exam.save}
          >
            {t('Save Periodontal Chart')}
          </Button>
        )}
      </Stack>

      {exam.error && viewingCurrent && (
        <Alert severity="error">
          {exam.error.conflict
            ? t('This periodontal exam was changed by someone else. Discard your changes to load the latest version, or copy your values before reloading.')
            : exam.error.message}
        </Alert>
      )}

      {!readOnly && !visitId && (
        <Alert severity="info">{t('Periodontal charting is recorded during an appointment.')}</Alert>
      )}

      <PerioSummary summary={summary} />

      {/* ── The chart ───────────────────────────────────────────────────────── */}
      {/* Anatomical layout: always left-to-right, also in Arabic. */}
      <Box
        dir="ltr"
        ref={setChartEl}
        sx={{
          border: '1px solid',
          borderColor: odonPalette.line,
          borderRadius: '14px',
          backgroundColor: 'background.paper',
          overflowX: 'auto',
          py: 1,
        }}
      >
        <PerioGeometryContext.Provider value={geometry}>
        <Box sx={{ width: 'max-content', mx: 'auto' }}>
          <Typography variant="overline" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary' }}>
            {t('Upper Jaw')}
          </Typography>
          <PerioArch
            arch="upper"
            teeth={upper}
            draft={draft}
            odontoMap={odontoMap}
            readOnly={!editable}
            actions={actions}
            nav={nav}
          />

          <Box sx={{ height: 2, my: 1.5, backgroundColor: 'divider' }} />

          <PerioArch
            arch="lower"
            teeth={lower}
            draft={draft}
            odontoMap={odontoMap}
            readOnly={!editable}
            actions={actions}
            nav={nav}
          />
          <Typography variant="overline" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary' }}>
            {t('Lower Jaw')}
          </Typography>
        </Box>
        </PerioGeometryContext.Provider>
      </Box>

      <TextField
        size="small"
        multiline
        minRows={2}
        label={t('Periodontal notes')}
        value={viewingCurrent ? exam.notes : shownExam?.notes || ''}
        onChange={(e) => editable && exam.changeNotes(e.target.value)}
        InputProps={{ readOnly: !editable }}
      />

      <PerioLegend />
    </Stack>
  );
}

PeriodontalView.propTypes = {
  chartData: PropTypes.object,
  // `{ id, appointmentId, date }` of the appointment being treated. Without it the
  // chart is read-only history (e.g. the standalone patient summary).
  visit: PropTypes.object,
  readOnly: PropTypes.bool,
  onSaveExam: PropTypes.func,
};
