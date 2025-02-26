// ----------------------------------------------------------------------

export function typography(theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
        },
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  };
}
