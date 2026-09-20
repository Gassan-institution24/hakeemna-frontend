import PropTypes from 'prop-types';

import { Box, Stack, Container } from '@mui/material';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { useTranslate } from 'src/locales';

import ProfileRail from 'src/components/profile-rail';
import { useSettingsContext } from 'src/components/settings';

import PatientBanner from './patient-banner';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'patient-profile-rail';

// The frame both patient profiles render inside: identity banner on top, a
// grouped section rail beside the active pane.
//
// Panes are handed through untouched — they each bring their own Container and
// their own background, and rewriting fifteen of them is a separate job from
// changing the frame around them.
export default function PatientProfileShell({
  patient,
  loading,
  bannerActions,
  backTo,
  pinned,
  sections,
  section,
  onChangeSection,
  children,
}) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  // useLocalStorage merges objects into state, so it needs one.
  const { state, update } = useLocalStorage(STORAGE_KEY, { collapsed: false });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ pt: 2, pb: 4 }}>
      <PatientBanner
        patient={patient}
        loading={loading}
        actions={bannerActions}
        backTo={backTo}
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
        <ProfileRail
          pinned={pinned}
          sections={sections}
          value={section}
          onChange={onChangeSection}
          collapsed={state.collapsed}
          onToggleCollapse={() => update('collapsed', !state.collapsed)}
          collapseLabel={t('Collapse menu')}
          expandLabel={t('Expand menu')}
          browseLabel={t('Section')}
        />

        <Box
          sx={{
            flex: 1,
            // Without this a pane with a wide table (financial, appointments)
            // refuses to shrink and pushes the rail off the page.
            minWidth: 0,
            // Panes wrap themselves in an xl Container. Nested inside this one
            // that doubles the horizontal padding, so neutralise the pane's own
            // — direct children only, so inner containers are left alone. The
            // doubled specificity beats MUI's .MuiContainer-maxWidthXl.
            '&& > .MuiContainer-root': { maxWidth: 'none', px: 0 },
          }}
        >
          {children}
        </Box>
      </Stack>
    </Container>
  );
}

const itemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.node,
  icon: PropTypes.string,
  tooltip: PropTypes.node,
});

PatientProfileShell.propTypes = {
  patient: PropTypes.object,
  loading: PropTypes.bool,
  bannerActions: PropTypes.node,
  backTo: PropTypes.string,
  pinned: PropTypes.arrayOf(itemShape),
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.node,
      items: PropTypes.arrayOf(itemShape),
    })
  ),
  section: PropTypes.string,
  onChangeSection: PropTypes.func,
  children: PropTypes.node,
};
