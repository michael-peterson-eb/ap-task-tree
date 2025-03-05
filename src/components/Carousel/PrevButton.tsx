import { Button } from "@mui/material";

const PrevButton = ({ handleClickPrev, canScrollLeft }) => {
  return (
    <Button
      sx={{
        position: "relative",
        bottom: "50px",
        left: "20px",
        minWidth: "32px",
        width: "32px",
        height: "32px",
        backgroundColor: "#2737D2",
        borderRadius: "100%",
        padding: "8px",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transform: "rotate(180deg)",
        display: "flex",
        opacity: canScrollLeft ? "1" : "0",
        visibility: canScrollLeft ? "visible" : "hidden",
        transition: "all 0.3s",
        "&:hover": {
          backgroundColor: "#2737D2",
        },
        "&:focus": {
          outline: "none",
          boxShadow: "none",
        },
      }}
      onClick={handleClickPrev}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
      >
        <path
          d="M5.60211 11.0646L6.19669 11.6592C6.44844 11.9109 6.85554 11.9109 7.10462 11.6592L12.3112 6.45529C12.5629 6.20354 12.5629 5.79644 12.3112 5.54736L7.10462 0.340796C6.85286 0.0890381 6.44577 0.0890381 6.19669 0.340796L5.60211 0.935372C5.34767 1.18981 5.35303 1.60494 5.61282 1.85402L8.84014 4.92868H1.14279C0.786575 4.92868 0.5 5.21525 0.5 5.57146V6.42851C0.5 6.78472 0.786575 7.0713 1.14279 7.0713H8.84014L5.61282 10.146C5.35035 10.395 5.345 10.8102 5.60211 11.0646Z"
          fill="white"
        />
      </svg>
    </Button>
  );
};

export default PrevButton;
