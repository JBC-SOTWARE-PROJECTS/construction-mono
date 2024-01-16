import FormInput from "@/components/common/formInput/formInput";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import FormSelect from "@/components/common/formSelect/formSelect";
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
import { Button, Form, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
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
function CashAdvance() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [state, { onNextPage }] = usePaginationState(initialState, 0, 25);
  const [open, setOpen] = useState(false);
  const [showPasswordConfirmation] = ConfirmationPasswordHook();

  const [data, loading, refetch] = useGetEmployeeLoans(
    state,
    EmployeeLoanCategory.CashAdvance,
    router?.query?.id as string
  );
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
            category: EmployeeLoanCategory.CashAdvance,
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.content as EmployeeLoan[]}
        loading={loading || loadingUpsert}
        onChange={onNextPage}
      />

      <Modal
        title="Create Cash Advance"
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="cash_advance_form"
            loading={loadingUpsert}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        }
      >
        <Form
          name="cash_advance_form"
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

export default CashAdvance;
