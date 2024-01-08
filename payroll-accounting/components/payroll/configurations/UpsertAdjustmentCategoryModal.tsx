import CustomButton from "@/components/common/CustomButton";
import FormCheckBox from "@/components/common/formCheckBox/formCheckBox";
import FormInput from "@/components/common/formInput/formInput";
import FormSelect from "@/components/common/formSelect/formSelect";
import { AdjustmentCategory, AdjustmentOperation } from "@/graphql/gql/graphql";
import useUpsertAdjustmentCategory from "@/hooks/adjustment-category/useUpsertAdjustmentCategory";
import { EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Space, Spin } from "antd";
import { useState } from "react";

interface IProps {
  record?: AdjustmentCategory;
  refetch: () => void;
}

function UpsertAdjustmentCategoryModal({ refetch, record }: IProps) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);
  const [upsert, loadingUpsert] = useUpsertAdjustmentCategory(() => {
    setOpen(false);
    refetch();
    if (!record) {
      form.resetFields();
    }
  });

  const onSubmit = (values: AdjustmentCategory) => {
    upsert({ id: record?.id, fields: values });
  };
  return (
    <>
      <CustomButton
        type="primary"
        onClick={() => setOpen(true)}
        icon={!record ? <PlusOutlined /> : <EditOutlined />}
        shape={record ? "circle" : "default"}
        ghost
      >
        {!record && " Add Adjustment Category"}
      </CustomButton>
      <Spin spinning={loadingUpsert}>
        <Modal
          open={open}
          onCancel={() => {
            setOpen(false);
            if (!record) {
              form.resetFields();
            }
          }}
          title="Adjustment Category"
          footer={
            <Space>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                form={`upsertform-${record?.id}`}
                loading={false}
                icon={<SaveOutlined />}
              >
                Save
              </Button>
            </Space>
          }
        >
          <Form
            name={`upsertform-${record?.id}`}
            layout="vertical"
            onFinish={onSubmit}
            form={form}
            initialValues={{
              description: record?.description,
              name: record?.name,
              status: record?.status || true,
              operation: record?.operation,
            }}
          >
            <FormInput
              name="name"
              rules={[{ required: true }]}
              label="Name"
              propsinput={{
                placeholder: "Name",
              }}
            />

            <FormInput
              name="description"
              label="Description"
              propsinput={{
                placeholder: "Description",
              }}
            />

            <FormCheckBox
              name="status"
              valuePropName="checked"
              checkBoxLabel="Status"
              propscheckbox={{
                defaultChecked: true,
              }}
            />
            <FormSelect
              name="operation"
              label="Operation"
              propsselect={{
                options: Object.values(AdjustmentOperation).map((item) => ({
                  value: item,
                  label: item.replace("_", " "),
                })),
              }}
              rules={[{ required: true }]}
            />
          </Form>
        </Modal>
      </Spin>
    </>
  );
}

export default UpsertAdjustmentCategoryModal;
