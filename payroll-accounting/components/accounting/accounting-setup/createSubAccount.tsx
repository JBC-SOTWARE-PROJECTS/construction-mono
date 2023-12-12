import {
  FormCheckBox,
  FormInput,
  FormSegment,
  FormSelect,
  FormTextArea,
} from "@/components/common";
import { Maybe, SubAccountSetup } from "@/graphql/gql/graphql";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Divider, Form, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { DomainEnum } from "../enum/parentAccountEnum";

interface CreateSubAccountI {
  hide: () => void;
  record: SubAccountSetup;
}

const GROUP_ACCOUNT_TYPES = gql`
  query {
    parentAccountsPerCategory {
      label
      options {
        label
        value
      }
    }
  }
`;

const UPDATE_INSERT = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID) {
    subAccount: upsertSubAccount(fields: $fields, id: $id) {
      payload {
        id
      }
      message
      success
    }
  }
`;

const SUB_ACCOUNT_PARENT = gql`
  query ($parentAccountId: UUID) {
    parentSubAccounts: getSubAccountForParent(
      parentAccountId: $parentAccountId
    ) {
      value: id
      label: accountName
    }
  }
`;

const SUB_ACCOUNT_DOMAINS = gql`
  query {
    subAccountDomains {
      label
      value
    }
  }
`;

const SUB_ACCOUNT_DOMAINS_RECORDS = gql`
  query ($domain: DomainEnum) {
    domainRecords: subAccountDomainsRecords(domain: $domain) {
      label
      value
    }
  }
`;

export default function CreateSubAccount(props: CreateSubAccountI) {
  const { record, hide } = props;

  const [form] = Form.useForm();
  const [subType, setSubType] = useState(
    record?.sourceDomain
      ? record?.sourceDomain == DomainEnum.NO_DOMAIN.toString()
        ? "default"
        : "records"
      : "default"
  );

  const { data, loading } = useQuery(GROUP_ACCOUNT_TYPES);
  const { data: domainData, loading: domainLoading } =
    useQuery(SUB_ACCOUNT_DOMAINS);

  const [loadDomainRecords, { data: domainRecordsData }] = useLazyQuery(
    SUB_ACCOUNT_DOMAINS_RECORDS
  );

  const [
    loadSubAccountOpt,
    { loading: subAccountLoading, data: subAccountData },
  ] = useLazyQuery(SUB_ACCOUNT_PARENT);

  const [updateInsert, { loading: updateInsertLoading }] = useMutation(
    UPDATE_INSERT,
    {
      onCompleted: ({ subAccount }) => {
        if (subAccount?.success) {
          message.success(subAccount?.message);
          hide();
        } else {
          message.error(subAccount?.message);
        }
      },
    }
  );

  const onHandleClickOk = (values: SubAccountSetup) => {
    const { subType } = form.getFieldsValue();
    const fields = { ...values };
    fields.sourceDomain = (
      subType == "default" ? DomainEnum.NO_DOMAIN : fields.sourceDomain
    ) as any;

    if (!fields.domainExcludes) fields.domainExcludes = [];
    else
      fields.domainExcludes = fields.domainExcludes.map((de) => ({
        value: de?.value,
        label: de?.label,
        key: de?.value,
      }));

    updateInsert({
      variables: {
        id: record?.id,
        fields,
      },
    });
  };

  const onHandleSelectParent = (parentAccountId: string) => {
    loadSubAccountOpt({
      variables: {
        parentAccountId,
      },
    });
  };

  const onChangeDomain = (e: string) => {
    loadDomainRecords({
      variables: {
        domain: e,
      },
    });
    form.setFieldValue("domainExcludes", []);
  };

  useEffect(() => {
    if (record?.parentAccount) {
      loadSubAccountOpt({
        variables: {
          parentAccountId: record?.parentAccount,
        },
      });
    }

    if (record?.sourceDomain) {
      loadDomainRecords({
        variables: {
          domain: record?.sourceDomain,
        },
      });
    }
  }, [record, loadSubAccountOpt, loadDomainRecords]);

  return (
    <Modal
      open
      title="Add New Sub-Account"
      onCancel={() => props.hide()}
      okText={record?.id ? "Save" : "Create"}
      onOk={() => form.submit()}
      okButtonProps={{ loading: updateInsertLoading }}
      cancelButtonProps={{ loading: updateInsertLoading }}>
      <Divider />
      <Form
        form={form}
        name="form-sub-account"
        autoComplete="off"
        initialValues={{
          ...record,
          subType: record?.sourceDomain
            ? record?.sourceDomain == DomainEnum.NO_DOMAIN.toString()
              ? "default"
              : "records"
            : "default",
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onHandleClickOk}>
        <FormSelect
          name="parentAccount"
          label="Parent Accounts"
          propsselect={{
            showSearch: true,
            options: data?.parentAccountsPerCategory ?? [],
            optionFilterProp: "label",
            onSelect: (e) => onHandleSelectParent(e),
          }}
          rules={[{ required: true }]}
        />

        <FormSelect
          name={["subaccountParent", "id"]}
          label="Parent Sub-accounts"
          propsselect={{
            allowClear: true,
            showSearch: true,
            options: subAccountData?.parentSubAccounts ?? [],
          }}
        />

        <FormSegment
          name="subType"
          label="Sub-account Type"
          propssegment={{
            options: [
              {
                label: "Default",
                value: "default",
                icon: <BarsOutlined />,
              },
              {
                label: "Data Records",
                value: "records",
                icon: <AppstoreOutlined />,
              },
            ],
            onChange: (e: any) => setSubType(e),
          }}
        />

        {subType == "default" ? (
          <>
            <FormInput
              name="subaccountCode"
              label="Code"
              rules={[{ required: true }]}
            />

            <FormInput
              name="accountName"
              label="Name"
              rules={[{ required: true }]}
            />

            <FormTextArea name="description" label="Description (Optional)" />
          </>
        ) : (
          <>
            <FormSelect
              name="sourceDomain"
              label="Data Records"
              propsselect={{
                showSearch: true,
                allowClear: true,
                options: domainData?.subAccountDomains ?? [],
                onChange: (e) => onChangeDomain(e),
              }}
            />
            <FormSelect
              name="domainExcludes"
              label="Exclude data"
              propsselect={{
                showSearch: true,
                mode: "tags",
                allowClear: true,
                options: domainRecordsData?.domainRecords ?? [],
                labelInValue: true,
              }}
            />
          </>
        )}

        <FormCheckBox
          name="isInactive"
          label="Depreciate"
          valuePropName="checked"
          propscheckbox={{}}
        />
      </Form>
    </Modal>
  );
}
