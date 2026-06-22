import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import EmptyState from './empty-state';

// ----------------------------------------------------------------------

// Show first name only, mask the rest with bullet dots for privacy
function maskName(fullName) {
  if (!fullName) return '••••';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0];
  return `${parts[0]} ••••`;
}

// Feedback model has no helpful_count field, so no "helpful" vote button is rendered here -
// this is intentional, not an oversight.
export default function ReviewsSection({ feedbackData = [], average, count }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [showIndex, setShowIndex] = useState(0);

  // One review per patient (most recent), only include reviews that have a star rating
  const uniqueReviews = Object.values(
    (feedbackData || []).reduce((acc, review) => {
      if (!review.Rate) return acc;
      const key =
        review.patient?._id ??
        review.patient?.name_english ??
        review.patient?.name_arabic;
      if (key) acc[key] = review;
      return acc;
    }, {})
  );

  if (!uniqueReviews.length) {
    return <EmptyState icon="solar:chat-round-line-bold" label={t('no reviews yet')} />;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h3">{average ? average.toFixed(1) : '-'}</Typography>
        <Stack>
          <Rating size="small" readOnly value={average || 0} precision={0.1} max={5} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({uniqueReviews.length} {t('reviews')})
          </Typography>
        </Stack>
      </Stack>

      <Box
        rowGap={2}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
      >
        {uniqueReviews
          .filter((_, index) => index < showIndex + 6 && index >= showIndex)
          .map((one, index) => {
            const rawName = curLangAr ? one.patient?.name_arabic : one.patient?.name_english;
            const displayName = maskName(rawName);
            const avatarLetter = rawName?.trim()[0]?.toUpperCase();

            return (
              <Box key={one._id || index} sx={{ bgcolor: 'background.neutral', p: 2.5, borderRadius: 1.5 }}>
                <Stack direction="row" gap={1.5} mb={1.5}>
                  <Avatar>{avatarLetter}</Avatar>
                  <Stack>
                    <Typography variant="subtitle2">{displayName}</Typography>
                    <Rating size="small" readOnly value={one.Rate} precision={0.1} max={5} />
                  </Stack>
                </Stack>
                {one.Body && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {one.Body}
                  </Typography>
                )}
                {one.Selection && (
                  <Chip size="small" label={t(one.Selection)} sx={{ mt: 1.5 }} />
                )}
              </Box>
            );
          })}
      </Box>

      {uniqueReviews.length > 6 && (
        <Stack direction="row" justifyContent="center">
          <IconButton
            aria-label={t('show more reviews')}
            onClick={() => setShowIndex((prev) => (uniqueReviews.length > prev + 6 ? prev + 6 : 0))}
          >
            <Iconify icon="iconamoon:arrow-down-2-bold" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}

ReviewsSection.propTypes = {
  feedbackData: PropTypes.array,
  average: PropTypes.number,
  count: PropTypes.number,
};
