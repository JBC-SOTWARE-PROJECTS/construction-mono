import { Employee } from "@/graphql/gql/graphql";
import { useGetEmployeesByFilter } from "@/hooks/employee";
import useGetOnePayroll from "@/hooks/payroll/useGetOnePayroll";
import useGetPayrollEmployees from "@/hooks/payroll/useGetPayrollEmployees";
import useUpsertPayroll from "@/hooks/payroll/useUpsertPayroll";
import { IState } from "@/routes/administrative/Employees";
import { requiredField } from "@/utility/helper";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Col, Divider, Form, Modal, Row, Space, Spin } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useForm } from "antd/lib/form/Form";
import dayjs from "dayjs";
import { capitalize, get } from "lodash";
import { useRouter } from "next/router";
import { Key, useState } from "react";
import EmployeeTable from "../administrative/employees/EmployeeTable";
import { FormDateRange } from "../common";
import FormInput from "../common/formInput/formInput";
import FormTextArea from "../common/formTextArea/formTextArea";
import EmployeeDrawer from "./EmployeeDrawer";
import useUpdatePayrollStatus, {
  PayrollStatus,
} from "@/hooks/payroll/useUpdatePayrollStatus";
const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

export const PayrollFormUsage = {
  CREATE: "CREATE",
  EDIT: "EDIT",
  EDIT_EMPOYEES: "EDIT_EMPLOYEES",
};

interface IProps {
  usage: string;
}
function PayrollForm({ usage }: IProps) {
  const [form] = useForm();
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [selectedIds, setSelectedIds] = useState<Key[]>([]);

  const [_, loadingPayrollEmployees] = useGetPayrollEmployees(
    usage,
    (result) => {
      let ids: Key[] = [];
      result.forEach((item: Employee) => {
        ids.push(item.id);
      });
      setSelectedIds(ids);
      setSelectedEmployees(result);
    }
  );

  const [payroll, loadingPayroll] = useGetOnePayroll(usage, (result) => {
    form.setFieldsValue({
      dateRange: [dayjs(result?.dateStart), dayjs(result?.dateEnd)],
      title: result?.title,
      description: result?.description,
    });
  });

  const [employees, loadingEmployees] = useGetEmployeesByFilter({
    variables: state,
    fetchPolicy: "network-only",
  });

  const [upsert, loadingUpsert] = useUpsertPayroll(usage);
  const [updateStatus, loadingUpdateStatus] = useUpdatePayrollStatus();

  const onSubmit = (values: any) => {
    upsert({
      employeeList: selectedIds,
      fields: {
        title: values.title,
        description: values.description,
        dateStart: dayjs(values?.dateRange[0]).startOf("day"),
        dateEnd: dayjs(values?.dateRange[1]).endOf("day"),
      },
      id: router?.query?.id,
    });
  };

  const confirmStartPayroll = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content: "Please click ok to continue",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        updateStatus(PayrollStatus.ACTIVE);
      },
    });
  };

  const rowSelection: TableRowSelection<Employee> = {
    type: "checkbox",
    onChange: (selectedRowKeys, selectedRows, info) => {
      setSelectedIds(selectedRowKeys);
      setSelectedEmployees(selectedRows);
    },
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedIds,
  };

  return (
    <>
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        title={`${capitalize(usage)} Payroll`}
        extra={
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                loadingUpsert ||
                loadingEmployees ||
                loadingPayroll ||
                loadingUpdateStatus
              }
              icon={<SaveOutlined />}
              form="upsertForm"
            >
              Save Details
            </Button>

            {payroll?.status == "DRAFT" && (
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleOutlined />}
                onClick={(e) => {
                  confirmStartPayroll();
                }}
                // loading={loadingCalcAccumulatedLogs}
                // allowedPermissions={["start_payroll"]}
              >
                Start Payroll
              </Button>
            )}
          </Space>
        }
      >
        <Spin spinning={loadingPayroll || loadingUpdateStatus}>
          <Form
            name="upsertForm"
            layout="vertical"
            onFinish={onSubmit}
            form={form}
          >
            <Row gutter={[8, 0]}>
              <Col span={12}>
                <FormInput
                  name="title"
                  rules={requiredField}
                  label="Title"
                  propsinput={{
                    placeholder: "Title",
                  }}
                  initialValue={get(payroll, "title")}
                />
              </Col>
              <Col span={12}>
                <FormDateRange
                  name="dateRange"
                  label="Date Range"
                  propsrangepicker={{
                    format: "MMMM D, YYYY",
                    use12Hours: true,
                  }}
                />
              </Col>
              <Col span={24}>
                <FormTextArea
                  name="description"
                  label="Description"
                  propstextarea={{ rows: 1 }}
                />
              </Col>
            </Row>
            <Divider />

            <EmployeeDrawer
              selectedEmployees={selectedEmployees}
              loading={loadingPayrollEmployees}
            />

            <EmployeeTable
              dataSource={employees as Employee[]}
              loading={loadingEmployees}
              totalElements={1 as number}
              handleOpen={(record) => console.log("record => ", record)}
              changePage={(page) =>
                setState((prev: any) => ({ ...prev, page: page }))
              }
              hideExtraColumns
              rowSelection={rowSelection}
            />
          </Form>
        </Spin>
      </ProCard>
    </>
  );
}

export default PayrollForm;
