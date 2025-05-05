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

  let count = 0;

  const styleInterval = setInterval(() => {
    const viewModeParentContainer = window.document.getElementsByClassName("k-content k-state-active")[0] as HTMLElement;
    /** Set overflow to visible of one of the parent containers. This is necessary for the carousel to be sticky. The container style
     * we want to modify is not in the react application itself, it is in a parent container, so we need to access it via the DOM.
     * The interval is necessary to allow the view mode container to be rendered. This is preferential to timeout as we don't know
     * how long the view mode container will take to render.This is an ugly but necessary workaround. Count is used to prevent the
     * interval from running indefinitely.
     * */

    if (viewModeParentContainer && viewModeParentContainer.style) {
      viewModeParentContainer.style.overflow = "visible";
      viewModeParentContainer.classList.add("overflow-fix");
    }

    if (count > 5) {
      if (viewModeParentContainer.style.overflow === "visible" || count > 20) {
        clearInterval(styleInterval);
      }
    }
  }, 500);
}

const rootId = document.getElementById(`${recordInfo?.crudAction || "view"}-jsroot`) as HTMLElement;

const root = ReactDOM.createRoot(rootId);

root.render(<App recordInfo={recordInfo} />);
