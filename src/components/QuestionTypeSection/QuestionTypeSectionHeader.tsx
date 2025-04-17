import { Box, Alert, AlertTitle } from "@mui/material";
const QuestionTypeSectionHeader = ({ mode = "view", status, objectTitle, questionName }) => {
  const isTypeCompleted = status === "completed" ? true : false;

  return (
    <>
      <Box>
        <span style={{ fontSize: "18px", fontWeight: "bold", fontStyle: "normal" }}>
          {process.env.NODE_ENV === "development" ? `Mocked section: ${questionName}` : questionName}
        </span>
      </Box>
      <Box sx={{ margin: "auto", overflow: "auto" }}>
        {mode === "view" && !isTypeCompleted && (
          <Alert sx={{ marginTop: "12px" }} severity="warning">
            <AlertTitle>{`${questionName} ${objectTitle} is in progress!`}</AlertTitle>
          </Alert>
        )}
        {mode === "view" && isTypeCompleted && (
          <Alert sx={{ marginTop: "12px" }} severity="success">
            <AlertTitle>{`${questionName} ${objectTitle} is complete!`}</AlertTitle>
          </Alert>
        )}
      </Box>
    </>
  );
};

export default QuestionTypeSectionHeader;
