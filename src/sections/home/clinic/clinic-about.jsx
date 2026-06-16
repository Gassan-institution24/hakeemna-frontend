import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { HTMLToText } from 'src/utils/convert-to-html';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import ChipList from '../components/chip-list';
import ReadMoreText from '../components/read-more-text';
import SectionHeading from '../components/section-heading';
import WorkingHoursWidget from '../components/working-hours-widget';

// ----------------------------------------------------------------------

export default function ClinicAbout({ USData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const {
    introduction_letter,
    arabic_introduction_letter,
    work_days,
    work_start_time,
    work_end_time,
    phone,
    email,
    web_page,
    insurance,
  } = USData;

  const introHtml = curLangAr ? arabic_introduction_letter : introduction_letter;
  const { text: introText } = HTMLToText(introHtml);

  const contactRows = [
    { label: t('contact phone'), value: phone, icon: 'solar:phone-bold', dir: 'ltr' },
    { label: t('email'), value: email, icon: 'entypo:email' },
    { label: t('website'), value: web_page, icon: 'fluent-mdl2:website' },
  ].filter((row) => row.value);

  return (
    <Stack spacing={4}>
      {introHtml && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('about the clinic')} />
          <ReadMoreText html={introHtml} text={introText} />
        </Stack>
      )}

      <Stack spacing={1.5}>
        <SectionHeading title={t('working hours')} />
        <WorkingHoursWidget
          workDays={work_days}
          startTime={work_start_time}
          endTime={work_end_time}
          curLangAr={curLangAr}
        />
      </Stack>

      {contactRows.length > 0 && (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          {contactRows.map((row) => (
            <Stack key={row.label} direction="row" spacing={1.5}>
              <Iconify icon={row.icon} />
              <ListItemText
                primary={row.label}
                secondary={<span dir={row.dir || 'auto'}>{row.value}</span>}
                primaryTypographyProps={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}
                secondaryTypographyProps={{ typography: 'subtitle2', component: 'span' }}
              />
            </Stack>
          ))}
        </Box>
      )}

      <Stack spacing={1.5}>
        <SectionHeading title={t('insurance companies')} />
        {insurance?.length > 0 ? (
          <ChipList items={insurance.map((one) => (curLangAr ? one.name_arabic : one.name_english))} />
        ) : (
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {t('Does not work with any insurance company')}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

ClinicAbout.propTypes = {
  USData: PropTypes.object,
};
