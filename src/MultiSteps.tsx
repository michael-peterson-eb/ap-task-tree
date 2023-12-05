import { useState, useEffect, Fragment, ReactNode, useRef } from 'react';
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
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FormProvider, useForm } from "react-hook-form";
import {
  updateQuestionWithResponse,
  fetchAssessQuestionsByTemplateId } from './model/Questions';

import { updateOpSectionStatus } from './model/SectionStatus';

import QandAForm from './QandAForm';
import { getOperationStatus } from './model/Assessment';
import { getAssessmentQuestionTemplateByType } from './model/QuestionTemplates'

import { NavButtonTheme } from './common/CustomTheme';
import { dateMMDDYYYYFormat, dateYYYYMMDDFormat } from './common/Utils';
import { createSecureContext } from 'tls';

export default function MultiSteps({ recordInfo }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [questionTypes, setQuestionTypes] = useState([]);
  const [formValues, setFormValues] = useState({});
  const updateFields = useRef({});
  const allQuestions = useRef({});
  const sectionQuestions = useRef({});
  const [recordsLoaded, setRecordsLoaded] = useState(false);

  const questionResponseFields = {
    MSP: "EA_SA_txtaResponse",
    SSP: "EA_SA_rsAssessmentResponseOptions",
    CCY: "EA_SA_curResponse",
    DATE: "EA_SA_ddResponse",
    FRES: "EA_SA_txtaResponse",
  };

  const isStepOptional = (step: number) => (step === 1);

  const isStepSkipped = (step: number) => (skipped.has(step));

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
    handleSubmit();  // save any field(s) that were touched or updated
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
      return 'active';
    } else if (tabButton && tabButton.status == 'completed') {
      return 'completed';
    } else {
      return 'neutral';
    }
  }

  const sectionTabIcon = (_currIdx, _activeIdx, tabButton) => {
    if (tabButton && tabButton.status == 'completed') {
      return (
        <FontAwesomeIcon icon={faCheckCircle} />
      )
    } else {
      return null;
    }
  }

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmitButton = (event: any) => {
    if (event.target.innerText == 'Submit') {
      handleSubmit();
    }
  };

  useEffect(() => {
    getOperationStatus(recordInfo).then((data) => {
      setQuestionTypes(data);
      setRecordsLoaded(true);

      // load all questions into a state variable
      if (recordInfo.crudAction === "edit") loadAllQuestions(data);
    });
  }, []);

  /** React Form Hook */
  const handleClose = () => {
    // update should invoke the trigger [UPDATE] Calculate Assessment Time Intervals
    rbf_runTrigger(recordInfo.objectIntegrationName, recordInfo.id, recordInfo.triggerId);

    setTimeout(function() {
      //window.location.href = localStorage.getItem("impactAssessViewURL");
      window.history.go(-1)
    }, 2000);
  }

  const handleSubmit = async (thenClose = false) => {
    const updatedRecs = updateFields.current;
    await updateQuestionWithResponse(updatedRecs, questionResponseFields);
    await updateStatusObject();
    if ( thenClose ) handleClose();
  }

  const handleChange = async (type: any, event: any) => {
    const { id, name, value } = event.target;     // id=typeId name=questionId
    console.log("---handleChange---", type, id, name, value);
    trackUpdatedQuestions(id, type, name, value);
    setSectionQuestionAnswer(id, name, value);
  }

  const customChangedHandler = (type: any, _event: any, autoComplete: any) => {
    let { id, name, value } = autoComplete;
    if ( type === "DATE" ) value = value ? dateYYYYMMDDFormat(value.toString()) : "";

    console.log("---customChangedHandler---", type, id, name, value);
    trackUpdatedQuestions(id, type, name, value);
  }

  const trackUpdatedQuestions = (typeId: any, fieldType: any, aqId: any, value: any) => {
    const currentUpdatedFields:any = updateFields.current;
    const newUpdatedFields = {
      ...currentUpdatedFields,
      [aqId]: {
        ...currentUpdatedFields[aqId],
        typeId: typeId,
        type: fieldType,
        value: value
      }
    };
    console.log("--trackUpdatedQuestions:allQuestions--", newUpdatedFields)
    updateFields.current = newUpdatedFields;
  }

  // set all section questions ref state
  const setSectionQuestions = (secQs:any) => {
    console.log("---loadSectionQuestions---", secQs);
    let qObj = {};
    for(let sQ of secQs) {
      qObj = {
        ...qObj,
        [sQ.id]: {
          fieldType: sQ.EA_SA_ddlResponseFormat,
          isRequired: sQ.EA_SA_cbRequiredQuestion === 1,
          isTimeInterval: sQ.EA_SA_cbAskPerTimeInterval === 1,
          value: ""
        }
      }
    }
    sectionQuestions.current = qObj;
  }

  // update individual section question value
  const setSectionQuestionAnswer = (typeId:any, ansId:any, qAns:any) => {
    let secQAs:any = sectionQuestions.current;
    if ( secQAs.hasOwnProperty(typeId) ) {
      const currObj = secQAs[typeId];
      secQAs = {...secQAs, [typeId]: {
        ...currObj,
        ...{value: qAns}
      }}
    }
    sectionQuestions.current = secQAs;
    console.log("---setSectionQuestionAnswer---", typeId, ansId, qAns, secQAs);
  }

  const doneReqField = () => {
    const secQAs:any = sectionQuestions.current;
    let nValid:any = 0;
    for (const sQS in secQAs) {
      const sQAV = secQAs[sQS];
      if ( sQAV.isRequired && sQAV.value == "") nValid++;
      console.log("---doneREquiered:1---", sQAV);
    }
    console.log("---doneREquiered---", nValid === 0);
    return nValid === 0;
  }

  // load all the assessment questions to a ref state
  const loadAllQuestions = (opSections:any) => {
    for (let opSec of opSections) {
      getAssessmentQuestionTemplateByType(opSec).then((typeQs) => {
        for (let typeQ of typeQs) {
          fetchAssessQuestionsByTemplateId(recordInfo, typeQ.id).then((assesQs) => {
            for (let aQ of assesQs) {
              const currentQuestions:any = allQuestions.current;
              const newQuestions = {
                ...currentQuestions,
                [aQ.id]: {
                  ...currentQuestions[aQ.id],
                  isRequired: typeQ.EA_SA_cbRequiredQuestion,
                  type: typeQ.EA_SA_ddlResponseFormat
                }
              };
              allQuestions.current = newQuestions;
            }
          });
        }
      });
    }
  };

  const lookupFieldValue = (aqId: any) => {
    const touchedFields:any = updateFields.current;
    if ( touchedFields.hasOwnProperty(aqId) ) {
      return touchedFields[aqId].value;
    } else {
      return null;
    }
  }

  const formMethods = useForm();

  const onSubmit = () => {
    console.log("Submitted.....")
  }

  const updateStatusObject = async () => {
    if (questionTypes.length > 0) {
      const activeType = questionTypes[activeStep]
      const typeId = activeType.id;
      const updatedTrack = updateFields.current;
      // check if section status has been updated
      if (updatedTrack.hasOwnProperty(typeId)) {
        const status = updatedTrack[typeId];
        const newStatus = status.value ? "completed" : "not-started";
        const newActiveType = {
          ...activeType,
          status: newStatus
          };

        await updateOpSectionStatus(newActiveType, newStatus);
        setQuestionTypes(await getOperationStatus(recordInfo));
      }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: '100%' }}>
          {questionTypes.length > 0 && recordInfo.crudAction == "edit" &&
            <Box m={1} display="flex" justifyContent="space-between" alignItems="right">
              <ThemeProvider theme={NavButtonTheme}>
                <Button
                  color="primary"
                  onClick={handleClose}
                  variant="contained"
                  size="small"
                  sx={{borderRadius: '0px'}}>Close
                </Button>

                <Button
                  color="warning"
                  onClick={() => handleSubmit(true)}
                  variant="contained"
                  size="small"
                  sx={{borderRadius: '0px'}}>Save
                </Button>
              </ThemeProvider>
            </Box>
          }
          <Stepper activeStep={activeStep}>
            <Grid container spacing={1}>
              {questionTypes.length > 0 && questionTypes.map((label, index) => {
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
                  <Grid item xs={(12 / questionTypes.length)}>
                    <ThemeProvider theme={NavButtonTheme}>
                      <Button
                        color={sectionTabColor(index, activeStep, label)}
                        variant="contained"
                        style={{ textTransform: 'none', color: activeStep == index ? '#FFF' : '#000', minHeight: '60px' }}
                        fullWidth
                        onClick={() => setActiveStep(index)}
                        endIcon={sectionTabIcon(index, activeStep, label)}
                      >
                        {label.name}
                      </Button>
                    </ThemeProvider>
                  </Grid>
                );
              })}
            </Grid>
          </Stepper>
          {questionTypes.length == 0 ? (
            <Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                {recordsLoaded && questionTypes.length == 0 &&
                  <Alert sx={{ marginTop: '12px' }} severity="warning">
                    <AlertTitle>No assessment questions found!</AlertTitle>
                  </Alert>
                }
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
                fnDoneWithReqField={doneReqField}/>
              {questionTypes.length > 1 &&
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1, marginTop: 4, }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1, backgroundColor: '#DDD', fontSize: '1.2rem', borderRadius: '0px', ':hover': {bgcolor: '#ff5f01'} }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </Button>
                  <Button
                    disabled={activeStep === questionTypes.length - 1}
                    onClick={handleNext}
                    sx={{ backgroundColor: '#DDD', fontSize: '1.2rem', borderRadius: '0px', ':hover': {bgcolor: '#ff5f01'} }}>
                      <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                </Box>
              }
            </Fragment>
          )}
        </Box>
      </form>
    </FormProvider>
  );
}