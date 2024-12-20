import { useState, useEffect, Fragment, ReactNode, useRef } from "react";
import {
  Stepper,
  Grid,
  Button,
  Typography,
  Box,
  ThemeProvider,
  Alert,
  AlertTitle,
  CircularProgress,
  useMediaQuery,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { FormProvider, useForm } from "react-hook-form";
import Carousel from "./components/Carousel/Carousel";

import {
  updateQuestionWithResponse,
  fetchAssessQuestionsByTemplateId,
  concatObjectIds,
} from "./model/Questions";

import { updateOpSectionStatus } from "./model/SectionStatus";

import QandAForm from "./QandAForm";
import { getOperationStatus } from "./model/Assessment";
import { getAssessmentQuestionTemplateByType } from "./model/QuestionTemplates";

import { NavButtonTheme } from "./common/CustomTheme";
import { dateYYYYMMDDFormat } from "./common/Utils";

export default function MultiSteps({ recordInfo }) {
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
  const largeScreen: boolean = useMediaQuery("(min-width:1008px)");

  const normalResponseFields = {
    INT: "EA_SA_intResponse",
    DEC: "EA_SA_decResponse",
    MSP: "EA_SA_txtaResponse",
    SSP: "EA_SA_rsAssessmentResponseOptions",
    CCY: "EA_SA_curResponse",
    DATE: "EA_SA_ddResponse",
    FRES: "EA_SA_txtaResponse",
  };

  const peakResponseFields = {
    INT: "EA_OR_intResponse",
    DEC: "EA_OR_decResponse",
    MSP: "EA_OR_txtaResponse",
    SSP: "EA_SA_rsPeakAssessmentResponseOptions",
    CCY: "EA_OR_curResponse",
    DATE: "EA_OR_ddResponse",
    FRES: "EA_OR_txtaResponse",
  };

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

  const sectionTabColor = (currIdx: any, activeIdx: any, tabButton: any) => {
    if (activeIdx == currIdx) {
      return "active";
    } else if (tabButton && tabButton.status == "completed") {
      return "completed";
    } else {
      return "neutral";
    }
  };

  const sectionTabIcon = (_currIdx: any, _activeIdx: any, tabButton: any) => {
    if (tabButton && tabButton.status == "completed") {
      return <FontAwesomeIcon icon={faCheckCircle} />;
    } else {
      return null;
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClose = () => {
    // no trigger is called for Scenario Test
    if (!cancelClicked) {
      // update should invoke the trigger [UPDATE] Calculate Assessment Time Intervals or an array of triggers
      const triggers = recordInfo.triggerId.split(",");
      triggers.forEach((triggerId: any) => {
        rbf_runTrigger(
          recordInfo.objectIntegrationName,
          recordInfo.id,
          triggerId
        );
      });
    }

    setTimeout(function () {
      window.history.go(-1);
    }, 2000);
  };

  const handleSubmit = async (thenClose = false) => {
    const updatedRecs = updateFields.current;

    await updateQuestionWithResponse(
      updatedRecs,
      normalResponseFields,
      peakResponseFields
    );
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

  const handleChange = async (
    type: any,
    event: any,
    aqAnswer: any,
    scope: any = "EA_OR_NORMAL"
  ) => {
    const { id, name, value } = event.target; // id=typeId name=questionId
    const aqtId = aqAnswer.EA_SA_rsAssessmentQuestionTemplate;

    //console.log("--handleChange--", type, id, name, value, aqAnswer)

    trackUpdatedQuestions(name, id, type, id, value, scope);
    setSectionQuestionAnswer(name, id, aqtId, value);
  };

  const customChangedHandler = (
    type: any,
    _event: any,
    fieldValue: any,
    aqAnswer: any,
    scope: any = "EA_OR_NORMAL"
  ) => {
    let { id, name, value } = fieldValue;
    let aqtId = id;
    //console.log("--customChangedHandler--", fieldValue)
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

  const trackUpdatedQuestions = (
    fieldName: string,
    typeId: any,
    fieldType: any,
    aqId: any,
    value: any,
    scope: any
  ) => {
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
    //console.log("--trackUpdatedQuestions--", newUpdatedFields)
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
        },
      };
    }
    sectionQuestions.current = qObj;
  };

  // update individual section question value
  const setSectionQuestionAnswer = (
    fieldName: string,
    typeId: any,
    aqtId: any,
    qAns: any
  ) => {
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
    //console.log("---setSectionQuestionAnswer---", typeId, aqtId, qAns, secQAs);
  };

  const doneReqField = () => {
    const secQAs: any = sectionQuestions.current;
    let nValid: any = 0;
    for (const sQS in secQAs) {
      const sQAV = secQAs[sQS];
      //console.log("--doneReqField--", sQAV, sQS)

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
          fetchAssessQuestionsByTemplateId(recordInfo, typeQ.id).then(
            (assesQs) => {
              for (let aQ of assesQs) {
                const currentQuestions: any = allQuestions.current;
                const newQuestions = {
                  ...currentQuestions,
                  [aQ.id]: {
                    ...currentQuestions[aQ.id],
                    isRequired: typeQ.EA_SA_cbRequiredQuestion,
                    type: typeQ.EA_SA_ddlResponseFormat,
                  },
                };
                allQuestions.current = newQuestions;
              }
            }
          );
        }
      });
    }
  };

  const lookupFieldValue = (aqId: any) => {
    const touchedFields: any = updateFields.current;
    if (touchedFields.hasOwnProperty(aqId)) {
      return touchedFields[aqId].value;
    } else {
      return null;
    }
  };

  const formMethods = useForm();

  const updateStatusObject = async () => {
    if (questionTypes.length > 0) {
      const updatedTrack: any = updateFields.current;

      // check if section status has been updated
      for (const objName in updatedTrack) {
        const updated: any = updatedTrack[objName];
        const activeType: any = questionTypes.find(
          (qtype: any) => qtype.id == objName
        );

        if (activeType != undefined && updated.type == "STATUS") {
          const newStatus = updated.value ? "completed" : "not-started";
          const newActiveType = {
            ...activeType,
            status: newStatus,
          };

          await updateOpSectionStatus(newActiveType, newStatus);
          setQuestionTypes(await getOperationStatus(recordInfo));
        }
      }
    }
  };

  useEffect(() => {
    getOperationStatus(recordInfo).then((data) => {
      setQuestionTypes(data);
      setRecordsLoaded(true);

      // load all questions into a state variable
      if (recordInfo.crudAction === "edit") loadAllQuestions(data);
    });
  }, [activeStep, saveClicked]);

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ width: "100%" }}>
        {questionTypes.length > 0 && recordInfo.crudAction == "edit" && (
          <Box
            mb={1}
            display="flex"
            justifyContent="space-between"
            alignItems="right"
          >
            <ThemeProvider theme={NavButtonTheme}>
              <Button
                color="primary"
                onClick={cancelButtonClicked}
                variant="contained"
                size="small"
                sx={{ borderRadius: "0px" }}
              >
                {cancelClicked ? (
                  <span>
                    <CircularProgress
                      size="1em"
                      style={{ paddingRight: "4px", color: "#000" }}
                    />
                    <span>Closing...</span>
                  </span>
                ) : (
                  <span>Cancel</span>
                )}
              </Button>
              <Button
                color="warning"
                onClick={saveButtonClicked}
                variant="contained"
                size="small"
                sx={{ borderRadius: "0px" }}
              >
                {saveClicked ? (
                  <span>
                    <CircularProgress
                      size="1em"
                      style={{ paddingRight: "4px", color: "#000" }}
                    />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span>Save</span>
                )}
              </Button>
            </ThemeProvider>
          </Box>
        )}
        {largeScreen ? (
          <Box sx={{ margin: "auto", overflow: "hidden", maxHeight: "60px" }}>
            <Carousel
              questionTypes={questionTypes}
              activeStep={activeStep}
              handleTabClick={handleTabClick}
            />
          </Box>
        ) : (
          <Grid item xs={12}>
            <Select
              id="select-active-step"
              value={activeStep}
              onChange={(e) => {
                handleTabClick(e.target.value);
              }}
              sx={{ width: "100%", maxWidth: "420px" }}
            >
              {questionTypes.length > 0 &&
                questionTypes.map((label: any, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: {
                    optional?: ReactNode;
                  } = {};
                  if (isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography variant="caption">Optional</Typography>
                    );
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
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
                          {label.name}
                        </ListItemText>
                        <ListItemIcon>
                          {sectionTabIcon(index, activeStep, label)}
                        </ListItemIcon>
                      </Box>
                    </MenuItem>
                  );
                })}
            </Select>
          </Grid>
        )}
        {/* Previous tabs for reference*/}
        {/* <Stepper activeStep={activeStep}>
          <Grid container spacing={1}>
            {largeScreen ? (
              questionTypes.length > 0 &&
              questionTypes.map((label: any, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: ReactNode;
                } = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Grid item xs={12 / questionTypes.length}>
                    <ThemeProvider theme={NavButtonTheme}>
                      <Button
                        id={label.id}
                        color={sectionTabColor(index, activeStep, label)}
                        variant="contained"
                        style={{
                          textTransform: "none",
                          color: activeStep == index ? "#FFF" : "#000",
                          minHeight: "60px",
                          lineHeight: "1.2",
                        }}
                        fullWidth
                        onClick={() => handleTabClick(index)}
                        endIcon={sectionTabIcon(index, activeStep, label)}
                      >
                        {label.name}
                      </Button>
                    </ThemeProvider>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Select
                  id="select-active-step"
                  value={activeStep}
                  onChange={(e) => {
                    handleTabClick(e.target.value);
                  }}
                  sx={{ width: "100%", maxWidth: "420px" }}
                >
                  {questionTypes.length > 0 &&
                    questionTypes.map((label: any, index) => {
                      const stepProps: { completed?: boolean } = {};
                      const labelProps: {
                        optional?: ReactNode;
                      } = {};
                      if (isStepOptional(index)) {
                        labelProps.optional = (
                          <Typography variant="caption">Optional</Typography>
                        );
                      }
                      if (isStepSkipped(index)) {
                        stepProps.completed = false;
                      }
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
                              {label.name}
                            </ListItemText>
                            <ListItemIcon>
                              {sectionTabIcon(index, activeStep, label)}
                            </ListItemIcon>
                          </Box>
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
            )}
          </Grid>
        </Stepper> */}
        {/* <Stepper activeStep={activeStep}>
          <Grid container spacing={1}>
            {largeScreen ? (
              questionTypes.length > 0 &&
              questionTypes.map((label: any, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: ReactNode;
                } = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Grid item xs={12 / questionTypes.length}>
                    <ThemeProvider theme={NavButtonTheme}>
                      <Button
                        id={label.id}
                        color={sectionTabColor(index, activeStep, label)}
                        variant="contained"
                        style={{
                          textTransform: "none",
                          color: activeStep == index ? "#FFF" : "#000",
                          minHeight: "60px",
                          lineHeight: "1.2",
                        }}
                        fullWidth
                        onClick={() => handleTabClick(index)}
                        endIcon={sectionTabIcon(index, activeStep, label)}
                      >
                        {label.name}
                      </Button>
                    </ThemeProvider>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Select
                  id="select-active-step"
                  value={activeStep}
                  onChange={(e) => {
                    handleTabClick(e.target.value);
                  }}
                  sx={{ width: "100%", maxWidth: "420px" }}
                >
                  {questionTypes.length > 0 &&
                    questionTypes.map((label: any, index) => {
                      const stepProps: { completed?: boolean } = {};
                      const labelProps: {
                        optional?: ReactNode;
                      } = {};
                      if (isStepOptional(index)) {
                        labelProps.optional = (
                          <Typography variant="caption">Optional</Typography>
                        );
                      }
                      if (isStepSkipped(index)) {
                        stepProps.completed = false;
                      }
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
                              {label.name}
                            </ListItemText>
                            <ListItemIcon>
                              {sectionTabIcon(index, activeStep, label)}
                            </ListItemIcon>
                          </Box>
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
            )}
          </Grid>
        </Stepper> */}
        {questionTypes.length == 0 ? (
          <Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {recordsLoaded && questionTypes.length == 0 && (
                <Alert sx={{ marginTop: "12px" }} severity="warning">
                  <AlertTitle>No assessment questions found!</AlertTitle>
                </Alert>
              )}
              {!recordsLoaded && <CircularProgress />}
            </Typography>
          </Fragment>
        ) : (
          <Fragment>
            <QandAForm
              recordInfo={recordInfo}
              qtype={questionTypes[activeStep]}
              handleFormValues={setFormValues}
              handleOnChange={handleChange}
              customChangedHandler={customChangedHandler}
              lookupFV={lookupFieldValue}
              fnSecQs={setSectionQuestions}
              fnSecQA={setSectionQuestionAnswer}
              fnDoneWithReqField={doneReqField}
            />
            {questionTypes.length > 1 && (
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
                  disabled={activeStep === 0}
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
                  disabled={activeStep === questionTypes.length - 1}
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
            )}
          </Fragment>
        )}
      </Box>
    </FormProvider>
  );
}
