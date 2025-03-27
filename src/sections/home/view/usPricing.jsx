import * as React from 'react';
import { m } from 'framer-motion';

import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetSubscriptionsInhome } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

export default function UsPricing() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { subscriptionsData } = useGetSubscriptionsInhome();

  return (
    <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 10, md: 15 } }}>
      <m.div variants={varFade().inDown}>
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
          {t('Pricing')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography variant="h2" sx={{ my: 3 }}>
          {t('Get the right offer for your unit of service')}
        </Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography
          sx={{
            mx: 'auto',
            maxWidth: 640,
            color: 'text.secondary',
          }}
        >
          {t('Start growing your business with Hakeemna.com')}
        </Typography>
      </m.div>

      <Card
        component={m.div}
        variants={varFade().in}
        sx={{
          px: 1.5,
          m: 1.5,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          bgcolor: '#E4F6F2',
        }}
      >
        {subscriptionsData.map((member, index) => (
          <Box
            sx={{
              ...(index === 1 && {
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
              }),
              m: 3,
              ...(index === 0 && { border: '#ececec 1px solid' }),
              ...(index === 2 && { border: '#ececec 1px solid' }),
              backgroundColor: 'white',
            }}
          >
            <Typography variant="subtitle1" sx={{ mt: 2.5, mb: 0.5 }}>
              {curLangAr ? member?.name_arabic : member?.name_english}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary' }}>
              <Typography>
                {' '}
                <Iconify icon="bx:dollar" sx={{ color: '#22C55E' }} />{' '}
                {member?.price_in_usd === 0 ? t('FREE') : member?.price_in_usd} /{' '}
                {member?.period_in_months} {t('Month')}
              </Typography>
              {member?.Users_num} {t('Users')}
            </Typography>
            <Divider sx={{ borderStyle: 'dashed', borderBottomWidth: 2 }} />
            <ul
              style={{
                listStyle: 'none',
                textAlign: curLangAr ? 'right' : 'left',
                marginLeft: curLangAr ? 0 : -15,
                marginTop: 25,
                marginBottom: 60,
              }}
            >
              {member?.package_appointment === true && (
                <li>
                  <Iconify
                    icon="material-symbols:check"
                    width={15}
                    color="success.main"
                    sx={{ mr: 1, border: '1px solid #1F2C5C', borderRadius: 2 }}
                  />{' '}
                  {t('Appointment Package')}
                </li>
              )}
              {member?.package_accounting === true && (
                <li>
                  <Iconify
                    icon="material-symbols:check"
                    width={15}
                    color="success.main"
                    sx={{ mr: 1, border: '1px solid #1F2C5C', borderRadius: 2 }}
                  />{' '}
                  {t('Accounting Package')}
                </li>
              )}
              {member?.package_docotor_report === true && (
                <li>
                  <Iconify
                    icon="material-symbols:check"
                    width={15}
                    color="success.main"
                    sx={{ mr: 1, border: '1px solid #1F2C5C', borderRadius: 2 }}
                  />{' '}
                  {t('Docotor Report Package')}
                </li>
              )}
              {member?.package_final_reporting === true && (
                <li>
                  <Iconify
                    icon="material-symbols:check"
                    width={15}
                    color="success.main"
                    sx={{ mr: 1, border: '1px solid #1F2C5C', borderRadius: 2 }}
                  />{' '}
                  {t('Final Reporting Package')}
                </li>
              )}
              {member?.package_old_files_Management === true && (
                <li>
                  <Iconify
                    icon="material-symbols:check"
                    width={15}
                    color="success.main"
                    sx={{ mr: 1, border: '1px solid #1F2C5C', borderRadius: 2 }}
                  />{' '}
                  {t('Old Files Management Package')}
                </li>
              )}
              {member?.package_TAX_Income_reporting === true && (
                <li>
                  <Iconify
                    icon="material-symbols:check"
                    width={15}
                    color="success.main"
                    sx={{ mr: 1, border: '1px solid #1F2C5C', borderRadius: 2 }}
                  />{' '}
                  {t('TAX Income Reporting Package')}
                </li>
              )}
            </ul>
            <Button
              variant="contained"
              alignItems="center"
              justifyContent="center"
              href={paths.auth.registersu}
              sx={{
                // p: 1,
                backgroundColor: '#1F2C5C',
                mb: 2,
                position: 'absolute',
                bottom: 20,
                ml: -5.5,
                width: '8%',
              }}
            >
              {t('Select')}
            </Button>
          </Box>
        ))}
      </Card>
      <m.div variants={varFade().in}>
        <Box
          sx={{
            textAlign: 'center',
            mt: {
              xs: 5,
              md: 10,
            },
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography variant="h4">{t('Still have questions ?')}</Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
              {t('Please describe your case to receive the most accurate respons.')}
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Button
              color="inherit"
              size="large"
              variant="contained"
              href="mailto:info@hakeemna.com?subject=[Feedback] from Customer"
            >
              {t('contact us')}
            </Button>
          </m.div>
        </Box>
      </m.div>
    </Container>
  );
}
