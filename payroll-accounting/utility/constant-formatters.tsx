export const payrollStatusColorGenerator = (value: string) => {
  switch (value) {
    case "DRAFT":
      return "orange";
    case "ACTIVE":
      return "blue";
    case "CANCELLED":
      return "red";
    case "FINALIZED":
      return "green";
    default:
      return "white";
  }
};
