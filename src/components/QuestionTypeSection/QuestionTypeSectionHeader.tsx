import { Box, Alert, AlertTitle } from "@mui/material";
const QuestionTypeSectionHeader = ({ questionName }) => {
  return (
    <>
      <Box>
        <span style={{ fontSize: "18px", fontWeight: "bold", fontStyle: "normal" }}>
          {process.env.NODE_ENV === "development" ? `Mocked section: ${questionName}` : questionName}
        </span>
      </Box>
    </>
  );
};

export default QuestionTypeSectionHeader;
