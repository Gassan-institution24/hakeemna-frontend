import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Box, Chip, Stack, Alert, Table, TableRow, TableBody, TableCell, TableHead, Typography, CircularProgress } from '@mui/material';

import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetDentalChart } from 'src/api/dental_chart';
import { useGetDentalDiagnoses } from 'src/api/dental_diagnoses';

import Iconify from 'src/components/iconify';

import PanelCard from './components/panel-card';
import XrayPanel from './components/xray-panel';
import NotesPanel from './components/notes-panel';
import { getSurfaceLabel } from './constants/fdi';
import { toNotation } from './constants/numbering';
import TreatmentPlanPanel from './components/treatment-plan-panel';
import ChiefComplaintPanel from './components/chief-complaint-panel';
import { getConditionColor, getConditionLabel, setCustomConditions } from './constants/conditions';

// ----------------------------------------------------------------------

// Read-only dental record for a patient outside an appointment.
//
// Charting is an act of treatment, so it belongs to the encounter: the
// odontogram and every add / edit / delete control live on the appointment page
// and only there. This view is for reading — what was found, what was planned,
// what was said and what was imaged — and passes no mutation callbacks at all,
// which is what makes the shared panels render without their action controls.

const SURFACES = ['occlusal', 'incisal', 'mesial', 'distal', 'buccal', 'lingual'];

function ConditionChip({ conditionId, lang }) {
  if (!conditionId) return null;

  return (
    <Chip
      size="small"
      variant="outlined"
      label={getConditionLabel(conditionId, lang)}
      sx={{
        height: 22,
        fontSize: '0.72rem',
        borderColor: getConditionColor(conditionId),
        '& .MuiChip-label': { px: 1 },
      }}
      icon={
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            flexShrink: 0,
            ml: '6px !important',
            backgroundColor: getConditionColor(conditionId),
            border: '1px solid',
            borderColor: 'divider',
          }}
        />
      }
    />
  );
}

ConditionChip.propTypes = {
  conditionId: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

// The odontogram's findings as a list. Without a chart to look at, this is how
// the record still answers "what is wrong with which tooth".
function findingsFor(teeth, lang) {
  return (teeth || [])
    .map((tooth) => {
      const fdi = tooth.fdi_number;
      if (typeof fdi !== 'number') return null;

      const surfaces = SURFACES.flatMap((surface) => {
        const entry = tooth.surfaces?.[surface];
        const ids = [entry?.diagnosis, entry?.condition].filter(Boolean);
        return ids.map((id) => ({ id, surface: getSurfaceLabel(surface, fdi, lang) }));
      });

      const whole = [tooth.whole_diagnosis, tooth.whole_condition].filter(Boolean);
      if (whole.length === 0 && surfaces.length === 0) return null;

      return { fdi, whole, surfaces, status: tooth.whole_status, notes: tooth.notes };
    })
    .filter(Boolean)
    .sort((a, b) => a.fdi - b.fdi);
}

// ----------------------------------------------------------------------

export default function PatientDentalSummary({ patient }) {
  const patientId = patient?.patient?._id || patient?._id;
  const { currentLang } = useLocales();
  const lang = currentLang?.value === 'ar' ? 'ar' : 'en';
  const isAr = lang === 'ar';
  const { user } = useAuthContext();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id;

  const { chartData, loading, error } = useGetDentalChart(patientId);

  // Registered during render so clinic-defined diagnoses resolve to their real
  // label and colour here exactly as they do on the chart.
  const { diagnoses: customDiagnoses } = useGetDentalDiagnoses(unitServiceId);
  useMemo(() => setCustomConditions(customDiagnoses), [customDiagnoses]);

  // The panels index procedures by tooth, so the array is reshaped once here.
  const teethMap = useMemo(() => {
    const map = {};
    (chartData?.teeth || []).forEach((tooth) => {
      if (typeof tooth.fdi_number === 'number') map[tooth.fdi_number] = tooth;
    });
    return map;
  }, [chartData]);

  const findings = useMemo(() => findingsFor(chartData?.teeth, lang), [chartData, lang]);

  if (!patientId) {
    return (
      <Alert severity="warning">
        {isAr ? 'لم يتم العثور على المريض.' : 'Patient not found.'}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {isAr ? 'تعذّر تحميل السجل.' : 'Failed to load the dental record.'}
      </Alert>
    );
  }

  return (
    <Stack gap={2.5}>
      <Alert severity="info" icon={<Iconify icon="solar:info-circle-bold" width={18} />}>
        <Typography variant="caption">
          {isAr
            ? 'هذا السجل للاطلاع فقط. التعديل على المخطط والعلاجات يتم من صفحة الموعد.'
            : 'This record is read-only. Charting and edits happen on the appointment page.'}
        </Typography>
      </Alert>

      {/* Why the patient came in */}
      <ChiefComplaintPanel
        complaints={chartData?.chief_complaints}
        teeth={[]}
        numbering="fdi"
        lang={lang}
      />

      {/* The odontogram's findings, as text */}
      <PanelCard
        icon="solar:health-bold"
        title={`${isAr ? 'حالة الأسنان' : 'Tooth findings'} (${findings.length})`}
      >
        {findings.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
            <Iconify icon="solar:health-linear" width={28} sx={{ color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {isAr ? 'لا توجد حالات مسجلة على الأسنان.' : 'No tooth findings recorded.'}
            </Typography>
          </Stack>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{isAr ? 'السن' : 'Tooth'}</TableCell>
                  <TableCell>{isAr ? 'الحالة' : 'Findings'}</TableCell>
                  <TableCell>{isAr ? 'الأسطح' : 'Surfaces'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {findings.map((row) => (
                  <TableRow key={row.fdi}>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {toNotation(row.fdi, 'fdi')}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {row.whole.map((id) => (
                          <ConditionChip key={id} conditionId={id} lang={lang} />
                        ))}
                        {row.whole.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {row.surfaces.map((entry, index) => (
                          <Chip
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${entry.id}-${index}`}
                            size="small"
                            variant="soft"
                            label={`${entry.surface}: ${getConditionLabel(entry.id, lang)}`}
                            sx={{ height: 22, fontSize: '0.72rem' }}
                          />
                        ))}
                        {row.surfaces.length === 0 && (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </PanelCard>

      {/* Full treatment history — no visit passed, so nothing is scoped away */}
      <TreatmentPlanPanel
        teethMap={teethMap}
        teeth={[]}
        unitServiceId={unitServiceId}
        numbering="fdi"
        lang={lang}
      />

      <NotesPanel notes={chartData?.note_entries} teeth={[]} numbering="fdi" lang={lang} />

      <XrayPanel xrays={chartData?.xrays} numbering="fdi" lang={lang} />
    </Stack>
  );
}

PatientDentalSummary.propTypes = {
  patient: PropTypes.object,
};
