import PropTypes from 'prop-types';

import { Chip, Stack, Tooltip, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';

// ----------------------------------------------------------------------

// The model stores notes as a plain string per tooth with no author or date, so
// an authored notes list needs a schema change before this can be wired up.
export default function NotesPanel({ lang }) {
  const isAr = lang === 'ar';

  return (
    <PanelCard
      icon="solar:notes-bold"
      title={`${isAr ? 'الملاحظات' : 'Notes'} (0)`}
      action={
        <Tooltip title={isAr ? 'غير متاح بعد' : 'Not available yet'}>
          <span>
            <Chip
              size="small"
              variant="soft"
              label={isAr ? 'قريباً' : 'Coming soon'}
              color="default"
            />
          </span>
        </Tooltip>
      }
    >
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
        <Iconify icon="solar:notes-linear" width={28} sx={{ color: 'text.disabled' }} />
        <Typography variant="caption" color="text.secondary">
          {isAr ? 'لا توجد ملاحظات بعد.' : 'No notes added yet.'}
        </Typography>
      </Stack>
    </PanelCard>
  );
}

NotesPanel.propTypes = {
  lang: PropTypes.string,
};
