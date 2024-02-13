
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useCountdownDate } from 'src/hooks/use-countdown';

import { useTranslate } from 'src/locales';
import { ComingSoonIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function ComingSoonView() {
  const { days, hours, minutes, seconds } = useCountdownDate(new Date('07/07/2024 21:30'));
  const { t } = useTranslate();

  return (
    <>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {t('Coming Soon!')}
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        {t('We are currently working hard on this page!')}
      </Typography>

      <ComingSoonIllustration sx={{ my: 10, height: 240 }} />

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
        sx={{ typography: 'h2' }}
      >
        <TimeBlock label={t('Days')} value={days} />

        <TimeBlock label={t('Hours')} value={hours} />

        <TimeBlock label={t('Minutes')} value={minutes} />

        <TimeBlock label={t('Seconds')} value={seconds} />
      </Stack>
      {/* 
      <TextField
        fullWidth
        placeholder="Enter your email"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button variant="contained" size="large">
                Notify Me
              </Button>
            </InputAdornment>
          ),
          sx: {
            pr: 0.5,
            [`&.${outlinedInputClasses.focused}`]: {
              boxShadow: (theme) => theme.customShadows.z20,
              transition: (theme) =>
                theme.transitions.create(['box-shadow'], {
                  duration: theme.transitions.duration.shorter,
                }),
              [`& .${outlinedInputClasses.notchedOutline}`]: {
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
              },
            },
          },
        }}
        sx={{ my: 5 }}
        /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function TimeBlock({ label, value }) {
  return (
    <div>
      <Box> {value} </Box>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}

TimeBlock.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

// import Grid from '@mui/material/Unstable_Grid2';
// // import AccountBillingPayment from '../other/account/account-billing-payment';
// // import AccountBillingHistory from '../other/account/account-billing-history';
// // import AccountBillingAddress from '../other/account/account-billing-address';
// import ComingSoonView from 'src/sections/coming-soon/view';

// // ----------------------------------------------------------------------

// export default function FinancilMovment() {
//   return (
//     <Grid container spacing={5} disableEqualOverflow>
//       {/* <Grid xs={12} md={8}>
//         {/* <AccountBillingPayment /> */}
//         {/* <AccountBillingAddress /> */}
//       {/* </Grid>
//       <Grid
//         xs={12}
//         md={4}
//         title="Invoice History"
//         sx={{
//           position: { md: 'relative' },
//           top: { md: '24px' },
//         }}
//       > */}
//         {/* <AccountBillingHistory /> */}

//       {/* </Grid> */}
//       <ComingSoonView />
//     </Grid>
//   );
// }
