import DOMPurify from "dompurify";

export const cleanLabel = (htmlLabel) => {
  return DOMPurify.sanitize(htmlLabel, {
    USE_PROFILES: { html: true },
  });
};

export const setInnerHTML = (text) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: cleanLabel(text),
      }}
    />
  );
};
