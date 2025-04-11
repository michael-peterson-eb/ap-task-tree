import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

import { updateQuestionWithResponse, fetchAssessQuestionsByTemplateId, concatObjectIds } from "../model/Questions";

import { updateOpSectionStatus } from "../model/SectionStatus";

import { getOperationStatus } from "../model/Assessment";
import { getAssessmentQuestionTemplateByType } from "../model/QuestionTemplates";
import { Loading } from "./Loading";

import { dateYYYYMMDDFormat } from "../utils/common";
import { useGlobal } from "../contexts/GlobalContext";
import QuestionTypeSection from "./QuestionTypeSection/QuestionTypeSection";
import { OpSecHeader } from "./OpSecHeader";
import NoQuestionTypes from "./NoQuestionTypes";
import { useData } from "../contexts/DataContext";
import { normalResponseFields, peakResponseFields, riskFields } from "../data/constants/fields";
import { EditButtons } from "./EditButtons";
import BottomNavigation from "./BottomNavigation";

export const ImpactAssessment = () => {
  const { selectedOpsSection, appParams } = useGlobal();
  const { operationSections, operationSectionsPending } = useData();
  const currentOpsSectionInfo = operationSections[selectedOpsSection];

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [questionTypes, setQuestionTypes] = useState([]);
  const [formValues, setFormValues] = useState({});
  const updateFields = useRef({}); // stores tab updated Assessment Questions
  const allQuestions = useRef({}); // stores all Assessment Question records
  const sectionQuestions = useRef({}); // stores tab Assessment Question Template records
  const [recordsLoaded, setRecordsLoaded] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const [cancelClicked, setCancelClicked] = useState(false);
  const riskUpdates = useRef({});

  const isStepOptional = (step: number) => step === 1;

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    handleSubmit();
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === questionTypes.length - 1) {
      handleReset(); // back to first step
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    handleSubmit(); // save any field(s) that were touched or updated
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTabClick = (idx: any) => {
    handleSubmit();
    setActiveStep(idx);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClose = () => {
    // no trigger is called for Scenario Test
    if (appParams.triggerId === "" || appParams.triggerId == "null") return window.history.go(-1);

    if (!cancelClicked) {
      // update should invoke the trigger [UPDATE] Calculate Assessment Time Intervals or an array of triggers
      const triggers = appParams.triggerId.split(",");

      if (appParams.assessmentType == "Incident Assessment") {
        //@ts-ignore
        rbf_runTrigger(appParams.objectIntegrationName, appParams.id, triggers[0]);
      } else if (appParams.assessmentType == "Scenario Test") {
        //placeholder for future Scenario Test trigger
      } else if (appParams.assessmentType != "Standalone Assessment") {
        triggers.forEach((triggerId: any) => {
          //@ts-ignore
          rbf_runTrigger(appParams.objectIntegrationName, appParams.id, triggerId);
        });
      }
    }

    setTimeout(function () {
      window.history.go(-1);
    }, 2000);
  };

  const handleSubmit = async (thenClose = false) => {
    const updatedRecs = updateFields.current;

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
      rbf_updateRecord("EA_RM_Risk", appParams.id, riskUpdateObj);
    }

    await updateQuestionWithResponse(updatedRecs, normalResponseFields, peakResponseFields);
    await updateStatusObject();
    if (thenClose) handleClose();
  };

  const saveButtonClicked = () => {
    setSaveClicked(true);
    handleSubmit(true);
  };

  const cancelButtonClicked = () => {
    setCancelClicked(true);
    handleClose();
  };

  const handleChange = async (type: any, event: any, aqAnswer: any, scope: any = "EA_OR_NORMAL", riskObj: any = null) => {
    const { id, name, value } = event.target; // id=typeId name=questionId
    const aqtId = aqAnswer.EA_SA_rsAssessmentQuestionTemplate;

    if (riskObj && riskFields.includes(riskObj.EA_SA_txtFieldIntegrationName)) {
      riskUpdates.current = { ...riskUpdates.current, [id]: riskObj };
    }

    trackUpdatedQuestions(name, id, type, id, value, scope);
    setSectionQuestionAnswer(name, id, aqtId, value);
  };

  const customChangedHandler = (type: any, _event: any, fieldValue: any, aqAnswer: any, scope: any = "EA_OR_NORMAL") => {
    let { id, name, value } = fieldValue;
    let aqtId = id;
    if (type != "STATUS") aqtId = aqAnswer.EA_SA_rsAssessmentQuestionTemplate;

    switch (type) {
      case "DATE":
        value = dateYYYYMMDDFormat(value.toString());
        break;
      case "INT":
        value = Math.round(Number(value.replace(/[^\d.-]/g, "")));
        break;
      case "DEC":
        value = Number(value.replace(/[^\d.-]/g, ""));
        break;
      default:
        value = value;
    }

    trackUpdatedQuestions(name, id, type, id, value, scope);
    setSectionQuestionAnswer(name, id, aqtId, value);
  };

  const trackUpdatedQuestions = (fieldName: string, typeId: any, fieldType: any, aqId: any, value: any, scope: any) => {
    const currentUpdatedFields: any = updateFields.current;

    if (fieldType === "MSP") value = concatObjectIds(value); // multi select field

    let fieldValue: any = {};
    if (currentUpdatedFields.hasOwnProperty(aqId)) {
      fieldValue = currentUpdatedFields[aqId]["fieldValue"];
      fieldValue[fieldName] = value;
    } else {
      fieldValue[fieldName] = value;
    }

    const newUpdatedFields = {
      ...currentUpdatedFields,
      [aqId]: {
        ...currentUpdatedFields[aqId],
        id: aqId,
        typeId: typeId,
        type: fieldType,
        value: value,
        scope: scope,
        fieldValue: fieldValue,
      },
    };

    updateFields.current = newUpdatedFields;
  };

  // set all section questions ref state
  const setSectionQuestions = (secQs: any) => {
    let qObj = {};
    for (let sQ of secQs) {
      qObj = {
        ...qObj,
        [sQ.id]: {
          fieldType: sQ.EA_SA_ddlResponseFormat,
          isRequired: sQ.EA_SA_cbRequiredQuestion === 1,
          isTimeInterval: sQ.EA_SA_cbAskPerTimeInterval === 1,
          value: sQ.value,
          EA_SA_txtFieldIntegrationName: sQ.EA_SA_txtFieldIntegrationName,
        },
      };
    }
    sectionQuestions.current = qObj;
  };

  // update individual section question value
  const setSectionQuestionAnswer = (fieldName: string, typeId: any, aqtId: any, qAns: any) => {
    let secQAs: any = sectionQuestions.current;
    if (secQAs.hasOwnProperty(aqtId)) {
      const currObj = secQAs[aqtId];
      secQAs = {
        ...secQAs,
        [aqtId]: {
          ...currObj,
          ...{ field: fieldName, value: qAns },
        },
      };
    }
    sectionQuestions.current = secQAs;
  };

  const doneReqField = () => {
    const secQAs: any = sectionQuestions.current;
    let nValid: any = 0;
    for (const sQS in secQAs) {
      const sQAV = secQAs[sQS];

      // increment counter if field is required and value is empty
      if (sQAV.isRequired && sQAV.value == "") nValid++;
    }

    return nValid === 0; // true is counter is 0, otherwise false
  };

  // load all the assessment questions to a ref state
  const loadAllQuestions = (opSections: any) => {
    for (let opSec of opSections) {
      getAssessmentQuestionTemplateByType(opSec).then((typeQs) => {
        for (let typeQ of typeQs) {
          fetchAssessQuestionsByTemplateId(appParams, typeQ.id).then((assesQs) => {
            for (let aQ of assesQs) {
              const currentQuestions: any = allQuestions.current;
              const newQuestions = {
                ...currentQuestions,
                [aQ.id]: {
                  ...aQ,
                  isRequired: typeQ.EA_SA_cbRequiredQuestion,
                  type: typeQ.EA_SA_ddlResponseFormat,
                },
              };
              allQuestions.current = newQuestions;
            }
          });
        }
      });
    }
  };

  const lookupFieldValue = (aqId: any) => {
    if (aqId === null) return null;
    const touchedFields: any = updateFields.current;
    if (touchedFields.hasOwnProperty(aqId)) {
      return touchedFields[aqId].value;
    } else {
      return null;
    }
  };

  const updateStatusObject = async () => {
    if (questionTypes.length > 0) {
      const updatedTrack: any = updateFields.current;

      // check if section status has been updated
      for (const objName in updatedTrack) {
        const updated: any = updatedTrack[objName];
        const activeType: any = questionTypes.find((qtype: any) => qtype.id == objName);

        if (activeType != undefined && updated.type == "STATUS") {
          const newStatus = updated.value ? "completed" : "not-started";
          const newActiveType = {
            ...activeType,
            status: newStatus,
          };

          await updateOpSectionStatus(newActiveType, newStatus);
          setQuestionTypes(await getOperationStatus(appParams));
        }
      }
    }
  };

  useEffect(() => {
    getOperationStatus(appParams).then((data) => {
      setQuestionTypes(data);
      setRecordsLoaded(true);

      // load all questions into a state variable
      if (appParams.crudAction === "edit") loadAllQuestions(data);
    });
  }, [activeStep, saveClicked]);

  if (operationSectionsPending) return <Loading />;

  if (questionTypes && questionTypes.length == 0) return <NoQuestionTypes />;

  return (
    <Box sx={{ width: "100%" }}>
      <EditButtons appParams={appParams} cancelClicked={cancelClicked} cancelButtonClicked={cancelButtonClicked} saveClicked={saveClicked} saveButtonClicked={saveButtonClicked} />
      <OpSecHeader operationSections={questionTypes} selectedOpsSec={activeStep} setSelectedOpsSection={handleTabClick} />
      <QuestionTypeSection
        recordInfo={appParams}
        qtype={questionTypes[activeStep]}
        handleFormValues={setFormValues}
        handleOnChange={handleChange}
        customChangedHandler={customChangedHandler}
        lookupFV={lookupFieldValue}
        fnSecQs={setSectionQuestions}
        fnSecQA={setSectionQuestionAnswer}
        fnDoneWithReqField={doneReqField}
      />
      <BottomNavigation activeStep={activeStep} handleBack={handleBack} handleNext={handleNext} questionTypes={questionTypes} />
    </Box>
  );
};
