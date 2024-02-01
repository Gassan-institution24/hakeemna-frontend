import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';

import { _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Contact from '../contactus';

// ----------------------------------------------------------------------

export default function ContactUsView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const currentUser = _userList.find((user) => user.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('contact us')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('user'),
            href: paths.dashboard.user.root,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Contact currentUser={currentUser} />
    </Container>
  );
}

ContactUsView.propTypes = {
  id: PropTypes.string,
};
