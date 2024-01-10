import CustomButton from "@/components/common/CustomButton";
import FormInput from "@/components/common/formInput/formInput";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import FormSelect from "@/components/common/formSelect/formSelect";
import {
  AdjustmentCategory,
  PayrollAdjustmentItem,
  PayrollEmployeeAdjustmentDto,
} from "@/graphql/gql/graphql";
import useGetAdjustmentCategories from "@/hooks/adjustment-category/useGetAdjustmentCategories";
import useUpsertAdjustmentItem from "@/hooks/payroll/adjustments/useUpsertAdjustmentItem";
import useGetChartOfAccounts from "@/hooks/useGetChartOfAccounts";
import { requiredField } from "@/utility/helper";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Tag } from "antd";
import { DefaultOptionType } from "antd/es/select";
import React, { useState } from "react";

interface IParams {
  refetch: () => void;
  employeeList: PayrollEmployeeAdjustmentDto[];
}

function AddAdjustmentItemsModal({ refetch, employeeList }: IParams) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [categories, loading] = useGetAdjustmentCategories("");
  const [coa, loadingCoa] = useGetChartOfAccounts();
  const [upsert, loadingUpsert] = useUpsertAdjustmentItem(() => {
    setOpen(false);
    refetch();
    form.resetFields();
  });
  const onSubmit = (values: any) => {
    upsert({
      amount: values.amount,
      category: values.category,
      description: values.description,
      employee: values.employee,
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
        Add Adjustment Items
      </CustomButton>

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        title="Adjustment Category"
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
            name="category"
            label="Adjustment Category"
            propsselect={{
              options: categories?.map((item: AdjustmentCategory) => ({
                code: item.subaccountCode,
                value: item.id,
                label: (
                  <>
                    {item.name}{" "}
                    <Tag
                      color={item.operation === "ADDITION" ? "green" : "red"}
                    >
                      {item.operation}
                    </Tag>
                  </>
                ),
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

export default AddAdjustmentItemsModal;
