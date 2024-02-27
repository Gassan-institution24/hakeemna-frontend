import PropTypes from 'prop-types';
// import match from 'autosuggest-highlight/match';
// import parse from 'autosuggest-highlight/parse';

// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

// import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export default function AppointmentSearch({ query, results, onSearch, hrefItem }) {

  // const handleKeyUp = (event) => {
  //   if (query) {
  //     if (event.key === 'Enter') {
  //       const selectProduct = results.filter(
  //         (appointment) => appointment.name_english === query
  //       )[0];

  //       // handleClick(selectProduct._id);
  //     }
  //   }
  // };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results.map((result) => result)}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option._id}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          // onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      // renderOption={(props, appointment, { inputValue }) => {
      //   const matches = match(appointment._id, inputValue);
      //   const parts = parse(appointment._id, matches);
      //   return (
      //     <Box
      //       component="li"
      //       {...props}
      //       // onClick={() => handleClick(appointment._id)}
      //       key={appointment._id}
      //     >
      //       {/* <div>
      //         {parts.map((part, index) => (
      //           <Typography
      //             key={index}
      //             component="span"
      //             color={part.highlight ? 'primary' : 'textPrimary'}
      //             sx={{
      //               typography: 'body2',
      //               fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
      //             }}
      //           >
      //             {part.text}
      //           </Typography>
      //         ))}
      //       </div> */}
      //     </Box>
      //   );
      // }}
    />
  );
}

AppointmentSearch.propTypes = {
  hrefItem: PropTypes.func,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
