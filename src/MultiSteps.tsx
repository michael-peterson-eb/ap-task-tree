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
import { updateQuestionWithResponse } from './model/Questions';
import { updateStatusJSON } from './model/SectionStatus';

import QandAForm from './QandAForm';
import { getQuestionTypes } from './model/Assessment';
import { NavButtonTheme } from './common/CustomTheme';

export default function MultiSteps({ recordInfo }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [questionTypes, setQuestionTypes] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [sectionStatus, setSectionStatus] = useState(recordInfo.sectionStatusesJSON);
  const updateFields = useRef({});
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
    //console.log("--handleNext--", formValues)
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

  const sectionTabColor = (currIdx, activeIdx, stepId) => {
    const objKey = `type-${stepId}`;
    const step = sectionStatus.hasOwnProperty(objKey) ? sectionStatus[objKey] : null;
    if (activeIdx == currIdx) {
      return 'active';
    } else if (step && step == 'completed') {
      return 'completed';
    } else {
      return 'neutral';
    }
  }

  const sectionTabIcon = (currIdx, activeIdx, stepId) => {
    const objKey = `type-${stepId}`;
    const step = sectionStatus.hasOwnProperty(objKey) ? sectionStatus[objKey] : null;
    if (step == 'completed') {
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
    if (event.target.innerText == 'Submit') handleSubmit();
  };

  useEffect(() => {
    // window event hook from outside outside Submit button
    window.addEventListener('click', handleSubmitButton);

    getQuestionTypes(recordInfo).then((data) => {
      setQuestionTypes(data);
      setRecordsLoaded(true);
    });

    // remove window event listener
    return () => window.removeEventListener('click', handleSubmitButton);
  }, []);

  /** React Form Hook */
  const handleSubmit = async () => {
    const updatedRecs = updateFields.current;
    //console.log("--handleSubmit--", updatedRecs)
    await updateQuestionWithResponse(updatedRecs, questionResponseFields);
    await updateStatusObject();
  }

  const handleChange = async (type: any, event: any) => {
    const { name, value } = event.target;
    trackUpdatedQuestions(type, name, value);
  }

  const customChangedHandler = (type: any, _event: any, autoComplete: any) => {
    const { name, value } = autoComplete;
    //console.log("--customChangedHandler--", value)
    trackUpdatedQuestions(type, name, value);
  }

  const trackUpdatedQuestions = (fieldType: any, aqId: any, value: any) => {
    const currentUpdatedFields = updateFields.current;
    const newUpdatedFields = {
      ...currentUpdatedFields,
      [aqId]: {
        ...currentUpdatedFields[aqId],
        type: fieldType,
        value: value
      }
    };
    updateFields.current = newUpdatedFields;
  }

  const formMethods = useForm();

  const onSubmit = () => {
    console.log("Submitted.....")
  }

  const updateStatusObject = async () => {
    let newValue: any = {};
    if (questionTypes.length > 0) {
      const activeType = questionTypes[activeStep]
      const typeId = activeType.id;
      const updatedTrack = updateFields.current;
      // check if section status has been updated
      if (updatedTrack.hasOwnProperty(typeId)) {
        const status = updatedTrack[typeId];
        const newStatus = status.value ? "completed" : "not-started";
        newValue[`type-${typeId}`] = newStatus;
        //console.log("--updateStatusObject:NewStatus--", sectionStatus, newValue)
        const newSectionStatus = { ...sectionStatus, ...newValue }

        // update section status state
        setSectionStatus(newSectionStatus);
        await updateStatusJSON(recordInfo, newSectionStatus);
      }
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: '100%' }}>
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
                        color={sectionTabColor(index, activeStep, label.id)}
                        variant="contained"
                        style={{ textTransform: 'none', color: activeStep == index ? '#FFF' : '#000', minHeight: '60px' }}
                        fullWidth
                        onClick={() => setActiveStep(index)}
                        endIcon={sectionTabIcon(index, activeStep, label.id)}
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
                customChangedHandler={customChangedHandler} />
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1, backgroundColor: '#DDD', fontSize: '1.2rem' }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <Button onClick={handleNext} sx={{ backgroundColor: '#DDD', fontSize: '1.2rem' }}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </Box>
            </Fragment>
          )}
        </Box>
      </form>
    </FormProvider>
  );
}