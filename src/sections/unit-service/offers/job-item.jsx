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

// ----------------------------------------------------------------------

export default function JobItem({ job, onView, onEdit, onDelete }) {
  // const popover = usePopover();
  const router = useRouter();

  const {
    _id,
    name_english,
    //  name_arabic,
    country,
    city,
    company_logo,
    email,
    phone,
    // created_at, candidates, experience, employmentTypes, salary, role
  } = job;

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
    return <></>;
  }

  return (
    <>
      <Card
        sx={{ cursor: 'pointer' }}
        onClick={() => router.push(paths.unitservice.products.stakeholder.one(_id))}
      >
        {/* <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}

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
                {name_english}
              </Link>
            }
            secondary={`${city ? city?.name_english : ''}, ${country ? country?.name_english : ''}`}
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              // mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Stack
            // spacing={0.5}
            // direction="row"
            alignItems="start"
            sx={{ typography: 'caption' }}
          >
            {/* <Iconify width={16} icon="solar:users-group-rounded-bold" /> */}
            {email && <Typography variant="caption">email: {email}</Typography>}
            {phone && <Typography variant="caption">phone: {phone}</Typography>}
          </Stack>
          <Stack
            // spacing={0.5}
            // direction="row"
            alignItems="end"
            sx={{ color: 'primary.main', typography: 'caption', mt: 2 }}
          >
            {/* <Iconify width={16} icon="solar:users-group-rounded-bold" /> */}
            {productsLength && (
              <Typography variant="caption">{productsLength} products available </Typography>
            )}
            {offersLength && (
              <Typography variant="caption">{offersLength} offers available </Typography>
            )}
          </Stack>
        </Stack>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
          {[
            {
              label: experience,
              icon: <Iconify width={16} icon="carbon:skill-level-basic" sx={{ flexShrink: 0 }} />,
            },
            {
              label: employmentTypes?.join(', '),
              icon: <Iconify width={16} icon="solar:clock-circle-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: salary?.negotiable ? 'Negotiable' : fCurrency(salary?.price),
              icon: <Iconify width={16} icon="solar:wad-of-money-bold" sx={{ flexShrink: 0 }} />,
            },
            {
              label: role,
              icon: <Iconify width={16} icon="solar:user-rounded-bold" sx={{ flexShrink: 0 }} />,
            },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
        </Box> */}
      </Card>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}

JobItem.propTypes = {
  job: PropTypes.object,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
};
