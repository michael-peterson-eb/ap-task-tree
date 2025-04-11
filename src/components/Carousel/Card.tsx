import { ImageListItem, Typography, Box } from "@mui/material";
import Check from "./Check";
import Circle from "./Circle";
import Dotdotdot from "react-dotdotdot";

export const Card = ({ type, selectedOpsSec, index, handleTabClick }) => {
  const cardColor = type.status === "completed" ? "#36A902" : "#DEE9FF";
  const isSelected = selectedOpsSec === index;

  const icon = type.status === "completed" ? <Check /> : <Circle color={type.status === "completed" || isSelected ? "white" : "#1B2327"} />;

  return (
    <ImageListItem key={type.id} sx={{ cursor: "pointer" }} onClick={() => handleTabClick(index)}>
      <Box
        sx={{
          background: isSelected ? "#0042B6" : cardColor,
          display: "flex",
          boxSizing: "border-box",
          width: "205px",
          height: "46px",
          padding: "12px",
          borderRadius: "4px",
          position: "relative",
          alignItems: "center",
        }}
      >
        <Box sx={{ position: "absolute", left: "8px" }}>{icon}</Box>
        <Dotdotdot clamp={2}>
          <Typography
            sx={{
              ml: "18px",
            }}
            fontSize={12}
            fontWeight={600}
            fontStyle="normal"
            lineHeight="normal"
            color={isSelected || type.status === "completed" ? "white" : "#1B2327"}
          >
            {type.name}
          </Typography>
        </Dotdotdot>
      </Box>
    </ImageListItem>
  );
};
