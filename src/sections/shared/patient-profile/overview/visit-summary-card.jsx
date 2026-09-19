import PropTypes from 'prop-types';

import { Box, Stack, Button, Divider, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import PanelCard from 'src/components/panel-card';

import { getLocalizedName } from '../utils';

// ----------------------------------------------------------------------

const PRIORITY_COLOR = { high: 'error', medium: 'warning', low: 'success' };

const STATUS_COLOR = {
  completed: 'success',
  attended: 'info',
  scheduled: 'warning',
  cancelled: 'error',
};

// ----------------------------------------------------------------------

function Stat({ label, value }) {
  return (
    <Box sx={{ flex: 1, minWidth: 96 }}>
      <Typography variant="h4">{value}</Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

Stat.propTypes = { label: PropTypes.node, value: PropTypes.node };

// ----------------------------------------------------------------------

// Visit counts, the server's priority breakdown, and the most recent visit.
//
// Unlike the other cards this one stays put when the patient has no visits:
// a brand-new patient with an overview that has quietly dropped half its cards
// reads as broken, and "no visits yet" is a real answer to a real question.
export default function VisitSummaryCard({ summary, history, onNavigate }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const total = summary?.totalVisits ?? history?.length ?? 0;

  // The list is not guaranteed to be ordered, so pick the max rather than [0].
  const lastVisit = (history || []).reduce((latest, one) => {
    const at = new Date(one?.actual_date || one?.created_at || 0).getTime();
    if (!latest) return Number.isNaN(at) ? null : { one, at };
    return at > latest.at ? { one, at } : latest;
  }, null)?.one;

  const priority = summary?.priorityDistribution;

  return (
    <PanelCard
      icon="solar:history-bold-duotone"
      title={t('Visit Summary')}
      action={
        total > 0 && (
          <Button size="small" onClick={() => onNavigate?.('history')}>
            {t('View all')}
          </Button>
        )
      }
    >
      {total === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          {t('No visits yet')}
        </Typography>
      ) : (
        <Stack spacing={2}>
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Stat label={t('Total Visits')} value={total} />
            {summary?.recentVisits !== undefined && (
              <Stat label={t('Recent Visits')} value={summary.recentVisits} />
            )}
          </Stack>

          {priority && (priority.high || priority.medium || priority.low) ? (
            <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap>
              {['high', 'medium', 'low'].map((level) =>
                priority[level] ? (
                  <Label key={level} color={PRIORITY_COLOR[level]} variant="soft">
                    {`${t(level)}: ${priority[level]}`}
                  </Label>
                ) : null
              )}
            </Stack>
          ) : null}

          {lastVisit && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {t('Last Visit')}
                </Typography>
                <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
                  <Typography variant="body2" fontWeight={600}>
                    {fDate(lastVisit.actual_date || lastVisit.created_at)}
                  </Typography>
                  {lastVisit.visitStatus && (
                    <Label color={STATUS_COLOR[lastVisit.visitStatus] || 'default'} variant="soft">
                      {t(lastVisit.visitStatus)}
                    </Label>
                  )}
                </Stack>
                {getLocalizedName(lastVisit.work_group, curLangAr) && (
                  <Typography variant="caption" color="text.secondary">
                    {getLocalizedName(lastVisit.work_group, curLangAr)}
                  </Typography>
                )}
              </Stack>
            </>
          )}
        </Stack>
      )}
    </PanelCard>
  );
}

VisitSummaryCard.propTypes = {
  summary: PropTypes.object,
  history: PropTypes.array,
  onNavigate: PropTypes.func,
};
