import { useState } from "react";
import { Box, Button, CircularProgress, ThemeProvider } from "@mui/material";
import { NavButtonTheme } from "../style/CustomTheme";
import { useData } from "../contexts/DataContext";
import { normalResponseFields, peakResponseFields } from "../data/constants/fields";
import { updateQuestion } from "../model/Questions";
import { updateOpSectionStatus } from "../model/SectionStatus";

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
      const { type, fieldValue } = questionUpdates.current[questionId];

      if (normalResponseFields[type]) {
        await updateQuestion(questionId, fieldValue);
      }
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

    await executeTriggers();

    window.history.go(-1);
  };

  const executeTriggers = async () => {
    // no trigger is called for Scenario Test
    if (appParams.triggerId === "" || appParams.triggerId == "null") return;

    // update should invoke the trigger [UPDATE] Calculate Assessment Time Intervals or an array of triggers
    const triggers = appParams.triggerId.split(",");

    if (appParams.assessmentType == "Incident Assessment") {
      //@ts-ignore
      await rbf_runTrigger(appParams.objectIntegrationName, appParams.id, triggers[0]);
    } else if (appParams.assessmentType == "Scenario Test") {
      //placeholder for future Scenario Test trigger
    } else if (appParams.assessmentType != "Standalone Assessment") {
      triggers.forEach(async (triggerId: any) => {
        //@ts-ignore
        await rbf_runTrigger(appParams.objectIntegrationName, appParams.id, triggerId);
      });
    }
  };

  if (appParams.crudAction != "edit") return null;

  return (
    <Box mb={1} display="flex" justifyContent="space-between" alignItems="right">
      <ThemeProvider theme={NavButtonTheme}>
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
      </ThemeProvider>
    </Box>
  );
};
