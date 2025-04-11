import DOMPurify from "dompurify";
export const parseStatus = (strStatus: any) => {
  if (typeof strStatus !== "string") return {};

  try {
    const jObj = JSON.parse(strStatus);
    if (typeof jObj === "string") return {};
    return jObj;
  } catch (error) {
    console.log("Error parsing status :", error);
    return {};
  }
};

export const getNameValue = (options: any, id: any) => {
  if ( !id || options.length == 0 ) return "No Answer";

  const found = options.find((opt: any) => opt.id == id);
  return found == undefined ? "**" : found.name;
};

export const getValue = (lookup: any, aqId: any, initialValue: any) => {
  let responseValue = initialValue ? initialValue : "";
  const lookupValue = lookup(aqId);
  if (lookupValue || lookupValue == "") responseValue = lookupValue;
  return responseValue;
};

export const getArrayValue = (lookup: any, aqId: any, initialValue: any) => {
  let responseValue = initialValue && initialValue.length > 0 ? initialValue : [];
  const lookupValue = lookup(aqId);
  if (lookupValue && lookupValue.length >= 0) responseValue = lookupValue;
  return responseValue;
};

export const getMultiValue = (options: any, stored: string) => {
  if (stored == null || options.length == 0) return "No Answer";

  const matched = options.filter((opt: any) => {
    if (stored.indexOf(opt.id) >= 0) return opt.name;
  });

  const names: string[] = [];
  matched.forEach((m: any) => {
    names.push(m.name);
  });

  return names.join(", ");
};

export const initSelectValue = (record: any, resp: any) => {
  if (record.crudAction == "view" && (resp == null || resp == "")) {
    return "No Answer";
  } else {
    return resp;
  }
};

export const dateMMDDYYYYFormat = (stringDate: string) => {
  const date = new Date(stringDate);
  const mon = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${mon}/${day}/${year}`;
};

export const dateYYYYMMDDFormat = (stringDate: string) => {
  const date = new Date(stringDate);
  const mon = "00" + (date.getMonth() + 1);
  const day = "00" + date.getDate();
  const year = date.getFullYear();
  return `${year}-${mon.substr(-2)}-${day.substr(-2)}`;
};

export const removeHtmlElem = (text: string) => {
  const doc = new DOMParser().parseFromString(text, "text/html");
  const tagsToRemove = "input, img, div, strong, br, hr";
  //@ts-ignore
  for (const elm of doc.querySelectorAll("*")) {
    if (elm.matches(tagsToRemove)) {
      elm.remove();
    }
    for (const attrib of [...elm.attributes]) {
      elm.removeAttribute(attrib.name);
    }
  }
  return doc.body.innerHTML;
};

export const stripTextHtmlTags = (text: string) => {
  const noTags = text.replace(/(<([^>]+)>)/gi, "");
  return noTags.replace(/\&nbsp;/g, "");
};

export const appendQuestions = (addQs: any, aQuestions: any, fieldName: string) => {
  aQuestions.map((aq: any) => {
    addQs(aq.id, aq[fieldName]);
  });
};

export const getQuestionAnswer = (recordInfo: any, lookup: any, qAnswer: any, valueField: any) => {
  if (qAnswer && qAnswer.length > 0) {
    const aqId = qAnswer[0].id;
    const aqFieldValue = qAnswer[0][valueField];

    const lookupValue = lookup(aqId);

    let responseValue = aqFieldValue ? aqFieldValue : "";
    if (lookupValue || lookupValue == "") responseValue = lookupValue;

    const respValue = getValue(lookup, aqId, aqFieldValue);
    const newValue = initSelectValue(recordInfo, respValue);
    return [true, aqId, newValue];
  }
  return [false, null, null];
};

export const cleanLabel = (htmlLabel:string) => {
  return DOMPurify.sanitize(htmlLabel, {
    USE_PROFILES: { html: true },
  })
};

export const isQuestionRequired = (flag:any) => flag == 1;

export const getRequiredColor = (isChecked:any) => {
  return isQuestionRequired(isChecked) ? "#d32f2f" : "#000";
}

export const showLabel = (hasLabel:any, label: any) => {
  return hasLabel == undefined ? label : null;
};

export const fieldWithLabel = (withLabel:any) => withLabel == undefined;