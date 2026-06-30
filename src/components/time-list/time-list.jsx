import PropTypes from 'prop-types';

import { Stack, Button } from '@mui/material';

import { fTime, useUnitTime } from 'src/utils/format-time';

import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function TimeList({ name, list, helperText, value, onChange, ...other }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { myunitTime } = useUnitTime();

  return (
    <>
      <Stack
        sx={{
          my: 2,
          maxHeight: 300,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(60, 176, 153, 0.3)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(60, 176, 153, 0.5)',
          },
          gap: 1,
        }}
      >
        {list.map((time) => {
          const isSelected = value === time._id;
          return (
            <Button
              key={time._id}
              variant={isSelected ? 'contained' : 'outlined'}
              disableElevation
              sx={{
                minWidth: 92,
                px: 1.5,
                borderRadius: 5,
                fontWeight: isSelected ? 700 : 500,
                borderColor: 'primary.light',
                bgcolor: isSelected ? 'primary.main' : 'common.white',
                color: isSelected ? 'common.white' : 'primary.dark',
                '&:hover': {
                  bgcolor: isSelected ? 'primary.dark' : 'primary.lighter',
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => {
                onChange(time._id);
              }}
            >
              {fTime(myunitTime(time.start_time), 'p', curLangAr)}
            </Button>
          );
        })}
      </Stack>
      {/* </Scrollbar> */}
    </>
  );
  // [selectedItem, curLangAr]
}
TimeList.propTypes = {
  helperText: PropTypes.string,
  onChange: PropTypes.func,
  list: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.string,
};
//   const memoizedValue = useMemo(
//     () => ({
//       TimeList,
//       selectedItem,
//       setSelectedItem,
//     }),
//     [setSelectedItem, selectedItem, TimeList]
//   );
//   return memoizedValue;
// }
