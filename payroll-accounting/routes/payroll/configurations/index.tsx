import { Sidebar } from "@/components/common";
import ScheduleTypesPage from "@/components/payroll/configurations/ScheduleTypesPage";
import { IPageProps } from "@/utility/interfaces";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";

interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

const menuItems = [
  {
    path: "",
    icon: "",
    label: "Schedule Types Setup",
    content: <ScheduleTypesPage />,
  },
  {
    path: "2",
    icon: "2",
    label: "",
    content: "2",
  },
];

export default function Configurations({ account }: IPageProps) {
  return (
    // <PageContainer title="Configurations">
    //   <Sidebar menuItems={menuItems} />
    // </PageContainer>
    <>
      <Sidebar menuItems={menuItems} />
    </>
  );
}
