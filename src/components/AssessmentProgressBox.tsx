import { useState, useEffect } from "react";
import { Box, Typography, Button, FormControlLabel, Checkbox, useMediaQuery } from "@mui/material";
import PreviousArrow from "../data/icons/PreviousArrow";
import NextArrow from "../data/icons/NextArrow";
import { useData } from "../contexts/DataContext";
import { useGlobal } from "../contexts/GlobalContext";

const AssessmentProgressBox = ({ isValid, trigger, smallScreen }) => {
  const { opSecUpdates, operationSections, refetchOpSecs, opSecStatuses, setOpSecStatuses } = useData();
  const { appParams, selectedOpsSection, setSelectedOpsSection } = useGlobal();
  const currentStatus = opSecStatuses[selectedOpsSection];
  const { id } = operationSections[selectedOpsSection];
  const { crudAction: mode } = appParams;

  const [attemptedCheck, setAttemptedCheck] = useState(false);

  const handleBack = () => {
    if (selectedOpsSection > 0) {
      setSelectedOpsSection((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleNext = () => {
    if (selectedOpsSection === operationSections.length - 1) {
      setSelectedOpsSection(0);
    } else {
      setSelectedOpsSection((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleCheckboxChange = (event: any) => {
    /** Trigger the validation call from react-hook-form */
    trigger();

    /** Used to verify that an attempt was made to check the box. This is necessary for displaying
     * the error message in the JSX below. If the component is only dependent on the isValid prop,
     * we may see the error message before the user has had a chance to enter values.
     */
    setAttemptedCheck(true);

    if (isValid) {
      const isChecked = event.target.checked;

      const updatedStatuses = opSecStatuses.map((opSecStatus, index) => {
        if (index === selectedOpsSection) {
          return isChecked;
        } else {
          return opSecStatus;
        }
      });

      setOpSecStatuses(updatedStatuses);

      /** Update the status for backend updates */
      const newStatus = isChecked ? "completed" : "in-progress";
      opSecUpdates.current = { ...opSecUpdates.current, [id]: { status: newStatus } };
    }
  };

  useEffect(() => {
    /* Query key is the same and does not change for ops secs, so we need to manually refetch */
    refetchOpSecs();
  }, [id]);

  if (mode !== "edit") return null;

  return (
    <Box sx={{ width: smallScreen ? "100%" : 350, borderRadius: "4px 4px 0px 0px", border: "1px solid #CFD8DC", height: "min-content" }}>
      <Box sx={{ width: "100%", padding: 2, boxSizing: "border-box" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontSize={smallScreen ? 12 : 14} fontStyle="normal" fontWeight={700} lineHeight="22px" color="#1B2327">
            Assessment Progress
          </Typography>
          <Typography fontSize={smallScreen ? 10 : 12} fontStyle="normal" fontWeight={400} lineHeight="normal" color="#1B2327">
            Section {selectedOpsSection + 1} of 11
          </Typography>
        </Box>
        <Box sx={{ display: "grid", width: "100%", gap: "2px", gridTemplateColumns: `repeat(${operationSections.length}, 1fr)`, paddingY: "12px" }}>
          {operationSections.map((operationSection, index) => {
            const currentStatus = opSecStatuses[index];
            const cardColor = currentStatus ? "#117E2F" : "#DEE9FF";

            const isSelected = selectedOpsSection === index;
            let radiusStyle = "";
            if (index === 0) {
              radiusStyle = "4px 0px 0px 4px";
            }

            if (index === operationSections.length - 1) {
              radiusStyle = "0px 4px 4px 0px";
            }

            return <div key={`progress-box-${operationSection.id}`} style={{ height: "18px", backgroundColor: isSelected ? "#0042B6" : cardColor, borderRadius: radiusStyle }} />;
          })}
        </Box>
        <div style={{ paddingTop: "12px", borderTop: "1px solid #CFD8DC" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            startIcon={<PreviousArrow />}
            sx={{ fontSize: "14px", border: "1px solid #CFD8DC", color: "#445A65", textTransform: "none" }}
            onClick={handleBack}
            size={smallScreen ? "small" : "medium"}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            endIcon={<NextArrow />}
            sx={{ fontSize: "14px", border: "1px solid #CFD8DC", color: "#0042B6", textTransform: "none" }}
            onClick={handleNext}
            size={smallScreen ? "small" : "medium"}
          >
            Next
          </Button>
        </Box>
      </Box>
      {mode === "edit" ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "16px", borderRadius: "0px 0px 4px 4px", borderTop: "1px solid #CFD8DC" }}>
          <FormControlLabel
            label={
              <Typography fontSize={14} fontStyle="normal" fontWeight={500} lineHeight="22px" color="#1B2327">
                Complete Section
              </Typography>
            }
            control={<Checkbox checked={currentStatus} onChange={handleCheckboxChange} sx={{ margin: 0, padding: 0 }} />}
          />

          {!isValid && attemptedCheck && <Typography sx={{ color: "#e53e3e" }}>Please complete all required fields</Typography>}
        </Box>
      ) : null}
    </Box>
  );
};

export default AssessmentProgressBox;
