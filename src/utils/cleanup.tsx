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

export const getQuestionHTML = (html, required = false) => {
  const sanitized = cleanLabel(html).replace(/<\/?(div|p|br)[^>]*>/g, " "); // Replace block-level tags
  return required ? `${sanitized}<span style="color:red;">&nbsp;*</span>` : sanitized;
};
