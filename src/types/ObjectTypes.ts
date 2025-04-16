export type RecordInfo = {
  id: string;
  crudAction: string;
  objectIntegrationName: string;
  questionRelName: string;
  sectionStatusesJSON: any;
  objectTitle: string;
  triggerId: string;
  sectionType: string;
};

export type ChangeObj = {
  responseFormat: string;
  riskObj?: {
    EA_SA_txtAssmtRespOptCode: string;
    EA_SA_txtFieldIntegrationName: string;
  };
  scope: string;
};
