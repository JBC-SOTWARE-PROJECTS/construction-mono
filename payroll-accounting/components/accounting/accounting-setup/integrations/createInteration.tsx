import { FormCheckBox, FormInput, FormSelect } from "@/components/common"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Form, Modal } from "antd"

interface IntegrationsI {
  hide: () => void
  record: any
  integrationGroup: string
}

const UPSERT_RECORD = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID) {
    upsertIntegration(fields: $fields, id: $id)
  }
`

const INTEGRATION_DOMAINS_RECORDS = gql`
  query {
    domainRecords: integrationDomains {
      label
      value
    }
  }
`

export default function CreateIntegration(props: IntegrationsI) {
  const { record, integrationGroup } = props
  const [form] = Form.useForm()

  const [onAddGroup] = useMutation(UPSERT_RECORD, {
    onCompleted: () => {
      props?.hide()
    },
  })

  const { data, loading } = useQuery(INTEGRATION_DOMAINS_RECORDS)

  const onHandleClickOk = (fields: {
    description: string
    integrationGroup: { id: string }
  }) => {
    fields.integrationGroup = { id: integrationGroup }
    onAddGroup({
      variables: {
        id: props?.record?.id ?? null,
        fields,
      },
    })
  }

  return (
    <Modal
      open
      title="Add/Edit New Integration"
      onCancel={() => props.hide()}
      okText={record?.id ? "Save" : "Create"}
      onOk={() => form.submit()}
      // okButtonProps={{ loading: updateInsertLoading }}
      // cancelButtonProps={{ loading: updateInsertLoading }}
    >
      <Form
        form={form}
        onFinish={onHandleClickOk}
        layout="vertical"
        initialValues={{ ...props?.record }}
      >
        <FormInput name="description" label="Integration Name" />
        {!props?.record?.id && (
          <FormSelect
            name="domain"
            label="Data Records"
            propsselect={{
              allowClear: true,
              options: data?.domainRecords ?? [],
            }}
          />
        )}
        <FormInput label="Order No." name="orderPriority" />
        <FormInput label="Flag Value" name="flagValue" />
        <FormCheckBox
          checkBoxLabel="Auto Post"
          name="autoPost"
          valuePropName="checked"
          propscheckbox={{}}
        />
      </Form>
    </Modal>
  )
}
