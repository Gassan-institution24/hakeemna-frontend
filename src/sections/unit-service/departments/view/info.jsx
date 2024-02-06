import PropTypes from 'prop-types';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fMonth } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { useLocales, useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';

import Label from 'src/components/label/label';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

export default function DepartmentInfoContent({ departmentData }) {
  const { name_english, name_arabic, general_info, unit_service } = departmentData;
  // console.log('departmentData');

  const settings = useSettingsContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        {[
          {
            label: t('name'),
            value: curLangAr ? name_arabic : name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },

          {
            label: t('general info'),
            value: general_info,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
          {
            label: t('unit service'),
            value: curLangAr ? unit_service?.name_arabic : unit_service?.name_english,
            icon: <Iconify icon="solar:calendar-date-bold" />,
          },
        ].map((item) => (
          <>
            {item.value && (
              <Stack key={item.label} spacing={1.5}>
                {/* {item.icon} */}
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.secondary',
                    mb: 0.5,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.primary',
                    component: 'span',
                  }}
                />
              </Stack>
            )}
          </>
        ))}
      </Box>
    </Stack>
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          {renderOverview}
        </Grid>
      </Grid>
    </Container>
  );
}

DepartmentInfoContent.propTypes = {
  departmentData: PropTypes.object,
};
