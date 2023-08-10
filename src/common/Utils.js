export const parseStatus = (strStatus: any) => {
  if (typeof strStatus !== "string") return {};

  try {
    const jObj = JSON.parse(strStatus);
    if (typeof jObj === "string") return {};
    return jObj;
  } catch (error) {
    console.log("Error parsing status :", error)
    return {};
  }
}