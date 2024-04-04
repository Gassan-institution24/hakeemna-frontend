import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import StakeholderOfferContent from './offer-view-content';
import StakeholderOfferToolbar from './offer-view-toolbar';

// ----------------------------------------------------------------------

export default function StakeholderOfferView({ stakeholderData, offerData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth="xl">
      <StakeholderOfferToolbar
        backLink={paths.superadmin.stakeholders.offers(stakeholderData._id)}
        // editLink={paths.superadmin.stakeholders.edit(`${stakeholderData?._id}`)}
      />

      <StakeholderOfferContent offerData={offerData} stakeholderData={stakeholderData} />
    </Container>
  );
}

StakeholderOfferView.propTypes = {
  stakeholderData: PropTypes.object,
  offerData: PropTypes.object,
};
