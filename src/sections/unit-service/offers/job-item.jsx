import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useGetStakeholderOffers } from 'src/api';
import { useGetStakeholderProducts } from 'src/api/product';
import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function JobItem({ job, onView, onEdit, onDelete }) {
  const router = useRouter();

  const {
    _id,
    name_english,
    name_arabic,
    country,
    city,
    company_logo,
    email,
    phone,
  } = job;

  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { length: offersLength } = useGetStakeholderOffers(_id, {
    page: 0,
    sortBy: 'created_at',
    rowsPerPage: 1,
    order: 'desc',
    status: 'published',
    to: 'to_unit_service',
  });
  const { length: productsLength } = useGetStakeholderProducts(_id, {
    page: 0,
    sortBy: 'created_at',
    rowsPerPage: 1,
    order: 'desc',
    status: 'published',
  });

  if (!productsLength && !offersLength) {
    return '';
  }

  return (
    <Card
      sx={{ cursor: 'pointer' }}
      onClick={() => router.push(paths.unitservice.products.stakeholder.one(_id))}
    >
      <Stack sx={{ p: 3, pb: 2 }}>
        <Avatar
          alt={name_english}
          src={company_logo}
          variant="rounded"
          sx={{ width: 48, height: 48, mb: 2 }}
        />

        <ListItemText
          sx={{ mb: 1 }}
          primary={
            <Link
              component={RouterLink}
              href={paths.unitservice.products.info(_id)}
              color="inherit"
            >
              {curLangAr ? name_arabic : name_english}
            </Link>
          }
          secondary={`${curLangAr ? city?.name_arabic : city?.name_english}, ${curLangAr ? country?.name_arabic : country?.name_english}`}
          primaryTypographyProps={{
            typography: 'subtitle1',
          }}
          secondaryTypographyProps={{
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />

        <Stack
          alignItems="start"
          sx={{ typography: 'caption' }}
        >
          {email && <Typography variant="caption">{t('email')}: {email}</Typography>}
          {phone && <Typography variant="caption">{t('phone')}: {phone}</Typography>}
        </Stack>
        <Stack
          alignItems="end"
          sx={{ color: 'primary.main', typography: 'caption', mt: 2 }}
        >
          <Typography variant="caption">{productsLength} {t('products available')} </Typography>
          <Typography variant="caption">{offersLength} {t('offers available')} </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

JobItem.propTypes = {
  job: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
};
