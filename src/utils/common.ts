export const getNameValue = (options: any, id: any) => {
  if (!id || options.length == 0) return "No Answer";

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

export const getDefaultMultiValue = (backendValue: string, responseOptions: any) => {
  const split = backendValue?.split(",");
  const defaultValues = [];

  if (split && split.length > 0) {
    split.forEach((value) => {
      const foundValue = responseOptions?.find((opt) => opt.id == value);
      if (foundValue) {
        //@ts-ignore
        defaultValues.push(foundValue);
      }
    });
  }

  return defaultValues;
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

export const isQuestionRequired = (flag: any) => flag == 1;

export const getRequiredColor = (isChecked: any) => {
  return isQuestionRequired(isChecked) ? "#d32f2f" : "#000";
};

export const lookupFV = (aqId: any, objectToSearch: any) => {
  if (aqId === null) return null;
  const touchedFields: any = objectToSearch;
  if (touchedFields[aqId]) {
    return touchedFields[aqId].value;
  } else {
    return null;
  }
};

export const isValidDate = (dateString) => {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
};

export const getDefaultValue = ({
  objToCheck,
  idToMatch,
  backendValue,
  fallbackValue = "",
}: {
  objToCheck: any;
  idToMatch: any;
  backendValue: any;
  fallbackValue?: string | null | any[];
}) => {
  if (objToCheck[idToMatch]) {
    const defaultValue = objToCheck[idToMatch].value;
    return defaultValue;
  }

  if (backendValue) {
    return backendValue;
  }

  return fallbackValue;
};

export const validateAllObjFields = (obj: any) => {
  const keys = Object.keys(obj);
  let isValid = true;
  keys.forEach((key) => {
    if (obj[key] == null || obj[key] == "") {
      isValid = false;
    }
  });
  return isValid;
};

export const periodInScopeHas = (inScope: any, periodScope: string) => {
  return inScope.indexOf(periodScope) >= 0;
};

export const isDateInFuture = (date) => {
  const inputDate = new Date(date);

  // Get the current date
  const currentDate = new Date();

  // Compare the input date with the current date
  if (inputDate < currentDate) {
    return false;
  } else {
    return true;
  }
};

export const bothInScopeWidth = "40";
export const oneInScopeWidth = "80";
