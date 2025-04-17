/**
 * update Operation Section status
 * @param opSecId
 * @param value
 * @returns
 */
export const updateOpSectionStatus = async (opSecId: any, value: string) => {
  try {
    //@ts-ignore
    const results = await _RB.updateRecord("EA_SA_OperationsSection", opSecId, {
      status: value,
    });

    return results;
  } catch (error) {
    console.log("Error: updateOpSectionStatus ", error);
  }
};
