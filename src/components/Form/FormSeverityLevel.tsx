import { useEffect, useState, useRef } from "react";
import { Box, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormGroup, Typography } from "@mui/material";
import { Loading } from "../Loading";
import { FormInputProps } from "../../types/FormInputProps";
import { setInnerHTML } from "../../utils/cleanup";
import { fetchQuestionsSeverityByTemplateId } from "../../model/Questions";
import { useQuery } from "@tanstack/react-query";
import { periodInScopeHas, isQuestionRequired, getNameValue } from "../../utils/common";
import { oneInScopeWidth, bothInScopeWidth } from "../../data/constants/fields";
import { ViewOnlyText } from "./";

import { FormInputCurrency, FormInputText, FormSingleSelect, FormInputDate, FormInputInteger, FormInputDecimal } from "./";

export const FormSeverityLevel = ({ appParams, assessmentQuestion, control, handleChange, questionTemplateData, questionUpdates, responseOptions }: FormInputProps) => {
  const { EA_SA_ddlResponseFormat: responseFormat } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  // Get Severity Levels
  const { isPending: severityLevelsPending, data: severityLevels } = useQuery({
    queryKey: [`fetchQuestionsSeverityByTemplateId-${questionTemplateData.id}`],
    queryFn: () => fetchQuestionsSeverityByTemplateId(appParams, questionTemplateData.id),
  });

  const [periodInScope, setPeriodInScope] = useState("");
  const colWidth = useRef(oneInScopeWidth);

  useEffect(() => {
    if (severityLevels && severityLevels.length > 0) {
      const inScope = severityLevels[0].EA_OR_mddlPeriodsInScope;

      setPeriodInScope(inScope);
      if (periodInScopeHas(inScope, "EA_OR_Normal") && periodInScopeHas(inScope, "EA_OR_Peak")) {
        colWidth.current = bothInScopeWidth;
      } else {
        colWidth.current = oneInScopeWidth;
      }
    }
  }, [severityLevels]);

  if (severityLevelsPending) return <Loading boxStyles={{ marginY: 2 }} />;

  if (mode === "view") {
    return (
      <Box sx={{ paddingTop: 2, display: "block" }}>
        <InputLabel
          sx={{
            display: "flex",
            whiteSpace: "normal",
            "& .MuiInputLabel-asterisk": { color: "red" },
          }}
          required={required}
        >
          {severityLevels.length > 0 ? (
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 14,
                color: "#1B2327",
                paddingBottom: "4px",
              }}
            >
              {setInnerHTML(severityLevels[0].EA_SA_rfQuestion)}
            </Typography>
          ) : null}
        </InputLabel>
        <TableContainer component={Paper} sx={{ border: "1px solid rgba(0, 0, 0, 0.65)", width: "inherit" }}>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#9cc1ff33",
                  "& th": { fontSize: "1.25rem" },
                }}
              >
                <TableCell style={{ width: "20%" }}>Severity Level</TableCell>
                {periodInScopeHas(periodInScope, "EA_OR_Normal") && <TableCell style={{ width: `${colWidth.current}%` }}>Impact at Normal Period</TableCell>}
                {periodInScopeHas(periodInScope, "EA_OR_Peak") && <TableCell style={{ width: `${colWidth.current}%` }}>Impact at Peak Period</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {severityLevels.length > 0 &&
                severityLevels.map((severityLevel) => {
                  return (
                    <TableRow key={severityLevel.id}>
                      <TableCell>{severityLevel.EA_OR_txtSeverityLevelName}</TableCell>
                      {periodInScopeHas(periodInScope, "EA_OR_Normal") && (
                        <TableCell style={{ padding: "0px" }}>
                          {responseFormat === "FRES" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_SA_txtaResponse} />
                            </div>
                          )}
                          {responseFormat === "SSP" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={getNameValue(responseOptions, severityLevel.EA_SA_rsAssessmentResponseOptions)} />
                            </div>
                          )}
                          {responseFormat === "INT" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_SA_intResponse} />
                            </div>
                          )}
                          {responseFormat === "DEC" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_SA_decResponse} />
                            </div>
                          )}
                          {responseFormat === "CCY" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_SA_curResponse} responseFormat="CCY" />
                            </div>
                          )}
                          {responseFormat === "DATE" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_SA_ddResponse} responseFormat="DATE" />
                            </div>
                          )}
                        </TableCell>
                      )}
                      {periodInScopeHas(periodInScope, "EA_OR_Peak") && (
                        <TableCell style={{ padding: "0px" }}>
                          {responseFormat === "FRES" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_OR_txtaResponse} />
                            </div>
                          )}
                          {responseFormat === "SSP" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={getNameValue(responseOptions, severityLevel.EA_OR_rsAssessmentResponseOptions)} />
                            </div>
                          )}
                          {responseFormat === "INT" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_OR_intResponse} />
                            </div>
                          )}
                          {responseFormat === "DEC" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_OR_decResponse} />
                            </div>
                          )}
                          {responseFormat === "CCY" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_OR_curResponse} responseFormat="CCY" />
                            </div>
                          )}
                          {responseFormat === "DATE" && (
                            <div
                              style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 8,
                              }}
                            >
                              <ViewOnlyText label={null} value={severityLevel.EA_OR_ddResponse} responseFormat="DATE" />
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  if (mode === "edit") {
    return (
      <>
        <FormGroup sx={{ paddingTop: 2, display: "block" }}>
          <InputLabel
            sx={{
              display: "flex",
              whiteSpace: "normal",
              "& .MuiInputLabel-asterisk": { color: "red" },
            }}
            required={required}
          >
            {severityLevels.length > 0 ? (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#1B2327",
                  paddingBottom: "4px",
                }}
              >
                {setInnerHTML(severityLevels[0].EA_SA_rfQuestion)}
              </Typography>
            ) : null}
          </InputLabel>

          <TableContainer component={Paper} sx={{ border: "1px solid rgba(0, 0, 0, 0.75)", width: "inherit" }}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#9cc1ff33",
                    "& th": { fontSize: "1.25rem" },
                  }}
                >
                  <TableCell style={{ width: "20%" }}>Severity Level</TableCell>
                  {periodInScopeHas(periodInScope, "EA_OR_Normal") && <TableCell style={{ width: `${colWidth.current}%` }}>Impact at Normal Period</TableCell>}
                  {periodInScopeHas(periodInScope, "EA_OR_Peak") && <TableCell style={{ width: `${colWidth.current}%` }}>Impact at Peak Period</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {severityLevels.length > 0 &&
                  severityLevels.map((severityLevel) => {
                    const formProps = {
                      appParams,
                      assessmentQuestion: severityLevel,
                      control,
                      handleChange,
                      hasLabel: false,
                      questionTemplateData,
                      questionUpdates,
                      responseOptions,
                    };
                    return (
                      <TableRow key={severityLevel.id}>
                        <TableCell>{severityLevel.EA_OR_txtSeverityLevelName}</TableCell>
                        {periodInScopeHas(periodInScope, "EA_OR_Normal") && (
                          <TableCell style={{ padding: "0px" }}>
                            {responseFormat === "FRES" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputText fieldName={"EA_SA_txtaResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "SSP" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormSingleSelect fieldName={"EA_SA_rsAssessmentResponseOptions"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "INT" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputInteger fieldName={"EA_SA_intResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "DEC" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputDecimal fieldName={"EA_SA_decResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "CCY" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputCurrency fieldName={"EA_SA_curResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "DATE" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputDate fieldName={"EA_SA_ddResponse"} {...formProps} />
                              </div>
                            )}
                          </TableCell>
                        )}
                        {periodInScopeHas(periodInScope, "EA_OR_Peak") && (
                          <TableCell style={{ padding: "0px" }}>
                            {responseFormat === "FRES" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputText fieldName={"EA_OR_txtaResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "SSP" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormSingleSelect fieldName={"EA_SA_rsPeakAssessmentResponseOptions"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "INT" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputInteger fieldName={"EA_OR_intResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "DEC" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputDecimal fieldName={"EA_OR_decResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "CCY" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputCurrency fieldName={"EA_OR_curResponse"} {...formProps} />
                              </div>
                            )}
                            {responseFormat === "DATE" && (
                              <div
                                style={{
                                  marginTop: 10,
                                  marginBottom: 10,
                                  marginRight: 8,
                                }}
                              >
                                <FormInputDate fieldName={"EA_OR_ddResponse"} {...formProps} />
                              </div>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </FormGroup>
      </>
    );
  }

  return null;
};
