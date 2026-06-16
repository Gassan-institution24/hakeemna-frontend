import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { ConvertToHTML } from 'src/utils/convert-to-html';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function ReadMoreText({ html, text, limit = 320 }) {
  const { t } = useTranslate();
  const [expanded, setExpanded] = useState(false);

  const plainText = text || '';
  const isLong = plainText.length > limit;

  if (!html) {
    return null;
  }

  return (
    <Stack gap={1}>
      <Box
        sx={
          !expanded && isLong
            ? {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 5,
                overflow: 'hidden',
              }
            : undefined
        }
      >
        {ConvertToHTML(html)}
      </Box>
      {isLong && (
        <Link
          component="button"
          type="button"
          variant="subtitle2"
          underline="always"
          onClick={() => setExpanded((prev) => !prev)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {expanded ? t('Read less') : t('Read more')}
        </Link>
      )}
    </Stack>
  );
}

ReadMoreText.propTypes = {
  html: PropTypes.string,
  text: PropTypes.string,
  limit: PropTypes.number,
};
