import { Projects } from "@/graphql/gql/graphql";
import React, { createContext, useMemo, useState } from "react";

interface AppContextInterface {
  projectInfo: Projects;
  setProjectInfo: React.Dispatch<React.SetStateAction<Projects | undefined>>;
}

export const AppContext = createContext<AppContextInterface>(
  {} as AppContextInterface
);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectInfo, setProjectInfo] = useState<Projects>({} as Projects);
  const projectObject = useMemo(
    () => ({ projectInfo, setProjectInfo }),
    [projectInfo]
  );

  return (
    <AppContext.Provider
      value={
        {
          ...projectObject,
        } as AppContextInterface
      }>
      {children}
    </AppContext.Provider>
  );
};
