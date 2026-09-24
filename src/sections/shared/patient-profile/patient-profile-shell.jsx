import PropTypes from 'prop-types';

import ProfileShell from 'src/components/profile-shell';

import PatientBanner from './patient-banner';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'patient-profile-rail';

// The patient flavour of the shared profile frame: the generic shell
// (src/components/profile-shell) supplies the layout and the rail, this supplies the patient
// identity banner. The employee and unit-service profiles do the same with their own banners.
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
  return (
    <ProfileShell
      storageKey={STORAGE_KEY}
      banner={
        <PatientBanner
          patient={patient}
          loading={loading}
          actions={bannerActions}
          backTo={backTo}
        />
      }
      pinned={pinned}
      sections={sections}
      section={section}
      onChangeSection={onChangeSection}
    >
      {children}
    </ProfileShell>
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
