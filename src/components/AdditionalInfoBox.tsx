import { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useData } from "../contexts/DataContext";
import { useGlobal } from "../contexts/GlobalContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { setInnerHTML } from "../utils/cleanup";

const AdditionalInfoBox = ({ smallScreen }) => {
  const { operationSections } = useData();
  const { selectedOpsSection } = useGlobal();
  const additionalInformation = operationSections[selectedOpsSection].EA_SA_txtaAdditionalInformation;
  const [isExpanded, setIsExpanded] = useState(false);

  if (!additionalInformation || additionalInformation === "") return null;

  return (
    <Box
      sx={{ width: smallScreen ? "100%" : 350, borderRadius: "4px 4px 0px 0px", border: "1px solid #CFD8DC", height: "min-content" }}
      position={"sticky"}
      top={350}
      zIndex={1000}
      bgcolor={"#f9f9f9"}
    >
      <Accordion expanded={isExpanded} onChange={() => setIsExpanded(!isExpanded)} sx={{ backgroundColor: "#f9f9f9" }}>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />} sx={{ borderBottom: "1px solid #CFD8DC" }}>
          <Typography fontSize={smallScreen ? 12 : 14} fontStyle="normal" fontWeight={700} lineHeight="22px" color="#1B2327">
            Additional Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{setInnerHTML(additionalInformation)}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AdditionalInfoBox;
