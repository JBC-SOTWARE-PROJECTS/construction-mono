import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form, Button, App } from "antd";
import { GET_ACCOUNTS_TEMPLATES_RECORDS } from "@/graphql/payables/config-queries";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { ApAccountsTemplate, Query } from "@/graphql/gql/graphql";
import FormSelect from "@/components/common/formSelect/formSelect";
import { AP_TRANSCTION_CATEGORY } from "@/utility/constant";
import _ from "lodash";
import { useSupplierTypes } from "@/hooks/payables";
import { useDialog } from "@/hooks";
import APAccountsTemplateModal from "@/components/accounting/accounting-setup/templates/apAccountsTemplateModal";
import AccountsTemplateTable from "@/components/accounting/accounting-setup/accountsTemplatesTable";
import AccountTemplatesEntries from "@/components/accounting/accounting-setup/templates/accountsEntriesModal";

const { Search } = Input;

export default function AccountsTemplateComponent() {
  const { message } = App.useApp();
  const types = useSupplierTypes();
  const modal = useDialog(APAccountsTemplateModal);
  const accountModal = useDialog(AccountTemplatesEntries);
  const [supplierTypes, setSupplierType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });

  const { data, loading, refetch } = useQuery<Query>(
    GET_ACCOUNTS_TEMPLATES_RECORDS,
    {
      variables: {
        desc: state.filter,
        type: supplierTypes,
        category: category,
        page: state.page,
        size: state.size,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const cleared = () => {
    setState((prev) => ({ ...prev, page: 0 }));
  };

  const getLabel = (value: string) => {
    let object = _.find(AP_TRANSCTION_CATEGORY, ["value", value]);
    return !_.isEmpty(object) ? object.label : "";
  };

  const upsertShowModal = (record?: ApAccountsTemplate) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        refetch();
        if (record?.id) {
          message.success("Accounts Template successfully updated");
        } else {
          message.success("Accounts Template successfully added");
        }
      }
    });
  };

  const configureAccounts = (record?: ApAccountsTemplate) => {
    accountModal({ id: record?.id }, (result: any) => {
      if (result) {
        refetch();
        message.success("Accounts Template successfully updated");
      }
    });
  };

  return (
    <PageContainer title="Accounts Template">
      <ProCard
        title="Accounts Template List"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) =>
                setState((prev) => ({ ...prev, filter: e, page: 0 }))
              }
              className="select-header"
            />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => upsertShowModal()}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <FormSelect
                  label="Filter Supplier Types"
                  propsselect={{
                    value: supplierTypes,
                    options: types,
                    allowClear: true,
                    placeholder: "Select Supplier Types",
                    onChange: (newValue) => {
                      cleared();
                      setSupplierType(newValue);
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormSelect
                  label="Filter Transacton Category"
                  propsselect={{
                    value: category,
                    options: AP_TRANSCTION_CATEGORY,
                    allowClear: true,
                    placeholder: "Select Transaction Category",
                    onChange: (newValue) => {
                      cleared();
                      setCategory(newValue);
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <AccountsTemplateTable
          dataSource={
            data?.apAccountsTemplatePage?.content as ApAccountsTemplate[]
          }
          loading={loading}
          totalElements={data?.apTransactionPage?.totalElements as number}
          currentPage={data?.apTransactionPage?.number as number}
          handleOpen={(record) => upsertShowModal(record)}
          handleOpenCreateAccounts={(record) => configureAccounts(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
          getLabel={getLabel}
        />
      </ProCard>
    </PageContainer>
  );
}
