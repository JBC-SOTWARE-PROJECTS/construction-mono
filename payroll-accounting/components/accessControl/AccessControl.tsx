import React, { useContext } from "react";
import { isInAnyRole } from "./AccessManager";
import { AccountContext } from "./AccountContext";

interface IProps {
  allowedPermissions: string[];
  children?: React.ReactNode;
  renderNoAccess?: null | boolean;
}

const AccessControl = ({
  allowedPermissions = [],
  renderNoAccess = null,
  children,
}: IProps) => {
  const accountContext = useContext(AccountContext);

  if (allowedPermissions.length === 0) return children;
  const isAllowed = isInAnyRole(
    accountContext?.user?.access,
    allowedPermissions
  );
  if (!isAllowed) return renderNoAccess;
  else return children;
};

export default AccessControl;
