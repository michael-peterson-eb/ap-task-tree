import React from "react";
import { Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const BottomNavigation = ({ operationSections, selectedOpsSection, setSelectedOpsSection }) => {
  const handleBack = () => {
    setSelectedOpsSection((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (selectedOpsSection === operationSections.length - 1) {
      setSelectedOpsSection(0);
    } else {
      setSelectedOpsSection((prevActiveStep) => prevActiveStep + 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        pt: 1,
        marginTop: 4,
      }}
    >
      <Button
        color="inherit"
        disabled={selectedOpsSection === 0}
        onClick={handleBack}
        sx={{
          mr: 1,
          backgroundColor: "#DDD",
          fontSize: "1.2rem",
          borderRadius: "0px",
          ":hover": { bgcolor: "#ff5f01" },
        }}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </Button>
      <Button
        disabled={selectedOpsSection === operationSections.length - 1}
        onClick={handleNext}
        sx={{
          backgroundColor: "#DDD",
          fontSize: "1.2rem",
          borderRadius: "0px",
          ":hover": { bgcolor: "#ff5f01" },
        }}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    </Box>
  );
};

export default BottomNavigation;
