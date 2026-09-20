import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSPCommunication } from 'src/api/usp_communication';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { RecordGrid } from 'src/sections/shared/patient-profile/record-card';
import UnitServiceVideoCallsTableView from 'src/sections/unit-service/videocalls/UnitServiceVideoCallsTableView';

import CommunicationItem from './items/communication/communication-item';
import CommunicationUpload from './items/communication/communication-upload';

export default function PatientCommunication({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, loading, error, refetch } = useGetUSPCommunication({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = useState(false);
  const [currentTab, setCurrentTab] = useState('communication');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const rows = Array.isArray(data) ? data : [];
  const onMessages = currentTab === 'communication';

  // The two tabs used to be built as an array whose `label` held a whole
  // rendered subtree, so both were constructed on every render whichever one was
  // showing -- and the video call table mounted its own fetch behind the tab you
  // were not looking at.
  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab} sx={{ minHeight: 40 }}>
      <Tab value="communication" label={t('Messages')} sx={{ minHeight: 40 }} />
      <Tab value="video_calls" label={t('Video calls')} sx={{ minHeight: 40 }} />
    </Tabs>
  );

  return (
    <ProfilePane
      icon="solar:chat-round-dots-bold-duotone"
      title={t('Patient Communication')}
      toolbar={renderTabs}
      count={onMessages ? rows.length : undefined}
      loading={onMessages && loading}
      error={onMessages ? error : undefined}
      isEmpty={onMessages && !rows.length}
      emptyTitle={t('No messages')}
      emptyDescription={t('Messages exchanged with this patient appear here.')}
      // The add form belongs to the messages tab only; on the video call tab
      // there is nothing for it to create.
      addLabel={onMessages ? t('New Communication') : undefined}
      adding={showAdd}
      onToggleAdd={onMessages ? () => setShowAdd((open) => !open) : undefined}
      form={
        onMessages ? (
          <CommunicationUpload
            patient={patient}
            refetch={() => {
              setShowAdd(false);
              refetch();
            }}
          />
        ) : null
      }
    >
      {onMessages ? (
        <RecordGrid min={420}>
          {rows.map((one) => (
            <CommunicationItem key={one._id} one={one} refetch={refetch} />
          ))}
        </RecordGrid>
      ) : (
        <UnitServiceVideoCallsTableView patient={patient} />
      )}
    </ProfilePane>
  );
}
PatientCommunication.propTypes = { patient: PropTypes.object };
