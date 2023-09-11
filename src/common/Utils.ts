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
  if (!id) return "No Answer";
  const found = options.find((opt: any) => opt.id == id);
  return found.name;
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
  const mon = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${year}-${mon}-${day}`;
};
