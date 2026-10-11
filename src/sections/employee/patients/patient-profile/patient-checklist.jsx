import PropTypes from 'prop-types';

import PatientQuestionnaires from 'src/sections/shared/questionnaires/patient-questionnaires';

// ----------------------------------------------------------------------

export default function PatientCheckList({ patient }) {
  return <PatientQuestionnaires uspId={patient?._id} />;
}

PatientCheckList.propTypes = {
  patient: PropTypes.object,
};
