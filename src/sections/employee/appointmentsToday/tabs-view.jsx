import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useState, useCallback } from 'react';

import { Tab, Box, Tabs, Stack } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { useGetOneEntranceManagement } from 'src/api';

import Iconify from 'src/components/iconify';

import SickLeave from './sickLeave';
import Radiology from './radiology';
import Diagnosis from './diagnosis';
import Prescription from './prescription';
import Doctorreport from './doctorReport';
import Medicalreport from './medicalreport';
import MedicalAnalysis from './medical-analysis';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TAB_META = [
  { value: 'one',   title: 'diagnosis',        icon: 'solar:stethoscope-bold-duotone' },
  { value: 'two',   title: 'Patient file',      icon: 'solar:user-id-bold-duotone' },
  { value: 'three', title: 'prescription',      icon: 'solar:pill-bold-duotone' },
  { value: 'four',  title: 'medical report',    icon: 'healthicons:medical-records-outline' },
  { value: 'five',  title: 'sick leave',        icon: 'solar:document-medicine-bold-duotone' },
  { value: 'six',   title: 'medical analysis',  icon: 'solar:test-tube-bold-duotone' },
  { value: 'seven', title: 'radiology',         icon: 'solar:bone-bold-duotone' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TabsView({ patient, unit_service_patient, service_unit }) {
  const [currentTab, setCurrentTab] = useState('one');
  const params = useParams();
  const { id } = params;
  const { t } = useTranslate();
  const theme = useTheme();

  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });

  const TABS = [
    {
      value: 'one',
      content: <Diagnosis Entrance={Entrance} />,
    },
    {
      value: 'two',
      content: <Doctorreport Entrance={Entrance} />,
    },
    {
      value: 'three',
      content: <Prescription Entrance={Entrance} />,
    },
    {
      value: 'four',
      content: <Medicalreport Entrance={Entrance} />,
    },
    {
      value: 'five',
      content: (
        <SickLeave
          patient={patient}
          service_unit={service_unit}
          unit_service_patient={unit_service_patient}
          Entrance={Entrance}
        />
      ),
    },
    {
      value: 'six',
      content: <MedicalAnalysis Entrance={Entrance} />,
    },
    {
      value: 'seven',
      content: <Radiology Entrance={Entrance} />,
    },
  ];

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const activeContent = TABS.find((tab) => tab.value === currentTab)?.content;

  return (
    <Stack spacing={0}>
      {/* Scrollable tab bar */}
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          mb: 0,
          '& .MuiTab-root': {
            minHeight: 52,
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'none',
            gap: 0.75,
            px: 2,
          },
          '& .Mui-selected': {
            color: 'primary.main',
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {TAB_META.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={t(tab.title)}
            icon={<Iconify icon={tab.icon} width={18} />}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {/* Tab content */}
      <Box
        sx={{
          mt: 2.5,
          p: 2.5,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.grey[500], 0.04),
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          minHeight: 120,
        }}
      >
        {activeContent}
      </Box>
    </Stack>
  );
}

TabsView.propTypes = {
  patient: PropTypes.object,
  unit_service_patient: PropTypes.string,
  service_unit: PropTypes.string,
};
