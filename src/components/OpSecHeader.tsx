import { useMediaQuery } from "@mui/material";
import Carousel from "./Carousel/Carousel";
import { CarouselDropdown } from "./Carousel/CarouselDropdown";

export const OpSecHeader = ({ operationSections, selectedOpsSec, setSelectedOpsSection, mode }) => {
  const smallScreen: boolean = useMediaQuery("(max-width:640px)");

  const handleTabClick = (index: number) => {
    setSelectedOpsSection(index);
  };

  return !smallScreen ? (
    <Carousel operationSections={operationSections} selectedOpsSec={selectedOpsSec} handleTabClick={handleTabClick} mode={mode} />
  ) : (
    <CarouselDropdown operationSections={operationSections} selectedOpsSec={selectedOpsSec} handleTabClick={handleTabClick} />
  );
};
