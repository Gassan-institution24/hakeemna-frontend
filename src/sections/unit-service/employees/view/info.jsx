import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

function InfoRow({ icon, label, value, dir }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <Iconify icon={icon} width={22} />
      </Box>

      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" dir={dir} sx={{ wordBreak: 'break-word' }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

InfoRow.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.node,
  dir: PropTypes.string,
};

// ----------------------------------------------------------------------

function InfoSection({ title, icon, items }) {
  const visible = items.filter(
    (item) => item.value !== undefined && item.value !== null && item.value !== ''
  );

  if (!visible.length) return null;

  return (
    <Card>
      <CardHeader
        title={title}
        avatar={<Iconify icon={icon} width={24} sx={{ color: 'primary.main' }} />}
        titleTypographyProps={{ variant: 'h6' }}
      />

      <Box
        sx={{
          p: 3,
          pt: 2,
          rowGap: 3,
          columnGap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
        }}
      >
        {visible.map((item, idx) => (
          <InfoRow key={idx} {...item} />
        ))}
      </Box>
    </Card>
  );
}

InfoSection.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  items: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function EmployeeInfoContent({ employeeData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { status, is_owner: isOwner } = employeeData;

  const {
    name_english,
    name_arabic,
    picture,
    nationality,
    profrssion_practice_num,
    birth_date,
    gender,
    department,
    identification_num,
    employee_type,
    Bachelor_year_graduation,
    University_graduation_Bachelor,
    unit_service,
    tax_num,
    address,
    web_page,
    University_graduation_Specialty,
    phone,
    mobile_num,
    email,
    speciality,
  } = employeeData.employee;

  const displayName = curLangAr ? name_arabic || name_english : name_english || name_arabic;
  const secondaryName = curLangAr ? name_english : name_arabic;

  const personalItems = [
    { icon: 'solar:user-bold', label: t('Full name in English'), value: name_english },
    { icon: 'solar:user-bold', label: t('Full name in Arabic'), value: name_arabic, dir: 'rtl' },
    { icon: 'mdi:gender-male-female', label: t('gender'), value: gender ? t(gender) : '' },
    {
      icon: 'solar:flag-bold',
      label: t('nationality'),
      value: curLangAr ? nationality?.name_arabic : nationality?.name_english,
    },
    { icon: 'solar:calendar-date-bold', label: t('birth date'), value: birth_date && fDate(birth_date) },
    { icon: 'solar:card-bold', label: t('ID number'), value: identification_num, dir: 'ltr' },
  ];

  const contactItems = [
    { icon: 'solar:letter-bold', label: t('email'), value: email, dir: 'ltr' },
    { icon: 'solar:phone-bold', label: t('phone'), value: phone, dir: 'ltr' },
    { icon: 'solar:smartphone-bold', label: t('mobile Number'), value: mobile_num, dir: 'ltr' },
    { icon: 'solar:map-point-bold', label: t('address'), value: address },
    { icon: 'solar:global-bold', label: t('webpage'), value: web_page, dir: 'ltr' },
  ];

  const professionalItems = [
    {
      icon: 'healthicons:stethoscope',
      label: t('specialty'),
      value: curLangAr ? speciality?.name_arabic : speciality?.name_english,
    },
    {
      icon: 'solar:user-id-bold',
      label: t('employee type'),
      value: curLangAr ? employee_type?.name_arabic : employee_type?.name_english,
    },
    {
      icon: 'solar:buildings-bold',
      label: t('department'),
      value: curLangAr ? department?.name_arabic : department?.name_english,
    },
    {
      icon: 'fa-solid:clinic-medical',
      label: t('unit of service'),
      value: curLangAr ? unit_service?.name_arabic : unit_service?.name_english,
    },
    {
      icon: 'solar:diploma-bold',
      label: t('profrssion practice number'),
      value: profrssion_practice_num,
      dir: 'ltr',
    },
    { icon: 'solar:bill-list-bold', label: t('tax number'), value: tax_num, dir: 'ltr' },
  ];

  const educationItems = [
    {
      icon: 'solar:calendar-bold',
      label: t('bachelor year graduation'),
      value: Bachelor_year_graduation,
    },
    {
      icon: 'solar:square-academic-cap-bold',
      label: t('university graduation bachelor'),
      value: University_graduation_Bachelor,
    },
    {
      icon: 'solar:square-academic-cap-2-bold',
      label: t('university graduation specialty'),
      value: University_graduation_Specialty,
    },
  ];

  const renderHeader = (
    <Card sx={{ mb: 3 }}>
      <Box
        sx={{
          height: 144,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.88)} 0%, ${alpha(
              theme.palette.primary.dark,
              0.92
            )} 100%)`,
        }}
      />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'center', sm: 'flex-end' }}
        spacing={3}
        sx={{ px: { xs: 2, md: 4 }, pb: 3, mt: -8 }}
      >
        <Avatar
          src={picture}
          alt={displayName}
          sx={{
            width: 128,
            height: 128,
            fontSize: 40,
            border: '4px solid',
            borderColor: 'background.paper',
            boxShadow: (theme) => theme.customShadows?.z8,
          }}
        >
          {displayName?.charAt(0)?.toUpperCase()}
        </Avatar>

        <Stack
          spacing={1}
          sx={{
            flexGrow: 1,
            width: 1,
            textAlign: { xs: 'center', sm: 'left' },
            pb: { sm: 1 },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
          >
            <Typography variant="h4">{displayName}</Typography>
            {isOwner && (
              <Label variant="soft" color="warning" startIcon={<Iconify icon="solar:crown-bold" />}>
                {t('owner')}
              </Label>
            )}
          </Stack>

          {secondaryName && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} dir={curLangAr ? 'ltr' : 'rtl'}>
              {secondaryName}
            </Typography>
          )}

          {(speciality?.name_english || speciality?.name_arabic) && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
              sx={{ color: 'primary.main' }}
            >
              <Iconify icon="healthicons:stethoscope" width={18} />
              <Typography variant="subtitle2">
                {curLangAr ? speciality?.name_arabic : speciality?.name_english}
              </Typography>
            </Stack>
          )}

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
            sx={{ pt: 0.5 }}
          >
            {(employee_type?.name_english || employee_type?.name_arabic) && (
              <Label variant="soft" color="info" startIcon={<Iconify icon="solar:user-id-bold" />}>
                {curLangAr ? employee_type?.name_arabic : employee_type?.name_english}
              </Label>
            )}
            {(department?.name_english || department?.name_arabic) && (
              <Label variant="soft" color="primary" startIcon={<Iconify icon="solar:buildings-bold" />}>
                {curLangAr ? department?.name_arabic : department?.name_english}
              </Label>
            )}
            {status && (
              <Label
                variant="soft"
                color={(status === 'active' && 'success') || (status === 'inactive' && 'error') || 'default'}
              >
                {t(status)}
              </Label>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      {renderHeader}

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            <InfoSection title={t('personal information')} icon="solar:user-rounded-bold" items={personalItems} />
            <InfoSection title={t('contact information')} icon="solar:phone-rounded-bold" items={contactItems} />
          </Stack>
        </Grid>

        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            <InfoSection
              title={t('professional information')}
              icon="solar:case-round-bold"
              items={professionalItems}
            />
            <InfoSection
              title={t('education')}
              icon="solar:square-academic-cap-bold"
              items={educationItems}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

EmployeeInfoContent.propTypes = {
  employeeData: PropTypes.object,
};
