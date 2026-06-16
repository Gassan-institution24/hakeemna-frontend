import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function ChipList({ items, icon, color = 'default', variant = 'soft', sx }) {
  if (!items?.length) {
    return null;
  }

  return (
    <Stack direction="row" gap={1} flexWrap="wrap" sx={sx}>
      {items.map((item, index) => (
        <Chip
          key={index}
          size="small"
          icon={icon}
          color={color}
          variant={variant === 'soft' ? 'filled' : variant}
          label={item}
          sx={
            variant === 'soft'
              ? {
                  bgcolor: 'background.neutral',
                  color: 'text.primary',
                  fontWeight: 500,
                }
              : undefined
          }
        />
      ))}
    </Stack>
  );
}

ChipList.propTypes = {
  items: PropTypes.array,
  icon: PropTypes.node,
  color: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object,
};
