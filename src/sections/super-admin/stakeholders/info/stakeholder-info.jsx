import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { useSettingsContext } from 'src/components/settings';

import StakeholderDetailsContent from './stakeholder-info-content';
import StakeholderDetailsToolbar from './stakeholder-info-toolbar';

// ----------------------------------------------------------------------

export default function StakeholderDetailsView({ stakeholderData }) {
  // const settings = useSettingsContext();

  return (
    <Container maxWidth="xl">
      <StakeholderDetailsToolbar
        backLink={paths.superadmin.stakeholders.root}
        // editLink={paths.superadmin.stakeholders.edit(`${stakeholderData?._id}`)}
        liveLink="#"
      />

      <StakeholderDetailsContent stakeholderData={stakeholderData} />
    </Container>
  );
}

StakeholderDetailsView.propTypes = {
  stakeholderData: PropTypes.object,
};
