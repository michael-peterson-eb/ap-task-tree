import { createTheme, makeStyles } from "@mui/material";

export const CustomFontTheme = () => {
  return createTheme({
    typography: {
      fontSize: 18,
    },
    components: {
      MuiInputLabel: {
        defaultProps: {
          sx: {
            fontSize: "14px",
          },
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          sx: {
            fontSize: "14px",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              color: "black !important",
              "-webkit-text-fill-color": "black !important",
            },
          },
        },
      },
    },
  });
};

export const NavButtonTheme = createTheme({
  typography: {
    fontSize: 18,
  },
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#0971f1",
      darker: "#053e85",
    },
    neutral: {
      main: "#C7C7C7",
      contrastText: "#fff",
    },
    active: {
      main: "#0572ed",
    },
    completed: {
      main: "#0FC27D",
    },
    submit: {
      main: "#ef5b18",
    },
  },
});
