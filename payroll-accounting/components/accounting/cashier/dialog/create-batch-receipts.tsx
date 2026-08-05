import { FormCheckBox } from "@/components/common";
import FormInput from "@/components/common/formInput/formInput";
import FormSearch from "@/components/common/formSearch";
import FormSelect from "@/components/common/formSelect/formSelect";
import {
  CREATE_BATCH_RECEIPTS,
  GET_RECEIPT_TYPES,
} from "@/graphql/cashier/queries";
import { BatchReceipt } from "@/graphql/gql/graphql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Form, Modal } from "antd";
import { access } from "fs";

interface ModalProps {
  hide: (success: boolean) => void;
  record: BatchReceipt;
}

const TERMINALS = gql`
  query {
    terminals {
      value: id
      label: terminal_no
    }
  }
`;

export default function CreateBatchReceipts({ record, ...props }: ModalProps) {
  const [form] = Form.useForm();
  const { data } = useQuery(TERMINALS);
  const terminals = data?.terminals || [];

  const { data: receiptTypeData } = useQuery(GET_RECEIPT_TYPES);
  const receiptTypes = receiptTypeData?.receiptTypeOptions || [];

  const [createBatchReceipts] = useMutation(CREATE_BATCH_RECEIPTS);

  function onHandleCreate(values: any) {
    createBatchReceipts({
      variables: {
        id: record?.id || null,
        fields: {
          active: true,
          ...values,
          terminal: {
            id: values.terminal,
          },
        },
      },
      onCompleted: () => props.hide(true),
    });
  }

  return (
    <Modal
      title="Batch Receipts"
      open
      onCancel={() => props.hide(false)}
      onOk={() => form.submit()}
      okText={record?.id ? "Update" : "Create"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onHandleCreate}
        initialValues={{ ...record, terminal: record?.terminal?.id }}
      >
        <FormInput label="Batch Code" name="batchCode" />
        <FormSelect
          label="Receipt Type"
          name="receiptType"
          propsselect={{
            options: receiptTypes,
          }}
        />
        <FormInput label="Receipt Current No" name="receiptCurrentNo" />
        <FormInput label="Range Start" name="rangeStart" />
        <FormInput label="Range End" name="rangeEnd" />
        <FormSelect
          label="Terminal"
          name="terminal"
          propsselect={{
            options: terminals,
          }}
        />
        <FormCheckBox
          checkBoxLabel="Is active"
          name="active"
          valuePropName="checked"
          propscheckbox={{}}
        />
      </Form>
    </Modal>
  );
}
