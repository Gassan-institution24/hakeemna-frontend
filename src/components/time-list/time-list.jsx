import PropTypes from 'prop-types';

import { Stack, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fTime } from 'src/utils/format-time';

import { useLocales } from 'src/locales';


// ----------------------------------------------------------------------

export default function TimeList({ name, list, helperText, value, onChange, ...other }) {
  // const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  // const [selectedItem, setSelectedItem] = useState();

  // const TimeList = useCallback(
  // ({ name, list, helperText, onChange, ...other }) => (
  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        flexGrow: 1,
        flexShrink: 0.5,
        // py: 8,
        px: 3,
      }}
    >
      <Typography
        sx={{ py: 2, fontWeight: 700 }}
        variant="caption"
        color="text.secondary"
        textTransform="uppercase"
      >
        Select time
      </Typography>
      {/* <Scrollbar
        sx={{
          py: 8,
          backgroundColor: 'red',
        }}
      > */}
      <Stack
        sx={{
          py: 8,
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          // backgroundColor: 'red',
          justifyContent: 'flex-start',
        }}
      >
        {list.map((time) => (
          <Button
            variant="outlined"
            sx={{
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
    </Stack>
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
