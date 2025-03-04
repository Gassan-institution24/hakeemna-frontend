import { useMemo, useState } from 'react';
import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { useLocales, useTranslate } from 'src/locales';
import { varFade, MotionViewport } from 'src/components/animate';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

export default function WhoAreWe() {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const CARDS = useMemo(
    () => [
      {
        title: t('Electronic Medical Hub'),
        description: t(
          'A platform that brings together providers and providers of medical and health care services (institutions, doctors, and others) with users of those services at one conglomeration point, with the goal being for everyone to benefit from this alliance in the new and distinctive Arab world.'
        ),
      },
      {
        title: t('Autonomy'),
        description: t(
          'The currently available electronic health records platforms cannot be used or benefited from them if you are not a subscriber as a beneficiary (patient) in health insurance coverage. Likewise, if you are a provider and provider of medical services or health care, you will not be able to use the platforms available in the market if you are not a member of one of them. Healthcare service management organizations. Therefore, the Hakeemna platform allows everyone (patient and medical service provider) to join our family and benefit from all the benefits independently without the requirement of joining one of the “health care services management” institutions or subscribing to an insurance company.'
        ),
      },
      {
        title: t('Credibility and transparency'),
        description: t(
          'Using our platform enables all categories of users (service providers and users of those services, such as patients) to communicate electronically in a convenient and transparent manner, which helps in expressing opinions and evaluating each party for the other, which increases awareness and raises credibility and transparency. This helps in the continuous development of the services provided and raises loyalty. Users of this distinguished medical group.'
        ),
      },
      {
        title: t('Research and Development'),
        description: t(
          'We seek to support and participate in scientific research in all relevant fields and development aimed at raising the level of performance and excellence in institutions in the Arab and Islamic world. Joining this platform contributes to supporting scientific research, development, and transfer of expertise and knowledge (knowledge transfer) from academic institutions to institutions operating in the private and government sectors.'
        ),
      },
      {
        title: t('Green Management'),
        description: t(
          'This platform is designed to be a gateway towards sustainability and management committed to protecting the environment. Joining this platform makes you partners in efforts to preserve the environment and combat desertification by raising awareness and reducing activities that pollute the environment.'
        ),
      },
      {
        title: t('User Friendly And Flexible'),
        description: t(
          'Easy to use and flexible: The platform is designed to be easy to learn and use. A free training program is also available for service providers to familiarize themselves with all aspects of this platform.'
        ),
      },
    ],
    [t]
  );

  // Dialog state for displaying full description
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');

  const handleDialogOpen = (description) => {
    setDialogContent(description);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#F2FBF8',
    ...theme.typography.body2,
    padding: theme.spacing(4),
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.25)',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 10 },
        mb: '150px',
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: -1 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography
            sx={{
              fontSize: 45,
              fontWeight: 600,
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
            }}
          >
            {t('our goals')}
          </Typography>
        </m.div>
      </Stack>
      <Box sx={{ flexGrow: 1, mt: 5 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {CARDS.map((card, index) => (
            <Grid item xs={2} sm={4} md={4} key={index} >
              <Item>
                <Typography variant="h5" sx={{ mb: 2 }}>{card.title}</Typography>
                <Typography>
                  {card.description.length > 90 ? (
                    <>
                      {card.description.slice(0, 90)}...
                      <Button
                        onClick={() => handleDialogOpen(card.description)}
                        sx={{ textTransform: 'none', ml: 1, color: '#3CB099' }}
                      >
                        {t('Read More')}
                      </Button>
                    </>
                  ) : (
                    card.description
                  )}
                </Typography>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog for full description */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t('Description')}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
