import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Stack, Button, Container, Tabs, Tab, Box } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSPCommunication } from 'src/api/uspcommunication';

import UnitServiceVideoCallsTableView from 'src/sections/unit-service/videocalls/UnitServiceVideoCallsTableView';

import CommunicationItem from './items/communication/communication-item';
import CommunicationUpload from './items/communication/communication-upload';

function CommunicationContent({ patient, data, refetch, showAdd, setShowAdd, t }) {
  return (
    <>
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? t('X') : t('new communication')}
        </Button>
      </Stack>
      {showAdd && (
        <CommunicationUpload
          patient={patient}
          refetch={() => {
            setShowAdd(false);
            refetch();
          }}
        />
      )}
      {data?.map((one, idx) => (
        <CommunicationItem key={idx} one={one} refetch={refetch} />
      ))}
    </>
  );
}

CommunicationContent.propTypes = {
  patient: PropTypes.object,
  data: PropTypes.array,
  refetch: PropTypes.func,
  showAdd: PropTypes.bool,
  setShowAdd: PropTypes.func,
  t: PropTypes.func,
};

export default function PatientCommunication({ patient }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, refetch } = useGetUSPCommunication({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
  });

  const [showAdd, setShowAdd] = React.useState(false);
  const [currentTab, setCurrentTab] = useState('communication');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'communication',
      title: t('communication'),
      label: <CommunicationContent patient={patient} data={data} refetch={refetch} showAdd={showAdd} setShowAdd={setShowAdd} t={t} />,
    },
    {
      value: 'video_calls',
      title: t('Video calls'),
      label: <UnitServiceVideoCallsTableView patient={patient} />,
    },
  ];

  return (
    <Container sx={{ backgroundColor: 'background.neutral', py: 3 }} maxWidth="xl">
      <Tabs value={currentTab} onChange={handleChangeTab}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={t(tab.title)} />
        ))}
      </Tabs>

      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box
              key={tab.value}
              sx={{
                pt: 3,
              }}
            >
              {tab.label}
            </Box>
          )
      )}
    </Container>
  );
}
PatientCommunication.propTypes = { patient: PropTypes.object };
