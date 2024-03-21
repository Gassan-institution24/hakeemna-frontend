import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { PlanStarterIcon } from 'src/assets/icons';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export default function PricingCard({ card, sx, ...other }) {
  const {
    name_english,
    name_arabic,
    period_in_months,
    price_in_usd,
    package_appointment,
    package_accounting,
    package_docotor_report,
    package_final_reporting,
    package_old_files_Management,
    package_TAX_Income_reporting,
    Users_num,
  } = card;

  const { user, initialize } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const Router = useRouter();
  const confirm = useBoolean();

  const [lists, setLists] = useState([]);

  const handleSubscribe = async () => {
    try {
      const today = new Date();
      const Start_date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const End_date = new Date(
        Start_date.getFullYear(),
        Start_date.getMonth() + period_in_months,
        Start_date.getDate()
      );
      await axiosInstance.post(endpoints.license_movements.all, {
        unit_service:
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
            ?._id,
        subscription: card._id,
        Start_date,
        End_date,
        Users_num,
        price: price_in_usd || 0,
      });
      initialize();
      Router.push(paths.unitservice.subscriptions.root);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLists([]);
    if (package_appointment) {
      setLists((prev) => [...prev, 'appointment package']);
    }
    if (package_accounting) {
      setLists((prev) => [...prev, 'accounting package']);
    }
    if (package_docotor_report) {
      setLists((prev) => [...prev, 'docotor report package']);
    }
    if (package_final_reporting) {
      setLists((prev) => [...prev, 'final reporting package']);
    }
    if (package_old_files_Management) {
      setLists((prev) => [...prev, 'old files Management package']);
    }
    if (package_TAX_Income_reporting) {
      setLists((prev) => [...prev, 'TAX Income reporting package']);
    }
  }, [
    package_appointment,
    package_accounting,
    package_docotor_report,
    package_final_reporting,
    package_old_files_Management,
    package_TAX_Income_reporting,
  ]);

  const renderIcon = (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box sx={{ width: 48, height: 48 }}>
        <PlanStarterIcon />
      </Box>

      {/* {starter && <Label color="info">POPULAR</Label>} */}
    </Stack>
  );

  const renderSubscription = (
    <Stack spacing={1}>
      <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
        {curLangAr ? name_arabic : name_english}
      </Typography>
      <Typography variant="subtitle2">
        {Users_num} {t('users')}
      </Typography>
    </Stack>
  );

  const renderPrice = (
    <Stack direction="row">
      <Typography variant="h4">{price_in_usd ? '$' : ''}</Typography>

      <Typography lang="ar" variant="h2">
        {price_in_usd || t('FREE')}
      </Typography>

      <Typography
        component="span"
        sx={{
          alignSelf: 'center',
          color: 'text.disabled',
          ml: 1,
          typography: 'body2',
        }}
      >
        / {period_in_months} {period_in_months > 1 ? t('months') : t('month')}
      </Typography>
    </Stack>
  );

  const renderList = (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box component="span" sx={{ typography: 'overline' }}>
          {t('Backages')}
        </Box>
        <Link variant="body2" color="inherit" underline="always">
          {package_appointment &&
          package_accounting &&
          package_docotor_report &&
          package_final_reporting &&
          package_old_files_Management &&
          package_TAX_Income_reporting
            ? 'All'
            : ''}
        </Link>
      </Stack>

      {lists.map((item) => (
        <Stack
          key={item}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:checkmark-fill" width={16} sx={{ mr: 1 }} />
          {t(item)}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Stack
        spacing={5}
        sx={{
          p: 5,
          borderRadius: 2,
          boxShadow: (theme) => ({
            xs: theme.customShadows.card,
          }),
          ...sx,
        }}
        {...other}
      >
        {renderIcon}

        {renderSubscription}

        {renderPrice}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderList}

        <Button fullWidth size="large" variant="contained" color="primary" onClick={confirm.onTrue}>
          {t('Select')}
        </Button>
      </Stack>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('Confirm')}
        content={
          <>
            {t('Do you confirm choosing')}{' '}
            <strong> {curLangAr ? name_arabic : name_english} </strong> {t('subscription ?')}
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              confirm.onFalse();
              handleSubscribe();
            }}
          >
            {t('confirm')}
          </Button>
        }
      />
    </>
  );
}

PricingCard.propTypes = {
  card: PropTypes.object,
  sx: PropTypes.object,
};
