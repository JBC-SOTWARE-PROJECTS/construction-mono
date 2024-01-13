import { Employee, PayrollStatus } from "@/graphql/gql/graphql";
import { useGetEmployeesByFilter } from "@/hooks/employee";
import useGetOnePayroll from "@/hooks/payroll/useGetOnePayroll";
import useGetPayrollHRMEmployees from "@/hooks/payroll/useGetPayrollHRMEmployees";
import useUpsertPayroll from "@/hooks/payroll/useUpsertPayroll";
import { requiredField } from "@/utility/helper";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Result,
  Row,
  Space,
  Spin,
} from "antd";
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
import useUpdatePayrollStatus from "@/hooks/payroll/useUpdatePayrollStatus";
import CustomButton from "../common/CustomButton";
import AccessControl from "../accessControl/AccessControl";
import { IState } from "@/routes/payroll/employees";
import usePaginationState from "@/hooks/usePaginationState";
import FormSelect from "../common/formSelect/formSelect";
import FormInputNumber from "../common/formInputNumber/formInputNumber";
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
  const [selectedIds, setSelectedIds] = useState<Key[]>([]);
  const [state, { onNextPage }] = usePaginationState(initialState, 0, 25);

  const [_, loadingPayrollEmployees] = useGetPayrollHRMEmployees(
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
        cycle: values.cycle,
        type: values?.type,
        description: values.description,
        dateStart: dayjs(values?.dateRange[0]).startOf("day"),
        dateEnd: dayjs(values?.dateRange[1]).endOf("day"),
      },
      id: router?.query?.id,
    });
  };

  const confirmStartPayroll = () => {
    Modal.confirm({
      title: "Are you sure you start the payroll?",
      content: "Please click ok to continue",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        updateStatus(PayrollStatus.Active);
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
      <AccessControl
        allowedPermissions={["edit_payroll"]}
        renderNoAccess={
          <Result title="You are not authorized to view this page" />
        }
      >
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

              {payroll?.status === PayrollStatus.Draft && (
                <CustomButton
                  type="primary"
                  htmlType="submit"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    confirmStartPayroll();
                  }}
                  loading={loadingUpdateStatus}
                  allowedPermissions={["start_payroll"]}
                >
                  Start Payroll
                </CustomButton>
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
                <Col span={8}>
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
                <Col span={10}>
                  <FormDateRange
                    name="dateRange"
                    label="Date Range"
                    propsrangepicker={{
                      format: "MMMM D, YYYY",
                      use12Hours: true,
                    }}
                  />
                </Col>
                {!loadingPayroll && (
                  <>
                    <Col span={3}>
                      <FormSelect
                        name="type"
                        label="Payroll Type"
                        initialValue={get(payroll, "type")}
                        propsselect={{
                          showSearch: true,
                          options: [
                            {
                              value: "WEEKLY",
                              label: "Weekly",
                            },
                            {
                              value: "SEMI_MONTHLY",
                              label: "Semi-monthly",
                            },
                          ],
                          optionFilterProp: "label",
                        }}
                        rules={[{ required: true }]}
                      />
                    </Col>

                    <Col span={3}>
                      <FormInputNumber
                        label="Payroll Cycle Number"
                        name="cycle"
                        initialValue={get(payroll, "cycle")}
                        propsinputnumber={{ min: 1, max: 5 }}
                        rules={[{ required: true }]}
                      />
                    </Col>
                  </>
                )}

                <Col span={24}>
                  <FormTextArea
                    name="description"
                    label="Description"
                    initialValue={get(payroll, "description")}
                    propstextarea={{ rows: 1 }}
                  />
                </Col>
              </Row>
              <Divider />

              <EmployeeDrawer
                selectedEmployees={selectedEmployees}
                loading={loadingPayrollEmployees}
              >
                View Selected ({selectedEmployees?.length})
              </EmployeeDrawer>

              <EmployeeTable
                dataSource={employees as Employee[]}
                loading={loadingEmployees}
                changePage={onNextPage}
                hideExtraColumns
                rowSelection={rowSelection}
              />
            </Form>
          </Spin>
        </ProCard>
      </AccessControl>
    </>
  );
}

export default PayrollForm;
