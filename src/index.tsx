import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootId = document.getElementById('jsroot') as HTMLElement;

const root = ReactDOM.createRoot(rootId);

const dataRecord = rootId.getAttribute("data-record");
const recordArr = dataRecord?.split("::");


const recordInfo = {
  id: (recordArr[0] || ''),
  crudAction: (recordArr[1] || 'view'),
  objectIntegrationName: recordArr[2] || '',
  questionRelName: recordArr[3] || '',
  sectionStatusesJSON: recordArr[4] != "" ? JSON.parse(recordArr[4]) : {},
}

console.log("--index--", recordArr, recordInfo)
root.render(
  <React.StrictMode>
    <App recordInfo={recordInfo}/>
  </React.StrictMode>
);

