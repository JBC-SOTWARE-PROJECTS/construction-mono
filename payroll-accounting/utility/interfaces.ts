import dayjs from "dayjs";
import { ReactNode } from "react";

export interface ICredentials {
  username: string;
  password: string;
}

export interface IUserEmployee {
  id: string;
  fullName: string;
  initialName: string;
  gender: string;
  user: TUser;
  position: TPosition;
  office: TOffice;
  currentCompany: TCompany;
}

export interface OptionsValue {
  label: string | null | ReactNode;
  value: string | null;
}

export interface IPageProps {
  account: IUserEmployee;
}

//types
type TPosition = {
  id: string;
  description: string;
};

type TUser = {
  access: string[];
  roles: string[];
  password: string;
  login: string;
  activated: boolean;
};

export type FilterDates = {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
};

export type TEmployee = {
  id: string;
  fullName: string;
};

export type TOffice = {
  id: string;
  officeDescription: string;
};

export type TCompany = {
  id: string;
  companyCode: string;
  companyName: string;
};

export type TDiverseTradeMenu = {
  title?: string;
  subtitle?: string;
  icon?: JSX.Element;
  path?: string;
  customPath?: boolean;
};

export interface IPaginationFilters {
  filter: string;
  page: number;
  size: number;
}
