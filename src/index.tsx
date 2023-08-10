import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const parseStatus = (strStatus: any) => {
  if (typeof strStatus !== "string") return {};

  try {
    const jObj = JSON.parse(strStatus);
    if (typeof jObj === "string") return {};
    return jObj;
  } catch (error) {
    console.log("Error parsing :", error)
    return {};
  }
}

const paramId = document.getElementById('rjs-params') as HTMLElement;
const dataRecord = paramId.getAttribute("data-record");
const recordArr = dataRecord?.split("::");

const recordInfo = {
  id: (recordArr[0] || ''),
  crudAction: (recordArr[1] || 'view'),
  objectIntegrationName: recordArr[2] || '',
  questionRelName: recordArr[3] || '',
  sectionStatusesJSON: parseStatus(recordArr[4]),
}

const rootId = document.getElementById(`${recordInfo.crudAction}-jsroot`) as HTMLElement;
const root = ReactDOM.createRoot(rootId);

root.render(<App recordInfo={recordInfo} />);