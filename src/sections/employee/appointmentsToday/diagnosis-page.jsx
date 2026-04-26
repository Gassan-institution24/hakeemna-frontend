import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

import { Box, Card, Chip, Stack, Button, Divider, Typography } from '@mui/material';

import { useParams } from '../../../routes/hooks';

import { fDateTime } from '../../../utils/format-time';

import { useLocales, useTranslate } from '../../../locales';
import { useGetOnePatientDiagnosis } from '../../../api/diagnosis';

import Iconify from '../../../components/iconify';

// ─── Level config ─────────────────────────────────────────────────────────────

const LEVEL_META = {
  low:      { color: 'success', icon: 'solar:arrow-down-bold-duotone',  barColor: 'success.main' },
  medium:   { color: 'warning', icon: 'solar:minus-bold-duotone',       barColor: 'warning.main' },
  high:     { color: 'error',   icon: 'solar:arrow-up-bold-duotone',    barColor: 'error.main'   },
  critical: { color: 'error',   icon: 'solar:danger-bold-duotone',      barColor: 'error.main'   },
};

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
      <Typography sx={{ fontWeight: 600, minWidth: 180, color: 'text.secondary', fontSize: 14 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14 }}>{value}</Typography>
    </Box>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function DiagnosisPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const navigate = useNavigate();

  const { patientDiagnosis, loading } = useGetOnePatientDiagnosis(id);
  console.log('Fetched diagnosis:', patientDiagnosis);

  const level = patientDiagnosis?.level;
  const levelMeta = LEVEL_META[level] || { color: 'default', icon: '', barColor: 'success.main' };

  const patientName = curLangAr
    ? patientDiagnosis?.patient?.name_arabic || patientDiagnosis?.patient?.name_english
    : patientDiagnosis?.patient?.name_english || patientDiagnosis?.patient?.name_arabic;

  const doctorName = curLangAr
    ? patientDiagnosis?.given_by?.employee?.name_arabic ||
      patientDiagnosis?.given_by?.name_arabic ||
      patientDiagnosis?.given_by?.name_english
    : patientDiagnosis?.given_by?.employee?.name_english ||
      patientDiagnosis?.given_by?.name_english ||
      patientDiagnosis?.given_by?.name_arabic;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography color="text.secondary">{t('Loading...')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '60vh',
        p: { xs: 2, md: 4 },
        bgcolor: '#f5f7fa',
      }}
    >
      <Stack
        component={Card}
        sx={{
          width: '100%',
          maxWidth: 760,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* ── Coloured top bar based on level ────────────────────────── */}
        <Box sx={{ height: 6, bgcolor: levelMeta.barColor }} />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            px: 4,
            pt: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: 'primary.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:stethoscope-bold-duotone" width={24} color="primary.main" />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              {t('Diagnosis Details')}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {fDateTime(patientDiagnosis?.created_at)}
          </Typography>
        </Box>

        <Divider />

        {/* ── Body ───────────────────────────────────────────────────── */}
        <Box sx={{ px: 4, py: 3 }}>
          {/* Level badge */}
          {level && (
            <Box sx={{ mb: 3 }}>
              <Chip
                icon={<Iconify icon={levelMeta.icon} width={16} />}
                label={t(level.charAt(0).toUpperCase() + level.slice(1))}
                color={levelMeta.color}
                sx={{ fontWeight: 700, fontSize: 13, px: 1 }}
              />
            </Box>
          )}

          {/* Primary diagnosis — hero block */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              borderLeft: '5px solid',
              borderColor: 'primary.main',
            }}
          >
            <Typography
              variant="caption"
              color="primary.main"
              fontWeight={700}
              sx={{ mb: 0.5, display: 'block' }}
            >
              {t('Primary Diagnosis')}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {patientDiagnosis?.primary_diagnosis?.name || '—'}
            </Typography>
          </Box>

          {/* Secondary diagnosis */}
          {patientDiagnosis?.secondary_diagnosis?.name && (
            <Box
              sx={{
                mb: 3,
                p: 3,
                borderRadius: 2,
                bgcolor: 'warning.lighter',
                borderLeft: '5px solid',
                borderColor: 'warning.main',
              }}
            >
              <Typography
                variant="caption"
                color="warning.dark"
                fontWeight={700}
                sx={{ mb: 0.5, display: 'block' }}
              >
                {t('Secondary Diagnosis')}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {patientDiagnosis.secondary_diagnosis.name}
              </Typography>
            </Box>
          )}

          {/* Doctor note */}
          {patientDiagnosis?.note && (
            <Box
              sx={{
                mb: 3,
                p: 2.5,
                borderRadius: 2,
                bgcolor: '#fafafa',
                borderLeft: '4px solid #4CAF50',
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{ mb: 0.5, display: 'block' }}
              >
                {t("Doctor's Note")}
              </Typography>
              <Typography color="text.primary" sx={{ lineHeight: 1.8 }}>
                {patientDiagnosis.note}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2.5 }} />

          {/* Meta info */}
          <InfoRow label={t('Patient')} value={patientName} />
          <InfoRow label={t('Given By')} value={doctorName} />
          <InfoRow
            label={t('Appointment')}
            value={patientDiagnosis?.appointment?.appointment_number}
          />
        </Box>

        {/* ── Footer / Actions ───────────────────────────────────────── */}
        <Box
          sx={{
            px: 4,
            py: 2.5,
            bgcolor: '#fafafa',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate(-1)}
            startIcon={<Iconify icon="icon-park:back" />}
          >
            {t('Back')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
