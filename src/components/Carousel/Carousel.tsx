import { useState, useRef } from "react";
import { ImageList, Box } from "@mui/material";
import { Card } from "./Card";
import NextButton from "./NextButton";
import PrevButton from "./PrevButton";

export default function Carousel({ operationSections, selectedOpsSec, handleTabClick }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const setScrollingArrows = (elem) => {
    if (elem && elem.children.length > 0) {
      // const bounds = elem.getBoundingClientRect();
      const children = elem.children;
      const startChild = children[0];
      const endChild = children[children.length - 1];

      const startObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.intersectionRatio === 1) {
            setCanScrollLeft(false);
          } else {
            setCanScrollLeft(true);
          }
        },
        {
          root: elem,
          rootMargin: "0px",
          threshold: 1,
        }
      );

      const endObserver = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.intersectionRatio > 0.99) {
            setCanScrollRight(false);
          } else {
            setCanScrollRight(true);
          }
        },
        {
          root: elem,
          rootMargin: "0px",
          threshold: 1,
        }
      );

      startObserver.observe(startChild);
      endObserver.observe(endChild);
    }
  };

  const scrollLeft = () => {
    if (rootRef.current !== null) {
      const bounds = rootRef.current.getBoundingClientRect();
      const children = rootRef.current.children;
      let farthestLeft = 0;

      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        const childBounds = child.getBoundingClientRect();

        if (childBounds.left <= bounds.left - 8) {
          farthestLeft = i;
          break;
        }
      }

      if (farthestLeft === -1) {
        return;
      } else {
        children[farthestLeft].scrollIntoView({ behavior: "smooth", block: "nearest" });
        setScrollingArrows(rootRef.current);
      }
    }
  };

  const scrollRight = () => {
    if (rootRef.current !== null) {
      const bounds = rootRef.current.getBoundingClientRect();
      const children = rootRef.current.children;
      let farthestRight = children.length - 1;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childBounds = child.getBoundingClientRect();

        if (childBounds.right >= bounds.right + 8) {
          farthestRight = i;
          break;
        }
      }

      if (farthestRight > children.length - 1 || farthestRight === 0) {
        return;
      } else {
        children[farthestRight].scrollIntoView({ behavior: "smooth", block: "nearest" });
        setScrollingArrows(rootRef.current);
      }
    }
  };

  const setEdgeMask = () => {
    if (canScrollLeft && canScrollRight) {
      return "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)";
    } else if (canScrollRight) {
      return "linear-gradient(to right, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)";
    } else if (canScrollLeft) {
      return "linear-gradient(to left, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)";
    }
    return "none";
  };

  return (
    <Box sx={{ maxHeight: "46px", marginBottom: "36px" }}>
      <ImageList
        ref={(element) => {
          //@ts-expect-error
          rootRef.current = element;
          setScrollingArrows(element);
        }}
        sx={{
          gridAutoFlow: "column",
          gridTemplateColumns: "205px !important",
          gridAutoColumns: "205px",
          overflow: "hidden",
          gap: "8px !important",
          maskImage: setEdgeMask(),
          animation: "clip-fade 3s infinite alternate",
        }}
      >
        {operationSections.map((type, index) => (
          <Card key={type.id} type={type} selectedOpsSec={selectedOpsSec} index={index} handleTabClick={handleTabClick} />
        ))}
      </ImageList>
      <PrevButton handleClickPrev={scrollLeft} canScrollLeft={canScrollLeft} />
      <NextButton handleClickNext={scrollRight} canScrollRight={canScrollRight} />
    </Box>
  );
}
