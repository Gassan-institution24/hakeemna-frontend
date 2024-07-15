import PropTypes from 'prop-types';

import { Stack, Button } from '@mui/material';

import { fTime } from 'src/utils/format-time';

import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function TimeList({ name, list, helperText, value, onChange, ...other }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  // const [selectedItem, setSelectedItem] = useState();

  // const TimeList = useCallback(
  // ({ name, list, helperText, onChange, ...other }) => (
  return (
    <>
      {/* <Typography
        sx={{ py: 2, fontWeight: 700 }}
        variant="caption"
        color="text.secondary"
        textTransform="uppercase"
      >
        {t('select time')}
      </Typography> */}
      {/* <Scrollbar
        sx={{
          py: 8,
          backgroundColor: 'red',
        }}
      > */}
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
            background: 'none',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {list.map((time) => (
          <Button
            variant="outlined"
            sx={{
              width: 100,
              // m: 0.7,
              // flexGrow: 1,
              '&:hover': {
                backgroundColor: value === time._id ? 'primary.main' : 'hoverColor',
                color: value === time._id ? 'white' : 'hoverTextColor',
              },
              fontWeight: value === time._id ? 600 : 500,
              backgroundColor: value === time._id ? 'primary.main' : '',
              color: value === time._id ? 'white' : '',
              // border: '1px solid GrayText',
              borderRadius: 0,
            }}
            onClick={() => {
              // setSelectedItem(time._id);
              onChange(time._id);
            }}
          >
            {fTime(time.start_time, 'p', curLangAr)}
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
