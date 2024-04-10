import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const paramId = document.getElementById('ita-params') as HTMLElement;
const dataRecord = paramId.getAttribute("data-record");
const recordArr:any = dataRecord?.split("::");

const recordInfo = {
  id: (recordArr[0] || ''),
  crudAction: (recordArr[1] || 'view'),
  objectIntegrationName: recordArr[2] || '',
  questionRelName: recordArr[3] || '',
  objectTitle: recordArr[4] || 'Impact Assessment',
  triggerId: recordArr[5] || 'null',
  sectionType: recordArr[6] || 'EA_SA_ImpactTolerance',
}

const rootId = document.getElementById(`${recordInfo.crudAction}-ita-root`) as HTMLElement;
const root = ReactDOM.createRoot(rootId);

root.render(<App recordInfo={recordInfo} />);