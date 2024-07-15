import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Stack } from '@mui/system';
import { Box, Avatar, Rating, IconButton, Typography } from '@mui/material';

import { useLocales } from 'src/locales';
import { useGetEmployeeFeedbackes } from 'src/api';

import Iconify from 'src/components/iconify';

export default function FeedbackSection({ employee }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [showIndex, setShowIndex] = useState(0);

  const { feedbackData } = useGetEmployeeFeedbackes(employee.employee?._id);

  return (
    <Stack>
      <Box
        rowGap={1}
        columnGap={1}
        display="grid"
        // height={{ md: 600 }}
        padding={2}
        // sx={{
        //     '&::-webkit-scrollbar': {
        //         width: '8px',
        //     },
        //     '&::-webkit-scrollbar-track': {
        //         background: 'none',
        //     },
        //     '&::-webkit-scrollbar-thumb': {
        //         background: '#888',
        //         borderRadius: '4px',
        //     },
        //     '&::-webkit-scrollbar-thumb:hover': {
        //         background: '#555',
        //     },
        // }}
        // overflow='auto'
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
      >
        {feedbackData
          ?.filter((one, index) => index < showIndex + 4 && index >= showIndex)
          .map((one) => (
            <Box sx={{ backgroundColor: 'background.neutral', p: 3, borderRadius: 1 }}>
              <Stack direction="row" gap={1} mb={2}>
                <Avatar src={one.patient?.profile_picture} />
                <Stack gap={1}>
                  <Typography variant="subtitle2">
                    {curLangAr ? one.patient?.name_arabic : one.patient?.name_english}
                  </Typography>
                  <Rating size="small" readOnly value={one.Rate} precision={0.1} max={5} />
                </Stack>
              </Stack>
              <Typography variant="caption" sx={{ p: 2 }}>
                {one.Body}
              </Typography>
            </Box>
          ))}
      </Box>
      {feedbackData.length > 0 && (
        <Stack direction="row" justifyContent="center">
          <IconButton
            onClick={() => setShowIndex((prev) => (feedbackData.length > prev + 4 ? prev + 4 : 0))}
          >
            <Iconify icon="iconamoon:arrow-down-2-bold" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}
FeedbackSection.propTypes = {
  employee: PropTypes.object,
};
