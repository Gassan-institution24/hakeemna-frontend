import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import unit from 'src/sections/home/view/uns.webp';
import Image from 'src/components/image';
import { useMediaQuery } from '@mui/material';

const Grid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

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
              {DATA.map((data) => (
                <>
                  <li style={{margin: 5}}>{data.headline}</li>
                </>
              ))}
            </ul>
          </Grid>
          <Divider orientation="vertical" flexItem>
            <h1>
              {' '}
              SERVICES <br /> <span style={{ color: 'rgb(0, 186, 0)' }}>FOR</span>
              <br />
              UNITSERVICES
            </h1>
          </Divider>
          <Grid item xs>
            <Image
              alt="unit servic"
              src={unit}
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
            <h2>SERVICES FOR UNITSERVICES</h2>
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
              {DATA.map((data) => (
                <>
                  <li style={{margin: 5}}>{data.headline}</li>
                </>
              ))}
            </ul>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
