import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootId = document.getElementById('jsroot') as HTMLElement;

const root = ReactDOM.createRoot(rootId);

const dataRecord = rootId.getAttribute("data-record");
const recordArr = dataRecord?.split("::");

const parseStatus = (strStatus: any) => {
  if (typeof strStatus !== "string") return {};

  try {
      const jObj = JSON.parse(strStatus);
      if ( typeof jObj === "string" ) return {};
      return jObj;
  } catch (error) {
      return {};
  }
}

const recordInfo = {
  id: (recordArr[0] || ''),
  crudAction: (recordArr[1] || 'view'),
  objectIntegrationName: recordArr[2] || '',
  questionRelName: recordArr[3] || '',
  sectionStatusesJSON: parseStatus(recordArr[4]), // != "" ? JSON.parse(recordArr[4]) : {},
}

console.log("--index--", recordArr, recordInfo)

root.render(<App recordInfo={recordInfo}/>);

