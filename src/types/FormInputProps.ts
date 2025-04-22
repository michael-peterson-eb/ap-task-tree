import { RecordInfo } from "./ObjectTypes";

export interface FormInputProps {
  fieldName?: string;
  appParams: RecordInfo;
  assessmentQuestion: any;
  control?: any;
  hasLabel?: boolean;
  handleChange: (event, dataObj) => void;
  isValid?: any;
  questionTemplateData?: any;
  questionUpdates?: any;
  responseOptions?: any;
  scope?: string;
}