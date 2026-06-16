import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function SectionHeading({ title, action, sx, ...other }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2, ...sx }}
      {...other}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          position: 'relative',
          pb: 1,
          '&:after': {
            content: '""',
            position: 'absolute',
            insetInlineStart: 0,
            bottom: 0,
            width: 40,
            height: 3,
            borderRadius: 1,
            bgcolor: 'primary.main',
          },
        }}
      >
        {title}
      </Typography>
      {action}
    </Stack>
  );
}

SectionHeading.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  sx: PropTypes.object,
};
