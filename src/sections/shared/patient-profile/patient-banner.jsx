import PropTypes from 'prop-types';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Avatar,
  Tooltip,
  Skeleton,
  Typography,
  IconButton,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { getInitials, calculateAge, getLocalizedName } from './utils';

// ----------------------------------------------------------------------

// The identity strip that stays above every section of the chart. Its job is
// for a doctor to confirm at a glance that they are looking at the right
// patient, and to see the few facts that change how they treat them.
//
// Every field is omitted when absent rather than shown as a dash: a sparse
// record should read as short, not as broken.
export default function PatientBanner({ patient, loading, actions, backTo }) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const isRtl = theme.direction === 'rtl';

  if (loading || !patient) {
    return (
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={64} height={64} />
          <Stack gap={1} sx={{ flex: 1 }}>
            <Skeleton variant="text" width={220} height={32} />
            <Skeleton variant="text" width={320} height={20} />
          </Stack>
        </Stack>
      </Card>
    );
  }

  const name = curLangAr
    ? patient.name_arabic || patient.name_english
    : patient.name_english || patient.name_arabic;

  // A unit-service patient without a linked account is a walk-in: nothing that
  // depends on the patient having signed up should be offered for them.
  const isVerified = !!patient.patient?._id;

  const age = calculateAge(patient.birth_date);
  const workGroup = getLocalizedName(patient.work_groups?.[0], curLangAr);

  // Values that are enum members get translated; free text and numbers never do.
  const facts = [
    patient.gender && { key: 'gender', label: t(patient.gender) },
    age !== null && { key: 'age', label: `${age} ${t('years')}` },
    patient.birth_date && { key: 'dob', label: fDate(patient.birth_date) },
    patient.blood_type && {
      key: 'blood',
      label: `${t('Blood Type')}: ${patient.blood_type}`,
      color: 'error',
    },
    patient.pregnant === true && { key: 'pregnant', label: t('Pregnant'), color: 'secondary' },
    patient.code && { key: 'code', label: `${t('code')}: ${patient.code}` },
    patient.file_code && {
      key: 'file',
      label: `${t('Old File Number')}: ${patient.file_code}`,
      tooltip: t('Archive Number'),
    },
    patient.identification_num && {
      key: 'ident',
      label: `${t('Personal identification number')}: ${patient.identification_num}`,
    },
    patient.mobile_num1 && { key: 'phone', label: patient.mobile_num1, dir: 'ltr' },
    workGroup && { key: 'group', label: workGroup },
    patient.status === 'inactive' && {
      key: 'status',
      label: t('Inactive'),
      color: 'default',
    },
  ].filter(Boolean);

  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <Stack direction="row" alignItems="flex-start" gap={1.5} sx={{ minWidth: 0 }}>
          <IconButton onClick={() => (backTo ? router.push(backTo) : router.back())} sx={{ mt: 0.5 }}>
            <Iconify icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'} />
          </IconButton>

          <Avatar
            src={patient.profile_picture}
            alt={name}
            sx={{
              width: 64,
              height: 64,
              flexShrink: 0,
              bgcolor: alpha(theme.palette.primary.main, 0.16),
              color: 'primary.dark',
              fontWeight: 600,
            }}
          >
            {getInitials(name)}
          </Avatar>

          <Stack gap={0.75} sx={{ minWidth: 0 }}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
                {name}
              </Typography>

              {isVerified ? (
                <Tooltip title={t('Verified patient account')}>
                  <Box sx={{ display: 'flex' }}>
                    <Iconify
                      icon="eva:checkmark-circle-2-fill"
                      width={20}
                      sx={{ color: 'primary.main' }}
                    />
                  </Box>
                </Tooltip>
              ) : (
                <Label color="warning" variant="soft">
                  {t('Not Verified')}
                </Label>
              )}

              {isVerified && (
                <Label color={patient.patient?.online ? 'success' : 'default'} variant="soft">
                  {patient.patient?.online ? t('Online') : t('Offline')}
                </Label>
              )}
            </Stack>

            <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap>
              {facts.map((fact) => {
                const chip = (
                  <Label key={fact.key} color={fact.color || 'default'} variant="soft">
                    <Box component="span" dir={fact.dir}>
                      {fact.label}
                    </Box>
                  </Label>
                );

                return fact.tooltip ? (
                  <Tooltip key={fact.key} title={fact.tooltip}>
                    <Box sx={{ display: 'flex' }}>{chip}</Box>
                  </Tooltip>
                ) : (
                  chip
                );
              })}
            </Stack>
          </Stack>
        </Stack>

        {actions && (
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            sx={{
              ml: 'auto',
              width: { xs: 1, sm: 'auto' },
              // On a phone the buttons split the row evenly rather than
              // wrapping one under the other at ragged widths.
              '& > *': { flex: { xs: 1, sm: 'none' } },
            }}
          >
            {actions}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

PatientBanner.propTypes = {
  patient: PropTypes.object,
  loading: PropTypes.bool,
  actions: PropTypes.node,
  backTo: PropTypes.string,
};
