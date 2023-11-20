import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const paramId = document.getElementById('rjs-params') as HTMLElement;
const dataRecord = paramId.getAttribute("data-record");
const recordArr = dataRecord?.split("::");

const recordInfo = {
  id: (recordArr[0] || ''),
  crudAction: (recordArr[1] || 'view'),
  objectIntegrationName: recordArr[2] || '',
  questionRelName: recordArr[3] || '',
  objectTitle: recordArr[4] || 'Impact Assessment',
  triggerId: recordArr[5] || 'nnull',
}
//console.log("--recordInfo--", recordInfo)
const rootId = document.getElementById(`${recordInfo.crudAction}-jsroot`) as HTMLElement;
const root = ReactDOM.createRoot(rootId);

root.render(<App recordInfo={recordInfo} />);