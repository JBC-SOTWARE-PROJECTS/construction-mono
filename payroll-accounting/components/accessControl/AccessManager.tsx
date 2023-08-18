import { AccountContext } from "./AccountContext";
import React, { useContext } from "react";
import _, { isArray, includes } from "lodash";
import Custom403 from "@/pages/403";

interface IProps {
  roles: string[];
  children?: React.ReactNode;
}

export function isInRole(role: string, rolesRepo: string[]) {
  return includes(rolesRepo || [], role);
}

export function isInAnyRole(roles: string[], rolesRepo: string[]) {
  roles = _.isArray(roles) ? roles : [];
  var found = false;
  roles.forEach(function (i) {
    // console.log(i)
    if (isInRole(i, rolesRepo)) {
      found = true;
    }
  });

  return found;
}

const AccessManager = ({ roles, children }: IProps) => {
  const accountContext = useContext(AccountContext);

  //allowedRoles
  const allowedRoles: string[] = roles || ["USER"];

  const account = accountContext;

  const currentRoles = _.get(account, "role", ["USER"]);

  if (isArray(allowedRoles)) {
    if (isInAnyRole(allowedRoles, currentRoles)) {
      return <>{children}</>;
    }
  }

  return <Custom403 />;
};

export default AccessManager;
