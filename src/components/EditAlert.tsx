import { useEffect, useState } from "react";
import { Alert, AlertTitle, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { useData } from "../contexts/DataContext";
import { useGlobal } from "../contexts/GlobalContext";

export const EditAlert = ({ isValid, trigger }) => {
  const { opSecUpdates, operationSections, refetchOpSecs, opSecStatuses, setOpSecStatuses } = useData();
  const { appParams, selectedOpsSection } = useGlobal();
  const currentStatus = opSecStatuses[selectedOpsSection];
  const { id, name: questionName } = operationSections[selectedOpsSection];
  const { crudAction: mode, objectTitle } = appParams;

  const [attemptedCheck, setAttemptedCheck] = useState(false);

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
  }, []);

  if (mode !== "edit") return null;

  return (
    <Alert key={`edit-alert-${id}`} sx={{ marginTop: "12px", marginBottom: "6px" }} severity="info">
      <AlertTitle>{objectTitle}</AlertTitle>
      <FormControlLabel label={`Checked if ${questionName} ${objectTitle} is complete!`} control={<Checkbox checked={currentStatus} onChange={handleCheckboxChange} />} />
      {!isValid && attemptedCheck && <Typography sx={{ color: "#e53e3e" }}>Please complete all required fields</Typography>}
    </Alert>
  );
};
