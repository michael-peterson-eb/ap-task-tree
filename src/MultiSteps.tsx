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
import { updateOpSectionStatus } from './model/SectionStatus';

import QandAForm from './QandAForm';
import { getOperationStatus } from './model/Assessment';
import { NavButtonTheme } from './common/CustomTheme';
import { dateMMDDYYYYFormat, dateYYYYMMDDFormat } from './common/Utils';

export default function MultiSteps({ recordInfo }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [questionTypes, setQuestionTypes] = useState([]);
  const [formValues, setFormValues] = useState({});
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
    const { name, value } = event.target;
    trackUpdatedQuestions(type, name, value);
  }

  const customChangedHandler = (type: any, _event: any, autoComplete: any) => {
    let { name, value } = autoComplete;
    if ( type === "DATE" ) value = value ? dateYYYYMMDDFormat(value.toString()) : "";
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
    console.log("--trackUpdatedQuestions--", newUpdatedFields)
    updateFields.current = newUpdatedFields;
  }

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
                  sx={{borderRadius: '0px'}}>Submit
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
                lookupFV={lookupFieldValue} />
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