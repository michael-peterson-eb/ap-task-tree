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

export type RiskObj = {
  EA_SA_txtAssmtRespOptCode: string;
  EA_SA_txtFieldIntegrationName: string;
};

export type EventObj = {
  target: {
    id: string;
    name: string;
    value: string;
  };
};
