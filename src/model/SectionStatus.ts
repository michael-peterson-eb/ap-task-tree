export const fetchObjectSectionStatuses = async (recordInfo: any) => {
  try {
    const condition = `id=${recordInfo?.id}`;

    const results = await _RB.selectQuery(
      ["EA_SA_txtaSectionStatuses"],
      recordInfo?.objectIntegrationName,
      condition,
      1,
      true
    );

    let status = "{}"; // string empty object
    if (results.length > 0) status = results[0];
    return status;
  } catch (error) {
    console.log("Error: fetchObjectSectionStatuses ", error);
  }
};

export const updateStatusJSON = async (recordInfo: any, value: any) => {
  try {
    let fields = {
      EA_SA_txtaSectionStatuses: JSON.stringify(value),
    };

    const results = await _RB.updateRecord(
      recordInfo.objectIntegrationName,
      recordInfo.id,
      fields
    );

    return results;
  } catch (error) {
    console.log("Error: updateStatusJSON ", error);
  }
};
