import PayrollForm, {
  PayrollFormUsage,
} from "@/components/payroll/PayrollForm";
import { IPageProps, IPaginationFilters } from "@/utility/interfaces";
import { PageContainer } from "@ant-design/pro-components";
import { Input } from "antd";

const { Search } = Input;

interface IState {
  filter: string;
  page: number;
  size: number;
  status: boolean | null;
  office: string | null;
  position: string | null;
}

const initialState: IPaginationFilters = {
  filter: "",
  page: 0,
  size: 10,
};

export default function EditPayroll({ account }: IPageProps) {
  return (
    <PageContainer>
      <PayrollForm usage={PayrollFormUsage.EDIT} />
    </PageContainer>
  );
}
