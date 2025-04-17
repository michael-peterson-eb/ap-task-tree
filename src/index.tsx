import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { mockParams } from "./data/mockParams";

let recordInfo;

if (process.env.NODE_ENV === "development") {
  recordInfo = mockParams;
} else {
  const el: any = document.querySelector(".react-script");
  const dataParams = el.parentElement.dataset.params;

  const paramId = document.getElementById(dataParams) as HTMLElement;

  const dataRecord = paramId.getAttribute("data-record");
  const recordArr: any = dataRecord?.split("::");

  recordInfo = {
    id: recordArr[0] || "",
    crudAction: recordArr[1] || "view",
    objectIntegrationName: recordArr[2] || "",
    questionRelName: recordArr[3] || "",
    objectTitle: recordArr[4] || "Impact Assessment",
    triggerId: recordArr[5] || "null",
    sectionType: recordArr[6] || "EA_SA_Impact",
    assessmentType: recordArr[7] || null,
  };
}

const rootId = document.getElementById(`${recordInfo?.crudAction || "view"}-jsroot`) as HTMLElement;

const root = ReactDOM.createRoot(rootId);

root.render(<App recordInfo={recordInfo} />);