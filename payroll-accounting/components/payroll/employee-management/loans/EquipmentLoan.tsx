import CustomButton from "@/components/common/CustomButton";
import FormInput from "@/components/common/formInput/formInput";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import { EmployeeLoan, EmployeeLoanCategory } from "@/graphql/gql/graphql";
import useGetEmployeeLoans from "@/hooks/employee-loans/useGetEmployeeLoans";
import useUpsertEmployeeLoans from "@/hooks/employee-loans/useUpsertEmployeeLoans";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import usePaginationState from "@/hooks/usePaginationState";
import { requiredField } from "@/utility/helper";
import NumeralFormatter from "@/utility/numeral-formatter";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Form, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd/lib";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
interface variables {
  page: number;
  size: number;
}

const initialState: variables = {
  size: 25,
  page: 0,
};
function EquipmentLoan() {
  const router = useRouter();
  const [state, { onNextPage }] = usePaginationState(initialState, 0, 25);
  const [data, loading, refetch] = useGetEmployeeLoans(
    state,
    EmployeeLoanCategory.EquipmentLoan,
    router?.query?.id as string
  );
  const [showPasswordConfirmation] = ConfirmationPasswordHook();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [upsert, loadingUpsert] = useUpsertEmployeeLoans(() => {
    refetch();
    form.resetFields();
    setOpen(false);
  });
  const columns: ColumnsType<EmployeeLoan> = [
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (text) => {
        return <div>{dayjs(text).format("MMMM Do YYYY, h:mm a")}</div>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => <NumeralFormatter format={"0,0.[00]"} value={value} />,
    },
    {
      title: "Remarks",
      dataIndex: "description",
    },
  ];

  const onSubmit = (values: any) => {
    Modal.confirm({
      title: <>Are you sure you want to add this loan item?</>,
      content: <>This action is irreversible. Proceed?</>,
      okText: "Confirm",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        showPasswordConfirmation(() => {
          upsert({
            employeeId: router?.query?.id as string,
            category: EmployeeLoanCategory.EquipmentLoan,
            amount: values?.amount,
            description: values?.description,
          });
        });
      },
      onCancel() {},
    });
  };

  return (
    <>
      <div style={{ marginBottom: 10, display: "flex", justifyContent: "end" }}>
        <CustomButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
          allowedPermissions={["create_equipment_loan_beginning_balance"]}
        >
          Add Beginning Balance
        </CustomButton>
      </div>
      <Table
        columns={columns}
        dataSource={data?.content as EmployeeLoan[]}
        loading={loading}
        onChange={onNextPage}
      />

      <Modal
        title="Equipment Loan Beginning Balance"
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="equipment_loan_form"
            loading={loadingUpsert}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        }
      >
        <Form
          name="equipment_loan_form"
          layout="vertical"
          onFinish={onSubmit}
          form={form}
          initialValues={{
            amount: null,
            remarks: null,
          }}
        >
          <>
            <FormInputNumber
              name="amount"
              rules={requiredField}
              label="Amount"
              propsinputnumber={{
                placeholder: "amount",
              }}
            />
            <FormInput
              name="description"
              rules={requiredField}
              label="Remarks"
              propsinput={{
                placeholder: "Remarks",
              }}
            />
          </>
        </Form>
      </Modal>
    </>
  );
}

export default EquipmentLoan;
