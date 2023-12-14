import { FormInput } from "@/components/common";
import FormCheckBox from "@/components/common/formCheckBox/formCheckBox";
import FormSelect from "@/components/common/formSelect/formSelect";
import { SubAccountSetup } from "@/graphql/gql/graphql";
import { BookOutlined } from "@ant-design/icons";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Form, Modal } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
interface AddAccountProps {
  hide: (hideProps: any) => {};
  row?: any;
  domain: string;
  integrationId: string;
}

const ACCOUNT_VALUES = gql`
  query ($domain: IntegrationDomainEnum, $target: String) {
    fields: getSpecificFieldsFromDomain(domain: $domain, target: $target)
  }
`;
const SOURCE_GQL = gql`
  query ($domain: IntegrationDomainEnum) {
    sourceColumns: getBigDecimalFieldsFromDomain(domain: $domain)
  }
`;

const INTEGRATION_MUTATE = gql`
  mutation UpdateIntegrationItem(
    $fields: Map_String_ObjectScalar
    $integrationId: UUID
    $integrationItemId: UUID
  ) {
    updateIntegrationItem(
      fields: $fields
      integrationId: $integrationId
      integrationItemId: $integrationItemId
    )
  }
`;

const EditAccount = (props: AddAccountProps) => {
  const [form] = Form.useForm();
  const [subAccount, setSubAccount] = useState<string[]>([]);
  const [subSubAccount, setSubSubAccount] = useState<string[]>([]);

  const { data: sourceData, loading: sourceLoading } = useQuery(SOURCE_GQL, {
    variables: {
      domain: props?.domain,
    },
  });
  const [onShowAccountVal, { loading }] = useLazyQuery(ACCOUNT_VALUES);

  const [integrationMutation, { loading: integrationLoading }] = useMutation(
    INTEGRATION_MUTATE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        props.hide(true);
      },
    }
  );

  const handleSubmmit = (values: any) => {
    const { subAccount, subSubAccount } = props?.row?.journalAccount;
    const fields = {
      sourceColumn: values?.sourceColumn,
      multiple: values?.multiple,
      details: {} as any,
    };

    if (values?.subAccount)
      fields.details[subAccount.domain] = values?.subAccount ?? "";

    if (values?.subSubAccount)
      fields.details[subSubAccount.domain] = values?.subSubAccount ?? "";

    integrationMutation({
      variables: {
        integrationId: props?.integrationId,
        integrationItemId: props?.row?.id,
        fields,
      },
    });
  };

  useEffect(() => {
    const { subAccount, subSubAccount, details } = props?.row?.journalAccount;
    if (subAccount?.domain) {
      onShowAccountVal({
        variables: {
          target: subAccount?.domain,
          domain: props?.domain,
        },
        onCompleted: ({ fields }) => {
          if (fields) {
            setSubAccount([...fields]);
            form.setFieldValue(
              "subAccount",
              props?.row?.details[subAccount?.domain]
            );
          }
        },
      });
    } else {
      form.setFieldValue("subAccountInput", subAccount?.accountName);
    }
    if (subSubAccount?.domain) {
      onShowAccountVal({
        variables: {
          target: subSubAccount?.domain,
          domain: props?.domain,
        },
        onCompleted: ({ fields }) => {
          if (fields) {
            setSubSubAccount([...fields]);
            form.setFieldValue(
              "subSubAccount",
              props?.row?.details[subSubAccount?.domain]
            );
          }
        },
      });
    } else {
      form.setFieldValue("subSubAccountInput", subSubAccount?.accountName);
    }
  }, [props?.row, onShowAccountVal, props?.domain, form]);

  return (
    <>
      <Modal
        title={"Edit Account Setup"}
        open={true}
        okText={"Update"}
        onOk={() => form.submit()}
        //okButtonProps={{ loading: upsertLoading }}
        onCancel={() => props.hide(false)}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{
            multiple: props?.row?.multiple,
            sourceColumn: props?.row?.sourceColumn,
            motherAccount:
              props?.row?.journalAccount?.motherAccount?.accountName,
          }}
          onFinish={handleSubmmit}
          autoComplete="off"
        >
          <FormInput
            label="Parent Account"
            name={"motherAccount"}
            propsinput={{
              placeholder: "Parent Account",
              readOnly: true,
            }}
          />

          {subAccount.length > 0 ? (
            <FormSelect
              label="First Child Account"
              name="subAccount"
              propsselect={{
                showSearch: true,
                options: subAccount.map((opt) => ({
                  label: opt,
                  value: opt,
                })),
              }}
            />
          ) : (
            <FormInput
              label="First Child Account"
              name="subAccountInput"
              propsinput={{ readOnly: true }}
            />
          )}

          {subSubAccount.length > 0 ? (
            <FormSelect
              label="Second Child Account"
              name="subSubAccount"
              propsselect={{
                showSearch: true,
                options: subSubAccount.map((opt) => ({
                  label: opt,
                  value: opt,
                })),
              }}
            />
          ) : (
            <FormInput
              label="Second Child Account"
              name="subSubAccount"
              propsinput={{ readOnly: true }}
            />
          )}

          <FormSelect
            label="Source value"
            name="sourceColumn"
            propsselect={{
              showSearch: true,
              options: (sourceData?.sourceColumns ?? []).map(
                (columns: string) => ({
                  value: columns,
                  label: _.upperCase(columns),
                })
              ),
            }}
          />
          <FormCheckBox
            name="multiple"
            valuePropName="checked"
            checkBoxLabel="Is Multiple"
            propscheckbox={{
              defaultChecked: false,
            }}
          />
        </Form>
      </Modal>
    </>
  );
};

export default EditAccount;
