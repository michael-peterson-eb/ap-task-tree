import React from "react";
import { useMediaQuery } from "@mui/material";
import Carousel from "./Carousel/Carousel";
import { CarouselDropdown } from "./Carousel/CarouselDropdown";

export const OpSecHeader = ({ operationSections, selectedOpsSec, setSelectedOpsSection }) => {
  const largeScreen: boolean = useMediaQuery("(min-width:1008px)");

  const handleTabClick = (index: number) => {
    setSelectedOpsSection(index);
  };

  return largeScreen ? (
    <Carousel operationSections={operationSections} selectedOpsSec={selectedOpsSec} handleTabClick={handleTabClick} />
  ) : (
    <CarouselDropdown operationSections={operationSections} selectedOpsSec={selectedOpsSec} handleTabClick={handleTabClick} />
  );
};
