import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductSearch({ query, filters, results, onSearch, hrefItem, loading }) {
  // const router = useRouter();

  const { t } = useTranslate();

  // const handleClick = (id) => {
  //   router.push(hrefItem(id));
  // };

  // const handleKeyUp = (event) => {
  //   if (query) {
  //     if (event.key === 'Enter') {
  //       const selectItem = results.filter((product) => product.name === query)[0];

  //       handleClick(selectItem.id);
  //     }
  //   }
  // };

  return (
    <TextField
      sx={{ width: { xs: 1, sm: 260 } }}
      value={filters.name}
      onChange={onSearch}
      placeholder={t('Search name or number...')}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
    // <Autocomplete
    //   sx={{ width: { xs: 1, sm: 260 } }}
    //   loading={loading}
    //   autoHighlight
    //   popupIcon={null}
    //   options={results}
    //   onInputChange={(event, newValue) => onSearch(newValue)}
    //   getOptionLabel={(option) => option.name}
    //   noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
    //   isOptionEqualToValue={(option, value) => option.id === value.id}
    //   slotProps={{
    //     popper: {
    //       placement: 'bottom-start',
    //       sx: {
    //         minWidth: 320,
    //       },
    //     },
    //     paper: {
    //       sx: {
    //         [` .${autocompleteClasses.option}`]: {
    //           pl: 0.75,
    //         },
    //       },
    //     },
    //   }}
    //   renderInput={(params) => (
    //     <TextField
    //       {...params}
    //       placeholder="Search..."
    //       onKeyUp={handleKeyUp}
    //       InputProps={{
    //         ...params.InputProps,
    //         startAdornment: (
    //           <InputAdornment position="start">
    //             <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
    //           </InputAdornment>
    //         ),
    //         endAdornment: (
    //           <>
    //             {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
    //             {params.InputProps.endAdornment}
    //           </>
    //         ),
    //       }}
    //     />
    //   )}
    //   // renderOption={(props, product, { inputValue }) => {
    //   //   const matches = match(product.name, inputValue);
    //   //   const parts = parse(product.name, matches);

    //   //   return (
    //   //     <Box component="li" {...props} onClick={() => handleClick(product.id)} key={product.id}>
    //   //       <Avatar
    //   //         key={product.id}
    //   //         alt={product.name}
    //   //         src={product.coverUrl}
    //   //         variant="rounded"
    //   //         sx={{
    //   //           width: 48,
    //   //           height: 48,
    //   //           flexShrink: 0,
    //   //           mr: 1.5,
    //   //           borderRadius: 1,
    //   //         }}
    //   //       />

    //   //       <div key={inputValue}>
    //   //         {parts.map((part, index) => (
    //   //           <Typography
    //   //             key={index}
    //   //             component="span"
    //   //             color={part.highlight ? 'primary' : 'textPrimary'}
    //   //             sx={{
    //   //               typography: 'body2',
    //   //               fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
    //   //             }}
    //   //           >
    //   //             {part.text}
    //   //           </Typography>
    //   //         ))}
    //   //       </div>
    //   //     </Box>
    //   //   );
    //   // }}
    // />
  );
}

ProductSearch.propTypes = {
  hrefItem: PropTypes.func,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  query: PropTypes.string,
  filters: PropTypes.object,
  results: PropTypes.array,
};
