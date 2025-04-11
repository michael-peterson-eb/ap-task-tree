import { createTheme } from "@mui/material";

export const customTheme = createTheme({
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
