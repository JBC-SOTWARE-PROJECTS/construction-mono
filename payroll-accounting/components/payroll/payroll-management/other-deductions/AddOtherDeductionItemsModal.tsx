import CustomButton from "@/components/common/CustomButton";
import FormInput from "@/components/common/formInput/formInput";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import FormSelect from "@/components/common/formSelect/formSelect";
import {
  AdjustmentCategory,
  OtherDeductionTypes,
  PayrollEmployeeOtherDeductionDto,
} from "@/graphql/gql/graphql";
import useGetOtherDeduction from "@/hooks/other-deduction-types/useGetOtherDeduction";
import useUpsertOtherDeductionItem from "@/hooks/payroll/other-deductions/useUpsertOtherDeductionItem";
import useGetChartOfAccounts from "@/hooks/useGetChartOfAccounts";
import { requiredField } from "@/utility/helper";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Tag } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useState } from "react";

interface IParams {
  refetch: () => void;
  employeeList: PayrollEmployeeOtherDeductionDto[];
}

function AddOtherDeductionItemsModal({ refetch, employeeList }: IParams) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [deductionTypes, loading] = useGetOtherDeduction("");
  const [coa, loadingCoa] = useGetChartOfAccounts();

  const [upsert, loadingUpsert] = useUpsertOtherDeductionItem(() => {
    setOpen(false);
    refetch();
    form.resetFields();
  });
  const onSubmit = (values: any) => {
    upsert({
      amount: values.amount,
      name: values.name,
      description: values.description,
      employee: values.employee,
      deductionType: values.deductionType,
      subaccountCode: values.subaccountCode,
    });
  };
  return (
    <>
      <CustomButton
        type="primary"
        onClick={() => setOpen(true)}
        icon={<PlusOutlined />}
      >
        Add Deduction Items
      </CustomButton>

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        title="Deduction Item"
        footer={
          <Space>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              form={`upsertform-otherDeduction`}
              loading={false}
              icon={<SaveOutlined />}
            >
              Save
            </Button>
          </Space>
        }
      >
        <Form
          name={`upsertform-otherDeduction`}
          layout="vertical"
          onFinish={onSubmit}
          form={form}
          initialValues={{}}
        >
          <FormSelect
            name="employee"
            label="Employee"
            propsselect={{
              options: employeeList?.map((item) => ({
                value: item.id,
                label: item.employeeName,
              })),
            }}
            rules={[{ required: true }]}
          />
          <FormSelect
            name="deductionType"
            label="Other Deduction Types"
            propsselect={{
              options: deductionTypes?.map((item: OtherDeductionTypes) => ({
                code: item.subaccountCode,
                value: item.id,
                label: item.name,
              })),
              onChange: (_, record) => {
                const code = (record as DefaultOptionType).code;
                form.setFieldValue("subaccountCode", code as any);
              },
            }}
            rules={[{ required: true }]}
          />
          <FormSelect
            label="Sub Account"
            name="subaccountCode"
            rules={requiredField}
            propsselect={{
              options: coa?.map((item: any) => ({
                value: item.code,
                label: item.accountName.replace("_", " "),
              })),
              allowClear: true,
              showSearch: true,
              placeholder: "Sub Account",
            }}
          />

          <FormInputNumber
            name="amount"
            rules={[{ required: true }]}
            label="Amount"
            propsinputnumber={{
              placeholder: "amount",
            }}
          />

          <FormInput
            name="description"
            label="Description"
            propsinput={{
              placeholder: "Description",
            }}
          />
        </Form>
      </Modal>
    </>
  );
}

export default AddOtherDeductionItemsModal;
