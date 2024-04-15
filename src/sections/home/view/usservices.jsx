import * as React from 'react';

import { Box } from '@mui/system';
import { Divider, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetSubscriptionsInhome } from 'src/api';

import Iconify from 'src/components/iconify';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

// import { _socials, _carouselsMembers } from 'src/_mock';

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';
import Carousel, { CarouselArrows } from 'src/components/carousel';

const _socials = ['red', 'black'];

export default function VerticalDividerText() {
  const { t } = useTranslate();
  const { subscriptionsData } = useGetSubscriptionsInhome();
  console.log(subscriptionsData, 'sdsdsdsd');

  return (
    <>
      <Divider orientation="vertical" flexItem sx={{ mb: 10 }}>
        <h1>{t('WHAT WE DO')}</h1>
        {/* <h6 style={{ color: 'gray' }}>
      
    </h6> */}
      </Divider>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: '1fr',
            xs: '1fr',
            md: '1fr 1fr ',
            lg: '1fr 1fr ',
            xl: '1fr 1fr 1fr',
          },
          m: 6,
        }}
      >
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify icon="oui:app-index-management" width={35} sx={{ color: 'white', m: 1.5 }} />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            {t('Regulatory affairs')}
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Managing departments and activities.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Department of Human Ressources.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              The ability to manage each department and each work team independently.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Manage the agenda independently for everyone who works in the medical institution.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              The possibility for the visiting doctor or consultant to book an appointment
              electronically at an independent medical institution (such as a hospital) to perform
              an operation, for example, and send the patient’s information electronically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Manage and book appointments electronically independently for each employee (such as a
              doctor) and for each work team.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Organizing relationships and business with other medical institutions (such as
              hospitals/medical laboratories, etc.).
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              The ability to make modifications to match and adapt to the needs of each client (such
              as Medical Checklist, instructions, and reports).
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Continuous employee training and development according to the needs of each
              organization.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Various working tools to organize daily practices.
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify icon="healthicons:outpatient" width={35} sx={{ color: 'white', m: 1.5 }} />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            {t('Patient Affairs')}
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Managing old paper patient
              files and storing them in electronic records.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Managing patient records
              and files electronically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Improving the mechanism
              for accessing your medical information and patient files and the ability to access the
              rest of the data and medical history.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Support better
              decision-making in patient care.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Managing and organizing
              public relations electronically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Organizing patient
              relations and affairs.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Increasing patient and
              visitor satisfaction with the services provided and reducing waiting time in the
              clinic and other medical institutions.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Making financial budgets
              for patients and managing premiums.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} /> Contributing to reducing
              medical errors related to medication conflicts.
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify icon="tabler:repeat" width={35} sx={{ color: 'white', m: 1.5 }} />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            {t('Routine and bureaucratic administrative')}
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Managing the daily work of medical institutions with the aim of improving performance
              and raising efficiency.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Preparing medical reports and prescriptions electronically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Freedom from repetitive procedures (bureaucratic routine) and reducing the excessive
              use of paper documents and files in accordance with sustainability plans.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Communicate with patients and suppliers electronically.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Managing appointments for patients, and the ability to book appointments in hospitals
              participating in our platform to reserve the operating room or any other department.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Marketing campaigns.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Electronic signature and payment.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Storing the medical institution’s data and files in the cloud and protecting its
              independence and confidentiality.
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify
              icon="fluent-mdl2:financial-solid"
              width={35}
              sx={{ color: 'white', m: 1.5 }}
            />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            {t('Financial and tax affairs')}
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Managing financial affairs and the fund.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Managing annual tax affairs.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Preparing annual tax return reports.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Managing financial deductions from the Doctors Syndicate, income tax, and others.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Organizing financial claims with medical institutions such as hospitals and insurance
              companies.
            </li>
          </ul>
        </Box>
        <Box
          sx={{
            mb: 10,
            width: {
              sm: '100%',
              xs: '100%',
              md: '100%',
              lg: '100%',
              xl: '90%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: 'success.main',
              width: 60,
              height: 60,
              textAlign: 'center',
              borderRadius: 20,
              margin: 'auto',
              mb: 1,
            }}
          >
            <Iconify icon="ph:list-star-light" width={35} sx={{ color: 'white', m: 1.5 }} />
          </Box>
          <Typography sx={{ textAlign: 'center' }} variant="h4">
            {t('Other features')}
          </Typography>
          <ul style={{ listStyle: 'none' }}>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Reducing costs for managing the organization.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Possibility of using a phone, tablet, or computer.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              The possibility of making modifications (customization) that match the needs of each
              medical institution.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              The platform was designed to work with more than one language.
            </li>
            <li
              style={{
                fontSize: '12px',
                border: '2px dashed #E8E8E8',
                marginBottom: 5,
                padding: 5,
              }}
            >
              <Iconify icon="token:dot" sx={{ color: 'success.main' }} />
              Belonging to the Arab Medical Society Network includes obtaining the following{' '}
              <span style={{ color: '#22C55E', fontSize: '14px' }}>benefits:</span>
            </li>
            <ol style={{ fontSize: '12px' }}>
              <li>Reaching new patients</li>
              <li>Improving the experience of communication and dealing with the patient.</li>
              <li>Providing medical care in a manner compatible with this digital age.</li>
              <li>Better data management.</li>
              <li>Keeping pace with technological market requirements</li>
            </ol>
          </ul>
        </Box>
      </Box>

      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 10, md: 15 } }}>
        <m.div variants={varFade().inDown}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            Pricing
          </Typography>
        </m.div>

        <m.div variants={varFade().inUp}>
          <Typography variant="h2" sx={{ my: 3 }}>
            Get the right offer for your service unit
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
            Start glowing up your work with Hakeemna.com
          </Typography>
        </m.div>

        <Box sx={{ position: 'relative' }}>
          <CarouselArrows
            filled
            shape="rounded"
            onNext={subscriptionsData.onNext}
            onPrev={subscriptionsData.onPrev}
            leftButtonProps={{
              sx: {
                left: 24,
                ...(subscriptionsData.length < 5 && { display: 'none' }),
              },
            }}
            rightButtonProps={{
              sx: {
                right: 24,
                ...(subscriptionsData.length < 5 && { display: 'none' }),
              },
            }}
          >
            <Carousel>
              {subscriptionsData.map((member) => (
                <Box
                  key={member.id}
                  component={m.div}
                  variants={varFade().in}
                  sx={{
                    px: 1.5,
                    py: { xs: 8, md: 10 },
                  }}
                >
                  <MemberCard member={member} />
                </Box>
              ))}
            </Carousel>
          </CarouselArrows>
        </Box>

        <Button
          size="large"
          color="inherit"
          variant="outlined"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={24} />}
          sx={{ mx: 'auto' }}
        >
          All Members
        </Button>
      </Container>
    </>
  );
}

function MemberCard({ member }) {
  return (
    <Card>
      <Typography variant="subtitle1" sx={{ mt: 2.5, mb: 0.5 }}>
        {member?.name_english}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary' }}>
        {member?.price_in_usd} - {member?.period_in_months}
      </Typography>

      {/* <Box sx={{ px: 1 }}>
        <Image
          src="https://www.revenuecat.com/static/759854069658d26585c189d5c984313b/f2ab1/60706bf8c76297558975edbc_ios-subscription-offers-config.png"
          ratio="1/1"
          sx={{ borderRadius: 2 }}
        />
      </Box> */}

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 2 }}>
        <IconButton>
          <Iconify icon="skill-icons:instagram" />
        </IconButton>
      </Stack>
    </Card>
  );
}
MemberCard.propTypes = {
  member: PropTypes.object,
};
