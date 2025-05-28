import { RecordInfo } from "./ObjectTypes";

export interface FormInputProps {
  fieldName?: string;
  appParams: RecordInfo;
  assessmentQuestion: any;
  control?: any;
  getFormValues?: any;
  hasLabel?: boolean;
  handleChange: (event, dataObj) => void;
  isValid?: any;
  questionTemplateData?: any;
  questionUpdates?: any;
  responseOptions?: any;
  setFormValue?: (name, value) => void;
  scope?: string;
}
