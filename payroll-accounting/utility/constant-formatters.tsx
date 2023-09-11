import { PayrollStatus } from "@/graphql/gql/graphql";
import { Maybe } from "graphql/jsutils/Maybe";

export const payrollStatusColorGenerator = (value: Maybe<PayrollStatus>) => {
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
