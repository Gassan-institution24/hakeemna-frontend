import * as React from 'react';

import MuiGrid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import Image from 'src/components/image';

import patient from 'src/sections/home/view/patients.png';

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

const DATA = [
  {
    headline: 'Recording and storing data electronically.',
  },
  {
    headline: 'Storing old medical history and recording recent data in an automated manner.',
  },
  {
    headline: 'Storing medical files and images electronically.',
  },
  {
    headline:
      'Communicate with all medical institutions and doctors electronically in the same country or in other countries.',
  },
  {
    headline: 'Request remote medical consultations and appointments.',
  },
  {
    headline: 'Book appointments electronically.',
  },
  {
    headline: 'Subscribe to the medical journal.',
  },
  {
    headline: 'View medical developments.',
  },
  {
    headline:
      'Providing various services to patients traveling to another country for medical treatment.',
  },
  {
    headline:
      ' Follow up and manage all medical affairs through the application or on the browser.',
  },
  {
    headline: 'Belonging to the Arab Medical Society Network.',
  },
  {
    headline: 'Free subscription.',
  },
];

export default function VerticalDividerText() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={isMobile ? 2 : 0}>
      {!isMobile ? (
        <Grid container>
          <Grid
            item
            xs
            sx={{
              fontWeight: 600,
            }}
          >
            <ul style={{ margin: 10 }}>
              {DATA.map((data, idx) => (
                <li style={{ margin: 5 }}>{data.headline}</li>
              ))}
            </ul>
          </Grid>
          <Divider orientation="vertical" flexItem>
            <h1>
              {' '}
              SERVICES <br /> <span style={{ color: 'rgb(0, 186, 0)' }}>FOR</span>
              <br />
              PATIENTS
            </h1>
          </Divider>
          <Grid item xs>
            <Image
              alt="patient"
              src={patient}
              sx={{
                width: 'auto',
                height: 'auto',
              }}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h2>SERVICES FOR PATIENTS</h2>
            <hr />
          </Divider>
          <Grid
            sx={{
              width: '380px',
              p: 2,
              fontWeight: 500,
            }}
          >
            <ul style={{ margin: 10 }}>
              {DATA.map((data, idx) => (
                <li style={{ margin: 5 }}>{data.headline}</li>
              ))}
            </ul>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
