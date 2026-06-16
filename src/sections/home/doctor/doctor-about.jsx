import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';

import { HTMLToText } from 'src/utils/convert-to-html';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import ChipList from '../components/chip-list';
import ReadMoreText from '../components/read-more-text';
import SectionHeading from '../components/section-heading';

// ----------------------------------------------------------------------

export default function DoctorAbout({ employeeData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { employee, unit_service } = employeeData;

  const aboutHtml = curLangAr ? employee?.arabic_about_me : employee?.about_me;
  const { text: aboutText } = HTMLToText(aboutHtml);

  const contactRows = [
    { label: t('address'), value: unit_service?.address, icon: 'mingcute:location-fill' },
    { label: t('phone number'), value: employee?.phone, icon: 'solar:phone-bold', dir: 'ltr' },
    { label: t('email'), value: employee?.email, icon: 'entypo:email' },
  ].filter((row) => row.value);

  return (
    <Stack spacing={4}>
      {aboutHtml && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('about the doctor')} />
          <ReadMoreText html={aboutHtml} text={aboutText} />
        </Stack>
      )}

      {contactRows.length > 0 && (
        <Box gap={3} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}>
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

      {employee?.languages?.length > 0 && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('languages')} />
          <ChipList items={employee.languages} />
        </Stack>
      )}

      {unit_service?.insurance?.length > 0 && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('insurance companies')} />
          <ChipList
            items={unit_service.insurance.map((one) => (curLangAr ? one.name_arabic : one.name_english))}
          />
        </Stack>
      )}
    </Stack>
  );
}

DoctorAbout.propTypes = {
  employeeData: PropTypes.object,
};
