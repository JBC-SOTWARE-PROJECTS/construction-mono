import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form, Button, App } from "antd";
import { GET_TRANSACTION_TYPE_RECORDS } from "@/graphql/payables/config-queries";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { ApTransaction, Query } from "@/graphql/gql/graphql";
import FormSelect from "@/components/common/formSelect/formSelect";
import { AP_TRANSCTION_CATEGORY } from "@/utility/constant";
import _ from "lodash";
import { useSupplierTypes } from "@/hooks/payables";
import { useDialog } from "@/hooks";
import APTransactionTypeModal from "@/components/accounting/payables/dialogs/apTransactionTypeModal";
import TransactionTypeTable from "@/components/accounting/payables/config/transactionTypeTable";

const { Search } = Input;

export default function TransactionTypeComponent() {
  const { message } = App.useApp();
  const types = useSupplierTypes();
  const modal = useDialog(APTransactionTypeModal);
  const [supplierTypes, setSupplierType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });

  const { data, loading, refetch } = useQuery<Query>(
    GET_TRANSACTION_TYPE_RECORDS,
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

  const upsertShowModal = (record?: ApTransaction) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        refetch();
        if (record?.id) {
          message.success("Transaction Type successfully updated");
        } else {
          message.success("Transaction Type successfully added");
        }
      }
    });
  };

  return (
    <PageContainer title="Accounts Payable Transaction Type Configuration">
      <ProCard
        title="Transaction Types"
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
        <TransactionTypeTable
          dataSource={data?.apTransactionPage?.content as ApTransaction[]}
          loading={loading}
          totalElements={data?.apTransactionPage?.totalElements as number}
          currentPage={data?.apTransactionPage?.number as number}
          handleOpen={(record) => upsertShowModal(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
          getLabel={getLabel}
        />
      </ProCard>
    </PageContainer>
  );
}
