import PropTypes from 'prop-types';
import { memo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { Box, Divider } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import NavList from './nav-list';

// ----------------------------------------------------------------------

function NavSectionVertical({ data, slotProps, walktourRun, ...other }) {
  return (
    <Stack component="nav" sx={{ pb: 5 }} id="nav-section-vertical" {...other}>
      {data
        .filter((item) => item.items.length)
        .map((group, idx) => (
          <Box key={idx}>
            <Group
              key={idx}
              walktourRun={walktourRun}
              subheader={group.subheader}
              items={group.items}
              slotProps={slotProps}
            />
            {data[idx + 1] && <Divider />}
          </Box>
        ))}
    </Stack>
  );
}

NavSectionVertical.propTypes = {
  data: PropTypes.array,
  slotProps: PropTypes.object,
  walktourRun: PropTypes.bool,
};

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------

function Group({ subheader, walktourRun, items, slotProps }) {
  const [open, setOpen] = useState(true);
  const { t } = useTranslate();

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);
  const renderContent = items.map((list, idx) => (
    <NavList
      // id={list.navItemId}
      key={idx}
      walktourRun={walktourRun}
      data={list}
      depth={1}
      slotProps={slotProps}
    />
  ));

  return (
    <Stack sx={{ px: 2 }}>
      {subheader ? (
        <>
          <ListSubheader
            disableGutters
            disableSticky
            onClick={handleToggle}
            sx={{
              fontSize: 11,
              cursor: 'pointer',
              typography: 'overline',
              display: 'inline-flex',
              color: 'secondary.darker',
              mb: `${slotProps?.gap || 4}px`,
              p: (theme) => theme.spacing(2, 1, 1, 1.5),
              transition: (theme) =>
                theme.transitions.create(['color'], {
                  duration: theme.transitions.duration.shortest,
                }),
              '&:hover': {
                color: 'text.primary',
              },
              ...slotProps?.subheader,
            }}
          >
            {t(subheader)}
            <Iconify
              sx={{ mx: 1 }}
              width={16}
              className="arrow"
              icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            />
          </ListSubheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        <Stack mt={7}>
          {renderContent}
        </Stack>
      )}
    </Stack>
  );
}

Group.propTypes = {
  items: PropTypes.array,
  walktourRun: PropTypes.bool,
  subheader: PropTypes.string,
  slotProps: PropTypes.object,
};
