import { Box, Typography, Alert, AlertTitle } from "@mui/material";

const NoQuestionTypes = () => {
  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Typography sx={{ mt: 1, mb: 1 }}>
        <Alert severity="warning">
          <AlertTitle>No assessment questions found!</AlertTitle>
        </Alert>
      </Typography>
    </Box>
  );
};

export default NoQuestionTypes;
