import { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useData } from "../contexts/DataContext";
import { updateQuestion } from "../model/Questions";
import { updateOpSectionStatus } from "../model/SectionStatus";
import { executeTriggers } from "../utils/common";

export const EditButtons = ({ appParams }) => {
  const [cancelClicked, setCancelClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const { opSecUpdates, questionUpdates, riskUpdates } = useData();

  const handleCancel = () => {
    setCancelClicked(true);
    window.history.go(-1);
  };

  const handleSubmit = async () => {
    setSaveClicked(true);

    /**
     * Apply SECTION response updates
     */
    for (let opSecId in opSecUpdates.current) {
      const { status } = opSecUpdates.current[opSecId];

      await updateOpSectionStatus(opSecId, status);
    }

    /**
     * Apply QUESTION response updates
     */
    for (let questionId in questionUpdates.current) {
      const { fieldValue } = questionUpdates.current[questionId];

      await updateQuestion(questionId, fieldValue);
    }

    /**
     * Apply RISK response updates
     */
    if (appParams.objectIntegrationName === "EA_RM_Risk") {
      //@ts-ignore
      let threatType = rbf_getFieldValue("EA_RM_rsThreatType");
      //@ts-ignore
      let threat = rbf_getFieldValue("EA_RM_rsThreat");
      //@ts-ignore
      let vulnerabilities = rbf_getFieldValue("EA_RM_rsVulnerability");

      let riskUpdateObj = { EA_RM_rsThreatType: threatType[0], EA_RM_rsThreat: threat[0], EA_RM_rsVulnerability: vulnerabilities.join(",") };

      for (let key in riskUpdates.current) {
        let curRiskObj = riskUpdates.current[key];
        riskUpdateObj = { ...riskUpdateObj, [curRiskObj.EA_SA_txtFieldIntegrationName]: curRiskObj.EA_SA_txtAssmtRespOptCode };
      }

      //@ts-ignore
      await rbf_updateRecord("EA_RM_Risk", appParams.id, riskUpdateObj);
    }

    await executeTriggers(appParams);

    window.history.go(-1);
  };

  if (appParams.crudAction != "edit") return null;

  return (
    <Box mb={1} display="flex" justifyContent="space-between" alignItems="right">
      <Button color="primary" onClick={handleCancel} variant="contained" size="small" sx={{ borderRadius: "0px" }}>
        {cancelClicked ? (
          <span>
            <CircularProgress size="1em" style={{ paddingRight: "4px", color: "#000" }} />
            <span>Closing...</span>
          </span>
        ) : (
          <span>Cancel</span>
        )}
      </Button>
      <Button color="warning" onClick={handleSubmit} variant="contained" size="small" sx={{ borderRadius: "0px" }}>
        {saveClicked ? (
          <span>
            <CircularProgress size="1em" style={{ paddingRight: "4px", color: "#000" }} />
            <span>Saving...</span>
          </span>
        ) : (
          <span>Save</span>
        )}
      </Button>
    </Box>
  );
};
