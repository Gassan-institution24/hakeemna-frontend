import * as React from 'react';

import { Box } from '@mui/system';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

const DATA = [
  {
    headline: 'Manage old paper patient files.',
  },
  {
    headline: 'Managing patient records electronically.',
  },
  {
    headline: 'Organizing relationships with patients.',
  },
  {
    headline: 'Increase patient satisfaction.',
  },
  {
    headline: 'Making patient budgets and managing files.',
  },
  {
    headline: 'Freedom from excessive use of paper documents and files.',
  },
  {
    headline:
      'Managing the daily work of medical institutions with the aim of improving performance and raising efficiency.',
  },
  {
    headline: 'Preparing medical reports and prescriptions electronically.',
  },
  {
    headline: 'Patients and suppliers communicate with me electronically.',
  },
  {
    headline: 'Appointment management',
  },
  {
    headline: 'Marketing campaigns.',
  },
  {
    headline: 'Electronic signature.',
  },
  {
    headline: 'Storing the medical institution’s files and data in the cloud.',
  },
  {
    headline: 'Financial Affairs Administration.',
  },
  {
    headline: 'Medical Affairs Department.',
  },
  {
    headline: 'Managing departments and activities.',
  },
  {
    headline: 'Department of Human Ressources.',
  },
  {
    headline: 'Agenda management.',
  },
  {
    headline: 'Organizing relationships and business with other medical institutions.',
  },
  {
    headline: 'The ability to make modifications to suit the needs of each client.',
  },
  {
    headline: 'Belonging to the Arab Medical Society Network.',
  },
];

export default function VerticalDividerText() {
  const theme = useTheme();

  return (
    <>
      <Divider orientation="vertical" flexItem sx={{ mb: 10 }}>
        <h1> WHAT WE DO</h1>
        <h5 style={{ color: 'gray' }}>Get ready to manage your work with doctorna</h5>
      </Divider>
      <Box
        container
        sx={{
          display: 'grid',
          gridTemplateColumns: { xl: '1fr 1fr 1fr', lg: '1fr 1fr 1fr', md: '1fr 1fr', xs: '1fr' },
          placeItems: 'center',
          gap: 10,
          mb: 10,
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Iconify
            icon="medical-icon:i-social-services"
            sx={{
              width: '16%',
              height: '16%',
              bgcolor: 'success.main',
              color: 'white',
              justifyContent: 'center',
              borderRadius: '50%',
              p: 2.2,
            }}
          />
          <h3>Patient management and medical records</h3>
          <Box
            sx={{
              listStyle: 'none',
              textAlign: 'start',
              position: 'relative',
              left: { xl: 10, lg: 5, md: 10, xs: 0 },
            }}
          >
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Patients and suppliers communicate with me
              electronically.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Preparing medical reports and prescriptions
              electronically.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Freedom from excessive use of paper documents
              and files.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Making patient budgets and managing files.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Managing patient records electronically.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Organizing relationships with patients.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Manage old paper patient files.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Increase patient satisfaction.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Appointment management.
            </li>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Iconify
            icon="nimbus:marketing"
            sx={{
              width: '17%',
              height: '17%',
              bgcolor: 'success.main',
              color: 'white',
              justifyContent: 'center',
              borderRadius: '50%',
              p: 2.3,
            }}
          />
          <h3>Marketing and public relations</h3>
          <Box sx={{ listStyle: 'none', position: 'relative', left: { md: 40, xs: 0 } }}>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Organizing ties and business with medical
              institutions.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Belonging to the Arab Medical Society Network.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Marketing campaigns.
            </li>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Iconify
            icon="material-symbols-light:finance-mode-rounded"
            sx={{
              width: '21%',
              height: '21%',
              bgcolor: 'success.main',
              color: 'white',
              justifyContent: 'center',
              borderRadius: '50%',
              p: 2,
            }}
          />
          <h3>Business and Finance Administration</h3>
          <Box
            sx={{
              listStyle: 'none',
              position: 'relative',
              left: { xl: -20, lg: -20, md: -20, xs: -20 },
            }}
          >
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Cloud storage for medical institution data.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Financial Affairs Administration.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Agenda management.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Electronic signature.
            </li>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Iconify
            icon="tdesign:institution-checked"
            sx={{
              width: '15%',
              height: '15%',
              bgcolor: 'success.main',
              color: 'white',
              justifyContent: 'center',
              borderRadius: '50%',
              p: 2,
            }}
          />
          <h3>Management of medical institutions</h3>
          <Box
            sx={{
              listStyle: 'none',
              position: 'relative',
              left: { xl: 50, lg: 25, md: 50, xs: 0 },
            }}
          >
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Enhancing medical institution efficiency
              through daily management.
            </li>
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Managing departments and activities.
            </li>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Iconify
            icon="oui:app-uptime"
            sx={{
              width: '17%',
              height: '17%',
              bgcolor: 'success.main',
              color: 'white',
              justifyContent: 'center',
              borderRadius: '50%',
              p: 2,
            }}
          />
          <h3>Flexibility in services</h3>
          <Box
            sx={{
              listStyle: 'none',
              position: 'relative',
              left: { xl: 90, lg: 90, md: 100, xs: 0 },
            }}
          >
            <li style={{ fontSize: '13px' }}>
              <Iconify icon="openmoji:check-mark" /> Ability to make modifications to suit the needs
              of each client.
            </li>
          </Box>
        </Box>
      </Box>
    </>
  );
}
