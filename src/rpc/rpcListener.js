/**
 * To call _RB functions from local host, set up a connection to the platform
 * in components like this:
 *
 * Put in the platform URL you want to connect to:
 * const PLATFORM_URL = "https://eapps-test.eng.infiniteblue.com/prod3/m/main.jsp?pageId=7948945&id=418628738";
 * 
 * Establish the RPC connection:
 * const rpc = createPopupClient(PLATFORM_URL);
 * 
 * 
 * One time call to connect to the platform. It will open in another tab. Once on the tab,
 * open the console and run the IIFE to connect to the platform.
 * 
 * 
 *  const handleConnect = () => {
    try {
      rpc.openFromClick(); // MUST run inside this click to avoid popup blocker
      setErr(null);
    } catch (e: any) {
      setErr(String(e?.message || e));
    }
  };
 *
 *
 */

(() => {
  const ROOT = "_RB";
  const TRUSTED_ORIGIN = "http://localhost:3000"; // your React dev app origin
  let sessionNonce = null; // set on HELLO

  // Resolve path "_RB.foo.bar" and return fn + correct base for `this`
  function getFnAndBase(rootObj, path) {
    const parts = path.split(".");
    let base = window[ROOT];
    let cur = base;
    for (let i = 1; i < parts.length; i++) {
      base = cur;
      cur = cur?.[parts[i]];
    }
    return { fn: cur, base };
  }

  window.addEventListener("message", async (evt) => {
    // strict origin check
    if (evt.origin !== TRUSTED_ORIGIN) return;

    const msg = evt.data;
    if (!msg) return;

    if (msg.type === "LCAP_HELLO" && typeof msg.nonce === "string") {
      sessionNonce = msg.nonce;

      evt.source?.postMessage(
        {
          type: "LCAP_READY",
          root: ROOT,
          rootPresent: !!window[ROOT],
          hasSelectQuery: !!window[ROOT]?.selectQuery,
          nonce: sessionNonce, // echo nonce back
        },
        TRUSTED_ORIGIN
      );
      console.log("[SERVER] HELLO -> READY", {
        rootPresent: !!window[ROOT],
        hasSelectQuery: !!window[ROOT]?.selectQuery,
        typeofSelectQuery: typeof window[ROOT]?.selectQuery,
        nonce: sessionNonce,
      });
      return;
    }

    if (msg.type !== "LCAP_RPC_CALL") {
      console.warn("[SERVER] drop: bad type", msg.type);
      return;
    }

    // nonce must match the session
    if (msg.nonce !== sessionNonce) {
      console.warn("[SERVER] drop: nonce mismatch", msg.nonce, "!=", sessionNonce);
      return;
    }

    const { id, name, args } = msg;
    try {
      if (!name || (!name.startsWith(`${ROOT}.`) && name !== ROOT)) {
        throw new Error(`RPC name must start with '${ROOT}.' (got '${name}')`);
      }
      if (!window[ROOT]) throw new Error(`${ROOT} not available yet`);

      const { fn, base } = getFnAndBase(window[ROOT], name);
      if (typeof fn !== "function") {
        throw new Error(`Not a function: ${name} (typeof: ${typeof fn})`);
      }

      console.log("[SERVER] CALL", name, "args:", args);
      const result = await Promise.resolve(fn.apply(base, args || []));
      console.log("[SERVER] RESULT", name, result);

      evt.source?.postMessage({ type: "LCAP_RPC_RESULT", id, ok: true, result, nonce: sessionNonce }, TRUSTED_ORIGIN);
    } catch (e) {
      console.warn("[SERVER] ERROR", name, e);
      evt.source?.postMessage({ type: "LCAP_RPC_RESULT", id, ok: false, error: String(e?.message || e), nonce: sessionNonce }, TRUSTED_ORIGIN);
    }
  });

  console.log("[SERVER] _RB popup RPC ready (nonce + origin protected)");
})();
