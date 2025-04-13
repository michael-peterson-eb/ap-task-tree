import { useEffect, useState } from "react";
import { Alert, AlertTitle, FormControlLabel, Checkbox } from "@mui/material";
import { useData } from "../contexts/DataContext";
import { useGlobal } from "../contexts/GlobalContext";

export const EditAlert = () => {
  const { opSecUpdates, operationSections, refetchOpSecs } = useData();
  const { appParams, selectedOpsSection } = useGlobal();

  const { id, name: questionName, status } = operationSections[selectedOpsSection];
  const { crudAction: mode, objectTitle } = appParams;

  const [isCompleted, setIsCompleted] = useState(false);

  const getDefaultCheckValue = ({ id }) => {
    //@ts-ignore If the status has already been updated, use that value. Otherwise, use the default value
    // that was pulled from the initial request
    const checkDefaultValue = opSecUpdates.current[id]?.status;

    if (checkDefaultValue) {
      return checkDefaultValue === "completed" ? true : false;
    } else {
      return status === "completed" ? true : false;
    }
  };

  useEffect(() => {
    /* Query key is the same and does not change for ops secs, so we need to manually refetch */
    refetchOpSecs();

    const defaultValue = getDefaultCheckValue({ id });
    setIsCompleted(defaultValue);
  }, [id]);

  if (mode !== "edit") return null;

  return (
    <Alert key={`edit-alert-${id}`} sx={{ marginTop: "12px", marginBottom: "6px" }} severity="info">
      <AlertTitle>{objectTitle}</AlertTitle>
      <FormControlLabel
        key={`edit-alert-checkbox-${id}`}
        control={
          <Checkbox
            id={`currentOpsSecCheckbox-${id}`}
            name={`currentOpsSecCheckboxName-${id}`}
            checked={isCompleted}
            onChange={(event: any) => {
              const isChecked = event.target.checked;

              setIsCompleted(isChecked);
              const newStatus = isChecked ? "completed" : "in-progress";

              opSecUpdates.current = { ...opSecUpdates.current, [id]: { status: newStatus } };
            }}
            //TODO: check if all required fields are complete
            disabled={false}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label={`Checked if ${questionName} ${objectTitle} is complete!`}
      />
    </Alert>
  );
};
