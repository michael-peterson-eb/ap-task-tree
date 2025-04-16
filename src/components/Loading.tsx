import Box from "@mui/material/Box";
import { LinearProgress, CircularProgress } from "@mui/material";

export const Loading = ({ type = "linear", boxStyles = {} }) => {
  if (type == "none") return null;
  if (type == "circular")
    return (
      <Box sx={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", display: "flex", position: "relative", ...boxStyles }}>
        <CircularProgress />
      </Box>
    );
  if (type == "linear")
    return (
      <Box sx={{ width: "100%", position: "relative", ...boxStyles }}>
        <LinearProgress />
      </Box>
    );
  return null;
};
