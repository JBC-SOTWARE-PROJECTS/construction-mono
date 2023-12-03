import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { PaymentTerm, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_PAYMENT_TERMS } from "@/graphql/inventory/masterfile-queries";
import UpsertPaymentTermsModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertPaymentTerms";
import PaymentTermsTable from "@/components/inventory/masterfile/other-configurations/paymentTermsTable";

const { Search } = Input;

export default function PaymentTermsComponent() {
  const modal = useDialog(UpsertPaymentTermsModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_PAYMENT_TERMS,
    {
      variables: {
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: PaymentTerm) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Payment Term successfully updated");
        } else {
          message.success("Payment Term successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Payment Terms Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Payment Terms List"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Search
                  size="middle"
                  placeholder="Search here.."
                  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                  className="w-full"
                />
              </Col>
            </Row>
          </Form>
        </div>
        <PaymentTermsTable
          dataSource={data?.paymentTermList as PaymentTerm[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
