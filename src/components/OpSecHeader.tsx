import { useMediaQuery } from "@mui/material";
import Carousel from "./Carousel/Carousel";
import { CarouselDropdown } from "./Carousel/CarouselDropdown";

export const OpSecHeader = ({ operationSections, selectedOpsSec, setSelectedOpsSection }) => {
  const smallScreen: boolean = useMediaQuery("(max-width:640px)");

  const handleTabClick = (index: number) => {
    setSelectedOpsSection(index);
  };

  return !smallScreen ? (
    <Carousel operationSections={operationSections} selectedOpsSec={selectedOpsSec} handleTabClick={handleTabClick} />
  ) : (
    <CarouselDropdown operationSections={operationSections} selectedOpsSec={selectedOpsSec} handleTabClick={handleTabClick} />
  );
};
