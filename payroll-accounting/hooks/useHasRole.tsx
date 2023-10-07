import { isInAnyRole } from "@/components/accessControl/AccessManager";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { useContext } from "react";

const useHasRole = (allowedRoles: any) => {
  const accountContext = useContext(AccountContext) || {};
  const { roles } = accountContext?.user || {};

  if (allowedRoles.length === 0)
    throw new Error("Must provide array of allowed permission.");
  return isInAnyRole(roles, allowedRoles);
};

export default useHasRole;
