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
          my: 3,
          maxHeight: 300,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          // backgroundColor: 'red',
          justifyContent: 'flex-start',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'white',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'white',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'white',
          },
          gap: 1,
        }}
      >
        {list.map((time) => (
          <Button
            variant="outlined"
            sx={{
              width: 100,
              '&:hover': {
                bgcolor: 'white',
                color: 'primary.main',
              },
              fontWeight: value === time._id ? 600 : 500,
              backgroundColor: value === time._id ? 'primary.main' : 'white', // Ensure white background by default
              color: value === time._id ? 'whites' : 'primary.main', // Ensure text color is always visible
              borderRadius: 2,
            }}
            onClick={() => {
              onChange(time._id);
            }}
          >
            {fTime(myunitTime(time.start_time), 'p', curLangAr)}
          </Button>
        ))}
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
