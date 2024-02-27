import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function JobDetailsToolbar({ backLink, editLink, ...other }) {
  return (
    <Stack
      spacing={1.5}
      direction="row"
      sx={{
        mb: { xs: 3, md: 5 },
      }}
      {...other}
    >
      <Button
        component={RouterLink}
        href={backLink}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
      >
        Back
      </Button>

      {/* <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip> */}
    </Stack>
  );
}

JobDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editLink: PropTypes.string,
};
