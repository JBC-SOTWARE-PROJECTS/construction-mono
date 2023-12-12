import CustomButton from "@/components/common/CustomButton";
import FormInput from "@/components/common/formInput/formInput";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import FormSelect from "@/components/common/formSelect/formSelect";
import { PayrollEmployeeAllowanceDto } from "@/graphql/gql/graphql";
import useGetAllAllowances from "@/hooks/allowance/useGetAllAllowances";
import useUpsertPayrollAllowanceItem from "@/hooks/payroll/allowance/useUpsertPayrollAllowanceItem";
import NumeralFormatter from "@/utility/numeral-formatter";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Tag } from "antd";
import { useState } from "react";

interface IParams {
  refetch: () => void;
  employees: PayrollEmployeeAllowanceDto[];
}

function AddPayrollAllowanceItemModal({ refetch, employees }: IParams) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [ids, setIds] = useState<string[]>([]);
  const [upsertItem, loadingUpsertItem] = useUpsertPayrollAllowanceItem(() => {
    setOpen(false);
    refetch();
    form.resetFields();
  });

  const [allowances, loadingAllowances] = useGetAllAllowances();

  const onSubmit = (values: any) => {
    upsertItem(values);
  };

  return (
    <>
      <CustomButton
        type="primary"
        onClick={() => setOpen(true)}
        icon={<PlusOutlined />}
      >
        Add Allowance Items
      </CustomButton>

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        title="Allowance Item"
        footer={
          <Space>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              form={`upsertform-adjustment`}
              loading={false}
              icon={<SaveOutlined />}
            >
              Save
            </Button>
          </Space>
        }
      >
        <Form
          name={`upsertform-adjustment`}
          layout="vertical"
          onFinish={onSubmit}
          form={form}
          initialValues={{}}
        >
          <FormSelect
            name="employeeId"
            label="Employee"
            propsselect={{
              options: employees?.map((item: any) => ({
                value: item.id,
                label: item.employeeName,
              })),
            }}
            rules={[{ required: true }]}
          />

          <FormSelect
            name="allowanceId"
            label="Allowance"
            propsselect={{
              options: allowances?.map((item: any) => ({
                value: item.id,
                label: item.name,
                amount: item.amount,
              })),
              onChange: (value, option: any) => {
                form.setFieldValue("amount", option?.amount);
              },
            }}
            rules={[{ required: true }]}
          />
          {/* <FormSelect
            name="employee"
            label="Employee"
            propsselect={{
              options: employeeList?.map((item) => ({
                value: item.id,
                label: item.employeeName,
              })),
            }}
            rules={[{ required: true }]}
          /> */}

          <FormInputNumber
            name="amount"
            label="Amount"
            propsinputnumber={{
              placeholder: "Description",
            }}
          />
        </Form>
      </Modal>
    </>
  );
}

export default AddPayrollAllowanceItemModal;
