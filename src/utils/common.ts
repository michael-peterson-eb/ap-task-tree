import { RecordInfo } from "../types/ObjectTypes";

export const getNameValue = (options: any, id: any) => {
  if (!id || options.length == 0) return "No Answer";

  const found = options.find((opt: any) => opt.id == id);
  return found == undefined ? "**" : found.name;
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

export const isValidDate = (dateString) => {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
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

export const executeTriggers = async (appParams: RecordInfo) => {
  // no trigger is called for Scenario Test
  if (appParams.triggerId === "" || appParams.triggerId == "null") return;

  // update should invoke the trigger [UPDATE] Calculate Assessment Time Intervals or an array of triggers
  const triggers = appParams.triggerId.split(",");

  if (appParams.objectTitle == "Incident Assessment") {
    //@ts-ignore
    await rbf_runTrigger(appParams.objectIntegrationName, appParams.id, triggers[0]);
  } else if (appParams.objectTitle == "Scenario Test") {
    //placeholder for future Scenario Test trigger
  } else if (appParams.objectTitle != "Standalone Assessment") {
    triggers.forEach(async (triggerId: any) => {
      //@ts-ignore
      await rbf_runTrigger(appParams.objectIntegrationName, appParams.id, triggerId);
    });
  }
};
