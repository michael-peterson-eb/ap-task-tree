import { useState } from "react";
import { createPopupClient } from "./rpc/popupClient";

const PLATFORM_URL = "https://eapps-test.eng.infiniteblue.com/prod3/m/main.jsp?pageId=7948945&id=418628738";
const PLATFORM_ORIGIN = "https://eapps-test.eng.infiniteblue.com";

export const rpc = createPopupClient(PLATFORM_URL, {
  targetOrigin: PLATFORM_ORIGIN,
  autoAttach: true, // reattach after HMR
});

export default function App() {
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleConnect = () => {
    try {
      rpc.connectFromClick(); // MUST run inside this click to avoid popup blocker
      setErr(null);
    } catch (e: any) {
      setErr(String(e?.message || e));
    }
  };

  const runSelectQuery = async () => {
    setErr(null);
    setResult(null);
    try {
      const res = await rpc.call(
        "_RB.selectQuery",
        ["id", "name", "status#code", "EA_SA_txtCode", "EA_SA_rsAssessmentQuestionType", "EA_SA_rsAssessmentQuestions", "EA_SA_txtaAdditionalInformation"],
        "EA_SA_OperationsSection",
        "",
        100,
        true
      );
      setResult(res);
      console.log("selectQuery ->", res);
    } catch (e: any) {
      setErr(String(e?.message || e));
      console.error("selectQuery error", e);
    }
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1.5rem",
        borderRadius: "12px",
        background: "linear-gradient(145deg, #1e1e2f, #25253c)",
        color: "#f4f4f5",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>🔌 LCAP RPC Debugger</h2>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={handleConnect}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            border: "none",
            borderRadius: "8px",
            background: "linear-gradient(90deg, #29CDAF, #22c55e)",
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(41,205,175,0.3)",
            transition: "transform 0.15s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Connect to Platform
        </button>

        <button
          onClick={runSelectQuery}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            border: "none",
            borderRadius: "8px",
            background: "linear-gradient(90deg, #f97316, #f87171)",
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(249,115,22,0.3)",
            transition: "transform 0.15s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Run _RB.selectQuery
        </button>
      </div>

      {err && (
        <div
          style={{
            background: "#3f1d1d",
            border: "1px solid #f87171",
            padding: "0.75rem",
            borderRadius: "8px",
            color: "#f87171",
            fontSize: "0.9rem",
            whiteSpace: "pre-wrap",
          }}
        >
          ❌ {err}
        </div>
      )}

      {result && (
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            padding: "0.75rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            overflowX: "auto",
            maxHeight: "300px",
          }}
        >
          <pre style={{ margin: 0, color: "#e2e8f0" }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
