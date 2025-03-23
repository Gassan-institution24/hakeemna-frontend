import { tabClasses } from '@mui/material/Tab';

// ----------------------------------------------------------------------

export function tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: theme.palette.text.primary,
        },
        scrollButtons: {
          width: 48,
          borderRadius: '50%',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: 0,
          opacity: 1,
          minWidth: 48,
          minHeight: 48,
          fontWeight: theme.typography.fontWeightSemiBold,
          '&:not(:last-of-type)': {
            marginRight: theme.spacing(3),
            [theme.breakpoints.up('sm')]: {
              marginRight: theme.spacing(5),
            },
          },
          [`&:not(.${tabClasses.selected})`]: {
            color: theme.palette.text.secondary,
          },
        },
      },
    },
  };
}

// dark blue mode as in figma

// import { tabClasses } from '@mui/material/Tab';

// ----------------------------------------------------------------------

// export function tabs(theme) {
//   return {
//     MuiTabs: {
//       styleOverrides: {
//         root: {
//           borderRadius: 10,
//           overflow: 'hidden',
//           border: `1px solid ${theme.palette.divider}`,
//           backgroundColor: '#fff',
//           margin: 10,
//           padding: 0,
//         },
//         indicator: {
//           backgroundColor: theme.palette.text.primary,
//           display: 'none',
//         },
//         scrollButtons: {
//           width: 48,
//           borderRadius: '50%',
//         },
//       },
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           backgroundColor: theme.palette.secondary.main,
//           color: '#fff',
//           flex: 1,
//           opacity: 1,
//           minWidth: 48,
//           minHeight: 48,
//           margin: 0,
//           fontWeight: theme.typography.fontWeightSemiBold,
//           '&:not(:last-of-type)': {
//             marginRight: 0,
//             borderRight: `1px solid ${theme.palette.divider}`,
//             // [theme.breakpoints.up('sm')]: {
//             //   marginRight: theme.spacing(5),
//             // },
//           },
//           [`&:not(.${tabClasses.selected})`]: {
//             color: theme.palette.text.secondary,
//             backgroundColor: '#fff',
//           },
//         },
//       },
//     },
//   };
// }
