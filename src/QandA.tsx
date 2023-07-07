import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const queryTemplateQuestion = async (type) => {
  console.log('--query--', type)
  const condition = `EA_SA_rsAssessmentQuestionType = ${type.id} ORDER BY EA_SA_intDisplayOrder ASC`
  const fields = [
      'id',
      'EA_SA_ddlResponseFormat#code',
      'EA_SA_cbIncludeFileUpload',
      'EA_SA_txtaQuestion',
      'EA_SA_intDisplayOrder',
      'EA_SA_cbAskPerTimeInterval',
      'EA_SA_cbRequiredQuestion',
      'EA_SA_cbIncludeFileUpload',
      'EA_SA_intQuestionWeighting'
  ]

  return await _RB.selectQuery(fields,'EA_SA_AssessmentQuestionTemplate', condition, 10000, true);
}

export default async function QandA(props) {
  if ( props == undefined ) return "";
  console.log('--qanda:props--', props.qtype)
  const asQuestions = await queryTemplateQuestion(props.qtype);
  console.log('--qanda--', asQuestions)
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography sx={{ mt: 2, mb: 1 }}>Question and Answer for </Typography>
      <Grid container spacing={2}>
        {asQuestions.map((q) => {
          return
            <Grid item xs={4}>
              <Item>{q.EA_SA_txtaQuestion}</Item>
            </Grid>
            <Grid item xs={8}>
              <Item>xs=4</Item>
            </Grid>;
        })}
      </Grid>
    </Box>
  );
}