/**
 * fetchObjectSectionStatuses
 * @returns
 */
export const fetchObjectSectionStatuses = async () => {
  try {
    const condition = `id=${RECORD_INFO?.id}`;

    const results = await _RB.selectQuery(
      ["EA_SA_txtaSectionStatuses"],
      RECORD_INFO?.objectIntegrationName,
      condition,
      1,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchObjectSectionStatuses ", error);
  }
};

/**
 * updateStatusJSON
 * @param value
 * @returns
 */
export const updateStatusJSON = async (value: any) => {
  try {
    let fields = {
      EA_SA_txtaSectionStatuses: JSON.stringify(value),
    };
    const results = await _RB.updateRecord(
      RECORD_INFO.objectIntegrationName,
      RECORD_INFO.id,
      fields
    );

    return results;
  } catch (error) {
    console.log("Error: updateStatusJSON ", error);
  }
};
