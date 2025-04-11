import React from "react";
import { Box, Button, CircularProgress, ThemeProvider } from "@mui/material";
import { NavButtonTheme } from "../style/CustomTheme";

export const EditButtons = ({ appParams, cancelClicked, cancelButtonClicked, saveClicked, saveButtonClicked }) => {
  if (appParams.crudAction != "edit") return null;

  return (
    <Box mb={1} display="flex" justifyContent="space-between" alignItems="right">
      <ThemeProvider theme={NavButtonTheme}>
        <Button color="primary" onClick={cancelButtonClicked} variant="contained" size="small" sx={{ borderRadius: "0px" }}>
          {cancelClicked ? (
            <span>
              <CircularProgress size="1em" style={{ paddingRight: "4px", color: "#000" }} />
              <span>Closing...</span>
            </span>
          ) : (
            <span>Cancel</span>
          )}
        </Button>
        <Button color="warning" onClick={saveButtonClicked} variant="contained" size="small" sx={{ borderRadius: "0px" }}>
          {saveClicked ? (
            <span>
              <CircularProgress size="1em" style={{ paddingRight: "4px", color: "#000" }} />
              <span>Saving...</span>
            </span>
          ) : (
            <span>Save</span>
          )}
        </Button>
      </ThemeProvider>
    </Box>
  );
};
