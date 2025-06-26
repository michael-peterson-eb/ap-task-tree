import { useEffect, useState } from "react";
import { Select, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormGroup, MenuItem, Typography, Box, Tooltip, Chip } from "@mui/material";
import { FormInputProps } from "../../types/FormInputProps";
import { fetchQuestionsIntervalsByTemplateId } from "../../model/Questions";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";
import { ViewOnlyText } from "./ViewOnlyText";
import { showTimeInterval } from "../../utils/format";
import { getNameValue, isQuestionRequired } from "../../utils/common";
import { getQuestionHTML, setInnerHTML } from "../../utils/cleanup";
import { Controller } from "react-hook-form";
import { useData } from "../../contexts/DataContext";

export const FormTimeInterval = ({
  fieldName,
  appParams,
  assessmentQuestion,
  control,
  getFormValues,
  handleChange,
  questionTemplateData,
  responseOptions,
  setFormValue,
}: FormInputProps) => {
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;
  const { assessmentType } = useData();

  const [objValues, setObjValues] = useState<any>({});
  const [menuOpen, setMenuOpen] = useState({});

  const adminIds = [90, 95];
  const adminCodes = ["ea_businessadmin", "ea_itadmin", "ea_subadmin", "ea_admin"];
  // @ts-expect-error This is attached to window
  const user = window.currentUser;
  const isAdmin = adminIds.indexOf(user?.CURR_USER_ROLE_ID) >= 0 || adminCodes.indexOf(user?.CURR_USER_ROLE_CODE.toLowerCase()) >= 0;

  // Get Time Intervals
  const { isPending: timeIntervalsPending, data: timeIntervals } = useQuery({
    queryKey: [`fetchQuestionsIntervalsByTemplateId-${questionTemplateData.id}`],
    queryFn: () => fetchQuestionsIntervalsByTemplateId(appParams, questionTemplateData.id),
  });

  // This function cascades the response option to the next time intervals if it is lower than the currently selected value. If it
  // is higher than the currently selected value, then that value will cascade to the next time interval. In the case that they are
  // setting the value to null/empty string, then the nulled out value will cascade to the following time intervals. This is to
  // prevent the user from selecting a response option that is lower than the previous time intervals selection response option.
  const handleChangeCascade = (value: any, index: number) => {
    const selectedTimeInterval = timeIntervals[index];
    const selectedValueName = `${selectedTimeInterval.id}.${fieldName}`;

    // Always apply change to the selected interval
    setFormValue(selectedValueName, value);
    handleChange(
      {
        target: {
          id: selectedTimeInterval.id,
          name: fieldName,
          value,
        },
      },
      null
    );

    setObjValues((prev) => {
      return { ...prev, [selectedValueName]: value };
    });

    // Handle empty value: reset all following values
    if (value === "" || value == null) {
      for (let i = index + 1; i < timeIntervals.length; i++) {
        const timeInterval = timeIntervals[i];
        const valueName = `${timeInterval.id}.${fieldName}`;
        setFormValue(valueName, "");

        setObjValues((prev) => {
          return { ...prev, [valueName]: "" };
        });

        handleChange(
          {
            target: {
              id: timeInterval.id,
              name: fieldName,
              value: "",
            },
          },
          null
        );
      }
      return;
    }

    // Normal cascade for valid (non-empty) values
    const selectedOption = responseOptions.find((option) => option.id === value);
    const selectedOrder = selectedOption?.EA_SA_intDisplayOrder;
    if (!selectedOrder) return;

    for (let i = index + 1; i < timeIntervals.length; i++) {
      const timeInterval = timeIntervals[i];
      const valueName = `${timeInterval.id}.${fieldName}`;
      const currentValue = getFormValues(valueName);

      const currentOption = responseOptions.find((option) => option.id === currentValue);
      const currentOrder = currentOption?.EA_SA_intDisplayOrder;

      if (!currentOrder || selectedOrder > currentOrder) {
        setFormValue(valueName, value);

        setObjValues((prev) => {
          return { ...prev, [valueName]: value };
        });

        handleChange(
          {
            target: {
              id: timeInterval.id,
              name: fieldName,
              value,
            },
          },
          null
        );
      }
    }
  };

  useEffect(() => {
    if (timeIntervals && timeIntervals.length > 0) {
      const obj: any = {};
      timeIntervals.forEach((timeInterval: any) => {
        const backendValue = timeInterval[fieldName!];
        const updatedValue = getFormValues(`${timeInterval.id}.${fieldName}`);

        if (updatedValue || updatedValue === "") {
          obj[`${timeInterval.id}.${fieldName}`] = updatedValue;
        } else if (backendValue) {
          obj[`${timeInterval.id}.${fieldName}`] = backendValue;
        } else {
          obj[`${timeInterval.id}.${fieldName}`] = "";
        }
      });
      setObjValues(obj);
    }
  }, [timeIntervals]);

  if (timeIntervalsPending) return <Loading type="none" />;

  if (mode === "view") {
    return (
      <>
        <Box sx={{ marginTop: 2, display: "block" }}>
          <InputLabel>
            {timeIntervals.length > 0 ? (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#1B2327",
                  paddingBottom: "4px",
                  display: "inline !important",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
                component="span"
                dangerouslySetInnerHTML={{
                  __html: getQuestionHTML(timeIntervals[0].EA_SA_rfQuestion, required),
                }}
              />
            ) : null}
          </InputLabel>

          <TableContainer component={Paper} sx={{ border: "1px solid rgba(0, 0, 0, 0.65)", width: "inherit" }}>
            <Table sx={{ width: "100%" }} size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#9cc1ff33",
                    "& th": { fontSize: "1.25rem" },
                  }}
                >
                  <TableCell style={{ width: "25%" }}>Time Interval</TableCell>
                  <TableCell style={{ width: "75%" }}>Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeIntervals.length > 0 &&
                  timeIntervals.map((timeInterval: any) => {
                    const backendValue = timeInterval[fieldName!];
                    return (
                      <TableRow key={timeInterval.id}>
                        <TableCell>{showTimeInterval(timeInterval)}</TableCell>
                        <TableCell>
                          <ViewOnlyText label={null} value={getNameValue(responseOptions, backendValue)} responseOptions={responseOptions} responseFormat="SSP" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
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
            {timeIntervals.length > 0 ? (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#1B2327",
                  paddingBottom: "4px",
                }}
              >
                {setInnerHTML(timeIntervals[0].EA_SA_rfQuestion)}
              </Typography>
            ) : null}
          </InputLabel>

          <TableContainer component={Paper} sx={{ border: "1px solid rgba(0, 0, 0, 0.75)", width: "inherit" }}>
            <Table sx={{ width: "100%" }} size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#9cc1ff33",
                    "& th": { fontSize: "1.25rem" },
                  }}
                >
                  <TableCell style={{ width: "20%" }}>Time Interval</TableCell>
                  <TableCell style={{ width: "80%" }}>Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeIntervals.length > 0 &&
                  timeIntervals.map((timeInterval: any, index: number) => {
                    const timeIntervalRequired = isQuestionRequired(timeInterval.EA_SA_rfRequiredQuestion);
                    let backendValue = timeInterval[fieldName!];

                    if (!backendValue) {
                      backendValue = "";
                    }

                    return (
                      <TableRow key={timeInterval.id}>
                        <TableCell>{showTimeInterval(timeInterval)}</TableCell>
                        <TableCell>
                          <Controller
                            control={control}
                            defaultValue={backendValue}
                            name={`${timeInterval.id}.${fieldName}`}
                            rules={{ required: timeIntervalRequired }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => {
                              return (
                                <Select
                                  displayEmpty
                                  size="small"
                                  error={!!error}
                                  id={timeInterval.id}
                                  labelId={`time-interval-${timeInterval.id}`}
                                  MenuProps={{ sx: menuStyles }}
                                  onChange={(event) => {
                                    onChange(event);

                                    if (assessmentType?.EA_SA_cbEnableAutofill) {
                                      handleChangeCascade(event.target.value, index);
                                    } else {
                                      const eventObj = {
                                        target: {
                                          id: timeInterval.id,
                                          name: fieldName,
                                          value: event.target.value,
                                        },
                                      };

                                      setObjValues((prev) => {
                                        return { ...prev, [`${timeInterval.id}.${fieldName}`]: event.target.value };
                                      });

                                      handleChange(eventObj, null);
                                    }
                                  }}
                                  onOpen={() => setMenuOpen({ ...menuOpen, [timeInterval.id]: true })}
                                  onClose={() => setMenuOpen({ ...menuOpen, [timeInterval.id]: false })}
                                  required={timeIntervalRequired}
                                  sx={styles}
                                  value={objValues[`${timeInterval.id}.${fieldName}`] || ""}
                                >
                                  <MenuItem aria-label="" value="">
                                    <em>Select impact</em>
                                  </MenuItem>
                                  {responseOptions.length > 0 &&
                                    responseOptions.map((responseOption: any, respOptIndex: number) => {
                                      const valueName = `${timeInterval.id}.${fieldName}`;
                                      const timeIntervalValue = getFormValues(valueName);
                                      let timeIntervalValueDisplayOrder = responseOptions.find((option) => option.id === timeIntervalValue)?.EA_SA_intDisplayOrder;

                                      const responseOptionValueDisplayOrder = responseOption?.EA_SA_intDisplayOrder;

                                      let disabled = false;

                                      if (responseOptionValueDisplayOrder < timeIntervalValueDisplayOrder) {
                                        disabled = true;
                                      }

                                      //  If the user selects a response, and then nulls it out, all the values become selectable again. This logic is to
                                      // keep track of the highest selected value and disable any response options that are lower than that value.

                                      let highestVal = 0;
                                      let counter = 0;
                                      // Find the index of the current time interval
                                      const index = timeIntervals.findIndex((item) => item.id === timeInterval.id);

                                      // Only loop through the time intervals before the current one, and find the highest value time interval. This
                                      // is to prevent the user from selecting a response option that is lower than the highest selected value..
                                      while (counter < index) {
                                        const timeInterval = timeIntervals[counter];
                                        const timeIntervalValue = getFormValues(`${timeInterval.id}.${fieldName}`);
                                        const foundNum = responseOptions.find((option) => option.id === timeIntervalValue)?.EA_SA_intDisplayOrder;
                                        if (foundNum > highestVal) highestVal = foundNum;
                                        counter++;
                                      }

                                      if (highestVal > responseOptionValueDisplayOrder) {
                                        disabled = true;
                                      }

                                      const shouldDisable = disabled && assessmentType?.EA_SA_cbEnableValidation && !isAdmin;

                                      if (shouldDisable) {
                                        return (
                                          <MenuItem key={responseOption.id} value={responseOption.id} disabled={shouldDisable}>
                                            <Tooltip
                                              disableHoverListener={!menuOpen[timeInterval.id]}
                                              title={
                                                <Typography sx={{ fontSize: "1rem" }}>
                                                  Disabled options prevent the selection of lower severity ratings over time — the impact can remain the same or worsen, but not
                                                  improve.
                                                </Typography>
                                              }
                                              placement="top"
                                            >
                                              <span
                                                style={{
                                                  pointerEvents: shouldDisable ? "none" : "auto", // ✅ disables clicks inside but not outside
                                                  display: "flex",
                                                  width: "100%",
                                                  color: "rgba(0,0,0,0.38)", // mimic disabled text
                                                }}
                                              >
                                                <Typography sx={{ display: "flex", alignItems: "center", gap: "8px", fontSize: 14 }}>
                                                  <Chip
                                                    label=""
                                                    size="small"
                                                    sx={{ ...chipStyles, backgroundColor: responseOption.EA_SA_txtLabelColor || chipStyles.backgroundColor }}
                                                  />
                                                  {responseOption.name}
                                                </Typography>
                                              </span>
                                            </Tooltip>
                                          </MenuItem>
                                        );
                                      }

                                      return (
                                        <MenuItem key={responseOption.id} value={responseOption.id}>
                                          <Typography sx={{ display: "flex", alignItems: "center", gap: "8px", fontSize: 14 }}>
                                            <Chip label="" size="small" sx={{ ...chipStyles, backgroundColor: responseOption.EA_SA_txtLabelColor || chipStyles.backgroundColor }} />
                                            {responseOption.name}
                                          </Typography>
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              );
                            }}
                          />
                        </TableCell>
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

const styles = {
  width: "100%",
  "& fieldset": { borderWidth: "0px" },
  "& .rbs-validationMsg": {
    display: "none !important",
  },
  borderRadius: "4px",
  "& .MuiSelect-select": {
    paddingRight: "12px",
    paddingLeft: "12px",
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  ".MuiOutlinedInput-notchedOutline": {
    border: "1px solid #CFD8DC",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #0042B6",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #0042B6",
  },
  ".MuiSvgIcon-root": {
    fill: "#1B2327 !important",
    borderLeft: "1px solid #CFD8DC",
    paddingLeft: "4px",
  },
  "&:hover .MuiSvgIcon-root": {
    fill: "#1B2327 !important",
    borderLeft: "1px solid #0042B6",
    paddingLeft: "4px",
  },
  "&.Mui-focused .MuiSvgIcon-root": {
    fill: "#1B2327 !important",
    borderLeft: "1px solid #0042B6",
    paddingLeft: "4px",
    transform: "rotateX(180deg)",
  },
};

const menuStyles = {
  ".MuiMenu-root": {},
  ".MuiMenu-paper": {
    marginTop: "4px",
    border: "1px solid #0042B6",
    borderRadius: "2px 0px 0px 2px",
  },
  ".MuiMenu-list": {
    padding: "0px",
  },
  "& .rbs-validationMsg": {
    display: "none !important",
  },
};

const chipStyles = {
  backgroundColor: "#000", // Default color
  width: "14px",
  height: "14px",
  borderRadius: "2px",
  border: "1px solid rgba(0, 0, 0, 0.60)",
};
