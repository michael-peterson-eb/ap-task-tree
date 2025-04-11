import { Grid, Box, ListItemIcon, ListItemText, Select, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export const CarouselDropdown = ({ operationSections, selectedOpsSec, handleTabClick }) => {
  return (
    <Grid item xs={12}>
      <Select
        id="select-active-step"
        value={selectedOpsSec}
        onChange={(e) => {
          handleTabClick(e.target.value);
        }}
        sx={{ width: "100%", maxWidth: "420px" }}
      >
        {operationSections.length > 0
          ? operationSections.map((type: any, index) => {
              return (
                <MenuItem
                  value={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {type.name}
                    </ListItemText>
                    {type.status === "completed" ? (
                      <ListItemIcon>
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </ListItemIcon>
                    ) : null}
                  </Box>
                </MenuItem>
              );
            })
          : null}
      </Select>
    </Grid>
  );
};
