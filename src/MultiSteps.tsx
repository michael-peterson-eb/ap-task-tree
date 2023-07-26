import {useState, useEffect, Fragment, ReactNode, useRef} from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Grid from '@mui/material/Grid';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Box, ThemeProvider} from '@mui/material';
import { FormProvider, useForm, useFieldArray } from "react-hook-form";

import QandA from './QandA';
import QandAForm from './QandAForm';
import QADataGrid from './QADataGrid';
import { getQuestionTypes } from './model/Assessment';
import { NavButtonTheme } from './common/CustomTheme';

export default function MultiSteps({recordInfo}) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [questionTypes, setQuestionTypes] = useState([]);
  const [formUpdated, setFormUpdated] = useState(false);

  //const [currentRecordInfo, setCurrentRecordInfo] = React.useState(recordInfo);

  //const [sectionStatus, setSectionStatus] = React.useState({});

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  let formValues = {};

  const handleNext = () => {
    let newSkipped = skipped;
    console.log("--handleNext--", formValues)
    handleSubmit();
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
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

  //let questionTypes = React.useRef(null);

  useEffect(() => {
    // (async () => {
    //   //console.log("--useEffect--currentRecordInfo---", currentRecordInfo)
    //   //const qTypes = await _RB.selectQuery(['id', 'name'],'EA_SA_AssessmentQuestionType', true, 1000, true);
    //   const qTypes = await getQuestionTypes(recordInfo);
    //   console.log("--useEffect--currentRecordInfo---", qTypes)
    //   setQuestionTypes(await qTypes);
    //   console.log("--questionTypes---", questionTypes)
    // })();
    console.log("--useEffect:recordInfo-->", recordInfo)
    getQuestionTypes(recordInfo).then((data) => {

      console.log("--useEffect:data--", data)
      setQuestionTypes((prevData) => ([...prevData, ...data]));
      console.log("--questionTypes---", questionTypes)
      //console.log("--questionTypes:types---", types)
    });
  }, []);

  /** React Form Hook */

  const handleSubmit = () => {
    const formFields = Object.keys(formValues);
    let newFormValues = {...formValues}
    console.log("--handleSubmit--", formFields, newFormValues)
    for (let index = 0; index < formFields.length; index++) {
      const currentField = formFields[index];
      const currentValue = formValues[currentField].value;

      if(currentValue === ''){
        newFormValues = {
          ...newFormValues,
          [currentField]:{
            ...newFormValues[currentField],
            error:true
          }
        }
      }
    }
    setFormValues(newFormValues)
  }

  const handleChange = (e) => {
    const {name, value} = e.target;
    console.log("--handleChange--", e)
    setFormUpdated(true);
    setFormValues({
      ...formValues,
      [name]:{
        ...formValues[name],
        value
      }
    });
  }

  const formMethods = useForm();

  const onSubmit = () => {
    console.log("Submitted.....")
  }

  const setFormValues = (values) => {
    console.log("--formValues--", values)
    formValues = values;
  }

  console.log("--MultiStep-->", recordInfo)
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
                <Button color='neutral' variant="contained" style={{textTransform: 'none', color: "#000"}} fullWidth>
                  {label.name}
                </Button>
              </ThemeProvider>
            </Grid>
          );
        })}
        </Grid>
      </Stepper>
      {activeStep === questionTypes.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <QandAForm recordInfo={recordInfo} qtype={questionTypes[activeStep]} handleFormValues={setFormValues} handleOnChange={handleChange}/>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === questionTypes.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Fragment>
      )}
    </Box>

    </form>
    </FormProvider>
  );
}