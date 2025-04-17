import { ReactElement } from "react";
import { Box } from "@mui/material";
import {
  FormInputCurrency,
  FormInputText,
  FormMultiSelect,
  FormSingleSelect,
  FormTimeInterval,
  FormInputDate,
  FormInputInteger,
  FormInputDecimal,
  FormYesNo,
  FormSeverityLevel,
  ViewOnlyText,
} from "./Form";
import { useData } from "../contexts/DataContext";
import { riskFields } from "../data/constants/fields";
import { useQuery } from "@tanstack/react-query";
import { fetchAssessQuestionsByTemplateId } from "../model/Questions";
import { fetchResponseOptionsByTemplateId } from "../model/ResponseOptions";
import { Loading } from "./Loading";
import { EventObj, RiskObj } from "../types/ObjectTypes";

const AssessmentQuestions = ({ appParams, questionTemplateData, control }): ReactElement | null => {
  const { EA_SA_ddlAskPer: askPer, EA_SA_ddlResponseFormat: responseFormat } = questionTemplateData;
  const { questionUpdates, riskUpdates } = useData();

  // Get Assessment Questions
  const { isPending: assessmentQuestionsPending, data: assessmentQuestions } = useQuery({
    queryKey: [`fetchAssessQuestionByTemplateId-${questionTemplateData.id}`],
    queryFn: () => fetchAssessQuestionsByTemplateId(appParams, questionTemplateData.id),
    enabled: process.env.NODE_ENV !== "development",
  });

  // Get Response Options
  const { isPending: responseOptionsPending, data: responseOptions } = useQuery({
    queryKey: [`fetchResponseOptionsByTemplateId-${questionTemplateData.id}`],
    queryFn: () => fetchResponseOptionsByTemplateId(questionTemplateData.id),
    enabled: !!assessmentQuestions,
  });

  const handleChange = (event: EventObj, riskObj: RiskObj | null) => {
    const { id, name, value } = event.target;
    let fieldValue: any = {};

    if (questionUpdates.current[id]) {
      fieldValue = questionUpdates.current[id]["fieldValue"];
      fieldValue[name] = value;
    } else {
      fieldValue[name] = value;
    }
    const newUpdatedFields = {
      ...questionUpdates.current,
      [id]: {
        ...questionUpdates.current[id],
        id: id,
        fieldValue: fieldValue,
      },
    };
    questionUpdates.current = newUpdatedFields;

    if (riskObj && riskFields.includes(riskObj.EA_SA_txtFieldIntegrationName)) {
      riskUpdates.current = { ...riskUpdates.current, [id]: riskObj };
    }
  };

  // Local environment only - Not all data is mocked, displaying a placeholder section
  if (process.env.NODE_ENV === "development") {
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ padding: 2 }}>
          <ViewOnlyText label={questionTemplateData.EA_SA_txtaQuestion} value="Fake value" />
        </Box>
      </Box>
    );
  }

  // Wait until data for questions is available
  if (assessmentQuestionsPending || responseOptionsPending) return <Loading boxStyles={{ marginY: 8 }} />;

  if (assessmentQuestions && assessmentQuestions.length > 0) {
    return assessmentQuestions.map((assessmentQuestion) => {
      const formProps = {
        appParams,
        assessmentQuestion,
        control,
        handleChange,
        questionTemplateData,
        questionUpdates,
        responseOptions,
      };
      return (
        <>
          {responseFormat === "SSP" && askPer == null ? (
            <div style={{ marginTop: 24 }}>
              <FormSingleSelect fieldName={"EA_SA_rsAssessmentResponseOptions"} {...formProps} />
            </div>
          ) : null}
          {responseFormat === "SSP" && askPer === "EA_SA_TimeInterval" ? <FormTimeInterval fieldName={"EA_SA_rsAssessmentResponseOptions"} {...formProps} /> : null}
          {askPer === "EA_SA_SeverityLevel" ? <FormSeverityLevel {...formProps} /> : null}
          {responseFormat === "FRES" ? (
            <div style={{ marginTop: 24 }}>
              <FormInputText fieldName={"EA_SA_txtaResponse"} {...formProps} />
            </div>
          ) : null}
          {responseFormat === "MSP" ? (
            <div style={{ marginTop: 24 }}>
              <FormMultiSelect fieldName={"EA_SA_txtaResponse"} {...formProps} />
            </div>
          ) : null}
          {responseFormat === "CCY" ? (
            <div style={{ marginTop: 24 }}>
              <FormInputCurrency fieldName={"EA_SA_curResponse"} {...formProps} />
            </div>
          ) : null}
          {responseFormat === "DATE" ? (
            <div style={{ marginTop: 24 }}>
              <FormInputDate fieldName={"EA_SA_ddResponse"} {...formProps} />
            </div>
          ) : null}
          {responseFormat === "INT" ? (
            <div style={{ marginTop: 24 }}>
              <FormInputInteger fieldName={"EA_SA_intResponse"} {...formProps} />
            </div>
          ) : null}
          {responseFormat === "DEC" ? (
            <div style={{ marginTop: 24 }}>
              <FormInputDecimal fieldName={"EA_SA_decResponse"} {...formProps} />
            </div>
          ) : null}
          {responseFormat === "YN" ? (
            <div style={{ marginTop: 24 }}>
              <FormYesNo fieldName={"EA_SA_rsAssessmentResponseOptions"} {...formProps} />
            </div>
          ) : null}
        </>
      );
    });
  }

  return null;
};

export default AssessmentQuestions;
