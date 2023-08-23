import { createContext } from "react";
import { IUserEmployee } from "../../utility/interfaces";

export const NULLACCOUNT: IUserEmployee = {
  id: "",
  fullName: "",
  initialName: "",
  gender: "",
  user: {
    access: [],
    roles: [],
    password: "",
    login: "",
    activated: true,
  },
  position: {
    id: "",
    description: "",
  },
  office: {
    id: "",
    officeDescription: "",
  },
  currentCompany: {
    id: "",
    companyCode: "",
    companyName: "",
  },
};

export const AccountContext = createContext(NULLACCOUNT);

export const AccountProvider = AccountContext.Provider;
export const AccountConsumer = AccountContext.Consumer;
